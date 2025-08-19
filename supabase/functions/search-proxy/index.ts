import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 Search proxy - Request received:', req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🚀 Search proxy - Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Search proxy - Processing request body...');
    const requestBody = await req.json();
    const { query, type = 'search' } = requestBody;
    
    console.log('🚀 Search proxy - Received request:', { query, type, fullBody: requestBody });

    if (!query || !query.trim()) {
      console.error('🚀 Search proxy - Missing or empty query');
      return new Response(
        JSON.stringify({ error: 'Query is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Prepare enriched payload for n8n compatibility
    const payload = {
      query: query.trim(),
      q: query.trim(),
      text: query.trim(),
      type: type,
      source: 'search-proxy',
      timestamp: new Date().toISOString()
    };

    // Get webhook URLs from environment or use defaults
    const baseUrl = Deno.env.get('N8N_SEARCH_WEBHOOK_URL') || 'https://automate.ihata.ma/webhook/ace564c4-9f4a-40bf-aa42-fc5f5e29a3c7';
    const testBaseUrl = Deno.env.get('N8N_SEARCH_WEBHOOK_TEST_URL') || baseUrl.replace('/webhook/', '/webhook-test/');
    
    // Define all possible URL variations to try
    const urlVariations = [
      // Production URLs
      { url: baseUrl, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
      { url: baseUrl.endsWith('/') ? baseUrl : baseUrl + '/', method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
      { url: `${baseUrl}?q=${encodeURIComponent(query.trim())}`, method: 'GET', headers: {}, body: null },
      
      // Test URLs
      { url: testBaseUrl, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
      { url: testBaseUrl.endsWith('/') ? testBaseUrl : testBaseUrl + '/', method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
      { url: `${testBaseUrl}?q=${encodeURIComponent(query.trim())}`, method: 'GET', headers: {}, body: null },
    ];

    let response: Response | null = null;
    let lastError: string = '';
    const attemptedUrls: string[] = [];

    console.log('Search proxy - Trying multiple URL variations...');

    // Try each URL variation until we get a successful response
    for (const variation of urlVariations) {
      try {
        console.log(`Search proxy - Trying: ${variation.method} ${variation.url}`);
        attemptedUrls.push(`${variation.method} ${variation.url}`);
        
        const fetchOptions: RequestInit = {
          method: variation.method,
          headers: variation.headers,
        };
        
        if (variation.body) {
          fetchOptions.body = variation.body;
        }
        
        response = await fetch(variation.url, fetchOptions);
        
        console.log(`Search proxy - Response status: ${response.status}`);
        
        if (response.ok) {
          console.log('Search proxy - Success with URL:', variation.url);
          break;
        } else {
          lastError = `HTTP ${response.status}: ${response.statusText}`;
          console.log(`Search proxy - Failed with: ${lastError}`);
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.log(`Search proxy - Error with ${variation.url}:`, lastError);
      }
    }

    if (!response || !response.ok) {
      console.error('🚀 Search proxy - All URL variations failed');
      console.error('🚀 Search proxy - Attempted URLs:', attemptedUrls);
      console.error('🚀 Search proxy - Last error:', lastError);
      
      // Return 200 with error in body instead of 503 to avoid Supabase "non-2xx" error
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Tous les endpoints de recherche sont inaccessibles',
          details: lastError,
          attemptedUrls: attemptedUrls,
          suggestion: 'Vérifiez que le workflow n8n est actif et que l\'URL du webhook est correcte'
        }), 
        {
          status: 200, // Changed from 503 to 200
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Search proxy - Final response content-type:', response.headers.get('content-type'));

    // Get response text first to handle potential JSON parsing issues
    const responseText = await response.text();
    console.log('Search proxy - Raw response text:', responseText);

    let responseData;
    try {
      if (responseText.trim()) {
        responseData = JSON.parse(responseText);
      } else {
        console.warn('Search proxy - Empty response received');
        responseData = { error: 'Empty response from search service' };
      }
    } catch (parseError) {
      console.error('Search proxy - JSON parse error:', parseError);
      // If it's not JSON, treat the text as the result
      responseData = { result: responseText };
    }
    
    console.log('Search proxy - Parsed response data:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('🚀 Search proxy - Unexpected error:', error);
    
    // Return 200 with error in body instead of 500 to avoid Supabase "non-2xx" error
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Search service temporarily unavailable',
        details: error.message,
        suggestion: 'Veuillez réessayer dans quelques instants'
      }), 
      {
        status: 200, // Changed from 500 to 200
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});