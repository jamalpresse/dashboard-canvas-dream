import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Custom Error Classes
class WebhookError extends Error {
  constructor(message: string, public status: number, public url: string, public attempt: number) {
    super(message);
    this.name = 'WebhookError';
  }
}

class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class TimeoutError extends Error {
  constructor(message: string, public duration: number) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Structured Logger
const logger = {
  info: (message: string, meta: any = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      service: 'improve-proxy',
      ...meta
    }));
  },
  
  error: (message: string, error: any, meta: any = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      timestamp: new Date().toISOString(),
      service: 'improve-proxy',
      ...meta
    }));
  }
};

// Circuit Breaker
class CircuitBreaker {
  private failureCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private lastFailureTime: number | null = null;

  constructor(private threshold = 5, private resetTime = 60000) {}

  async call<T>(func: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.lastFailureTime && Date.now() - this.lastFailureTime > this.resetTime) {
        this.state = 'HALF_OPEN';
        logger.info('Circuit breaker moving to HALF_OPEN state');
      } else {
        throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
      }
    }

    try {
      const result = await func();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
    if (this.state !== 'CLOSED') {
      logger.info('Circuit breaker closed - service recovered');
    }
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      logger.error('Circuit breaker opened - service marked as unavailable', null, { 
        failureCount: this.failureCount 
      });
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      threshold: this.threshold
    };
  }
}

// Metrics Collector
class MetricsCollector {
  private metrics = {
    requests_total: 0,
    requests_success: 0,
    requests_error_by_type: {} as Record<string, number>,
    response_times: [] as number[],
    circuit_breaker_trips: 0,
    retry_attempts: [] as number[]
  };

  recordRequest(success: boolean, responseTime: number, retries = 0, errorType?: string) {
    this.metrics.requests_total++;
    
    if (success) {
      this.metrics.requests_success++;
    } else if (errorType) {
      this.metrics.requests_error_by_type[errorType] = 
        (this.metrics.requests_error_by_type[errorType] || 0) + 1;
    }
    
    this.metrics.response_times.push(responseTime);
    this.metrics.retry_attempts.push(retries);
    
    // Keep only last 100 entries to prevent memory bloat
    if (this.metrics.response_times.length > 100) {
      this.metrics.response_times.shift();
    }
    if (this.metrics.retry_attempts.length > 100) {
      this.metrics.retry_attempts.shift();
    }
  }

  getSnapshot() {
    const successRate = this.metrics.requests_total > 0 
      ? (this.metrics.requests_success / this.metrics.requests_total) * 100 
      : 0;
    const avgResponseTime = this.metrics.response_times.length > 0
      ? this.metrics.response_times.reduce((a, b) => a + b, 0) / this.metrics.response_times.length
      : 0;
    
    return {
      ...this.metrics,
      success_rate_percent: Math.round(successRate * 100) / 100,
      avg_response_time_ms: Math.round(avgResponseTime * 100) / 100
    };
  }
}

// Enhanced Input Validation
function validateInput(body: any): string {
  const errors: Array<{field: string, message: string}> = [];
  
  const text = (body?.text ?? body?.content ?? body?.input ?? '').toString().trim();
  
  if (!text) {
    errors.push({ field: 'text', message: 'Text is required' });
  }
  
  if (text.length > 50000) {
    errors.push({ field: 'text', message: 'Text too long (max 50000 chars)' });
  }
  
  if (text.length < 5) {
    errors.push({ field: 'text', message: 'Text too short (min 5 chars)' });
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Invalid input', JSON.stringify(errors));
  }
  
  return text;
}

// Error Type Detection
function isRetryableError(error: any): boolean {
  if (error.name === 'TimeoutError') return true;
  if (error.code === 'ECONNRESET') return true;
  
  if (error.status >= 500) return true;
  if (error.status === 429) return true; // Rate limit
  
  // Permanent errors - fail fast
  if (error.status === 400) return false;
  if (error.status === 401) return false;
  if (error.status === 403) return false;
  if (error.status === 404) return false;
  
  return true;
}

// Retry with Exponential Backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>, 
  maxRetries = 3, 
  baseDelay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (!isRetryableError(error) || i === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
      logger.info(`Retry attempt ${i + 1}/${maxRetries}`, { 
        delay: Math.round(delay), 
        error: error.message,
        retryable: isRetryableError(error)
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

// Enhanced Fetch with Timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new TimeoutError(`Request timed out after ${timeoutMs}ms`, timeoutMs);
    }
    throw error;
  }
}

// Global instances
const circuitBreaker = new CircuitBreaker(5, 60000);
const metrics = new MetricsCollector();

