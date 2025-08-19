import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const text = (body?.text ?? body?.content ?? body?.input ?? '').toString().trim();

    console.log('improve-proxy - received text length:', text.length);

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Missing "text" in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use the confirmed working webhook URL
    const primaryWebhookUrl = 'https://automate.ihata.ma/webhook/d2e6c8f7-13aa-4bf7-b714-7f32cf5b0fe5';
    const testWebhookUrl = 'https://automate.ihata.ma/webhook-test/d2e6c8f7-13aa-4bf7-b714-7f32cf5b0fe5';

    console.log('improve-proxy - primary webhook:', primaryWebhookUrl);

    // Optimized timeout for faster user feedback
    const overallTimeoutMs = 30_000; // Reduced to 30 seconds
    const deadline = Date.now() + overallTimeoutMs;

    const fetchWithTimeout = async (url: string, init: RequestInit) => {
      const remaining = Math.max(1_000, deadline - Date.now());
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        try { controller.abort(); } catch (_) {}
      }, remaining);
      try {
        return await fetch(url, { ...init, signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Try multiple URL variations until one succeeds
    const urlVariations = [
      { url: primaryWebhookUrl, method: 'POST', description: 'POST to primary' },
      { url: primaryWebhookUrl + (primaryWebhookUrl.endsWith('/') ? '' : '/'), method: 'POST', description: 'POST to primary with slash' },
      { url: testWebhookUrl, method: 'POST', description: 'POST to test URL' },
      { url: primaryWebhookUrl, method: 'GET', description: 'GET to primary' },
      { url: primaryWebhookUrl + (primaryWebhookUrl.endsWith('/') ? '' : '/'), method: 'GET', description: 'GET to primary with slash' },
      { url: testWebhookUrl, method: 'GET', description: 'GET to test URL' }
    ];

    let finalRes: Response | null = null;
    let finalText = '';
    let attemptUsed = '';
    const attemptedUrls: Array<{ url: string; method: string; status: number; description: string }> = [];

    try {
      for (const variation of urlVariations) {
        if (Date.now() > deadline) break;

        console.log(`improve-proxy - trying: ${variation.description} (${variation.method} ${variation.url})`);

        try {
          let response: Response;
          
          if (variation.method === 'POST') {
            response = await fetchWithTimeout(variation.url, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'User-Agent': 'Supabase-Edge-Function/1.0'
              },
              body: JSON.stringify({ text }),
              redirect: 'follow',
            });
          } else {
            const getUrl = new URL(variation.url);
            getUrl.searchParams.set('text', text);
            response = await fetchWithTimeout(getUrl.toString(), {
              method: 'GET',
              headers: {
                'User-Agent': 'Supabase-Edge-Function/1.0'
              },
              redirect: 'follow',
            });
          }

          const responseText = await response.text();
          attemptedUrls.push({
            url: variation.url,
            method: variation.method,
            status: response.status,
            description: variation.description
          });

          console.log(`improve-proxy - ${variation.description}: status ${response.status}, length ${responseText.length}`);

          // Accept any 2xx status as success
          if (response.status >= 200 && response.status < 300) {
            finalRes = response;
            finalText = responseText;
            attemptUsed = variation.description;
            console.log(`improve-proxy - SUCCESS with ${variation.description}`);
            break;
          }

        } catch (err) {
          console.log(`improve-proxy - ${variation.description} failed:`, (err as any)?.message || String(err));
          attemptedUrls.push({
            url: variation.url,
            method: variation.method,
            status: 0,
            description: `${variation.description} (error: ${(err as any)?.message || String(err)})`
          });
        }
      }

      if (!finalRes) {
        throw new Error('All webhook URL variations failed');
      }

    } catch (err) {
      console.error('improve-proxy - all attempts failed:', (err as any)?.message || String(err));
      throw err;
    }

    let payload: any;
    try {
      payload = finalText.trim() ? JSON.parse(finalText) : { body: '' };
    } catch (e) {
      // Non-JSON response, return as body string for nicer UI rendering
      payload = { body: finalText };
    }

    const normalized = {
      ok: finalRes?.ok ?? false,
      status: finalRes?.status ?? 0,
      attemptUsed,
      attemptedUrls,
      ...((typeof payload === 'object' && payload) ? payload : { body: String(payload) })
    };

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('improve-proxy - error:', error?.message || error);
    const errorPayload = {
      ok: false,
      status: 0,
      error: 'Failed to improve text',
      details: error?.message || String(error),
    };
    return new Response(
      JSON.stringify(errorPayload),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