serve(async (req) => {
  const startTime = Date.now();
  let retryCount = 0;
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      logger.info('Method not allowed', { method: req.method });
      const responseTime = Date.now() - startTime;
      metrics.recordRequest(false, responseTime, 0, 'METHOD_NOT_ALLOWED');
      
      return new Response(
        JSON.stringify({ 
          error: 'Method not allowed. Only POST requests are accepted.',
          code: 'METHOD_NOT_ALLOWED'
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const text = validateInput(body);

    logger.info('Processing improve request', { 
      textLength: text.length,
      circuitBreakerState: circuitBreaker.getState()
    });

    // Get webhook URLs from environment variables
    const primaryWebhookUrl = Deno.env.get('N8N_IMPROVE_URL') || 'https://automate.ihata.ma/webhook/d2e6c8f7-13aa-4bf7-b714-7f32cf5b0fe5';
    const testWebhookUrl = Deno.env.get('N8N_IMPROVE_TEST_URL') || 'https://automate.ihata.ma/webhook-test/d2e6c8f7-13aa-4bf7-b714-7f32cf5b0fe5';

    logger.info('Using webhook URLs', { primaryWebhookUrl, testWebhookUrl });

    // Webhook calling function with circuit breaker and retry
    const callWebhook = async (url: string, description: string): Promise<{response: Response, text: string}> => {
      return await circuitBreaker.call(async () => {
        return await retryWithBackoff(async () => {
          retryCount++;
          
          logger.info(`Calling webhook: ${description}`, { url, attempt: retryCount });
          
          const response = await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'User-Agent': 'Supabase-Edge-Function/2.0'
            },
            body: JSON.stringify({ text }),
          }, 12000); // 12 second timeout per request

          if (!response.ok) {
            throw new WebhookError(
              `HTTP ${response.status}: ${response.statusText}`, 
              response.status, 
              url, 
              retryCount
            );
          }

          const responseText = await response.text();
          logger.info(`Webhook success: ${description}`, { 
            status: response.status, 
            responseLength: responseText.length 
          });

          return { response, text: responseText };
        }, 3, 1000);
      });
    };

    // Try webhooks in order of preference
    const webhookStrategies = [
      { url: primaryWebhookUrl, description: 'Primary webhook' },
      { url: testWebhookUrl, description: 'Test webhook' }
    ];

    let finalResult: any = null;
    let attemptedUrls: Array<any> = [];
    let successMethod = '';

    for (const strategy of webhookStrategies) {
      try {
        const { response, text: responseText } = await callWebhook(strategy.url, strategy.description);
        
        attemptedUrls.push({
          url: strategy.url,
          method: 'POST',
          status: response.status,
          description: strategy.description,
          success: true
        });

        // Parse response
        let payload: any;
        try {
          payload = responseText.trim() ? JSON.parse(responseText) : { body: '' };
        } catch (e) {
          payload = { body: responseText };
        }

        finalResult = {
          ok: true,
          status: response.status,
          debugVersion: '2025-01-19-v3-enhanced',
          attemptUsed: strategy.description,
          attemptedUrls,
          retryCount,
          circuitBreakerState: circuitBreaker.getState().state,
          metrics: metrics.getSnapshot(),
          ...((typeof payload === 'object' && payload) ? payload : { body: String(payload) })
        };

        successMethod = strategy.description;
        break;

      } catch (error) {
        logger.error(`Strategy failed: ${strategy.description}`, error, { 
          url: strategy.url,
          retryCount 
        });

        attemptedUrls.push({
          url: strategy.url,
          method: 'POST',
          status: error.status || 0,
          description: strategy.description,
          success: false,
          error: error.message
        });

        // Continue to next strategy
        continue;
      }
    }

    if (!finalResult) {
      throw new Error('All webhook strategies failed');
    }

    const responseTime = Date.now() - startTime;
    metrics.recordRequest(true, responseTime, retryCount);

    logger.info('Request completed successfully', {
      method: successMethod,
      responseTime,
      retryCount
    });

    return new Response(JSON.stringify(finalResult), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    const errorType = error.name || 'UNKNOWN_ERROR';
    
    metrics.recordRequest(false, responseTime, retryCount, errorType);
    
    logger.error('Request failed', error, {
      responseTime,
      retryCount,
      errorType
    });

    const errorPayload = {
      ok: false,
      status: 0,
      debugVersion: '2025-01-19-v3-enhanced',
      error: 'Failed to improve text',
      errorType,
      details: error?.message || String(error),
      attemptUsed: 'error-occurred',
      attemptedUrls: [],
      retryCount,
      circuitBreakerState: circuitBreaker.getState().state,
      metrics: metrics.getSnapshot()
    };

    return new Response(
      JSON.stringify(errorPayload),
      { 
        status: error.name === 'ValidationError' ? 400 : 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
