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

  try {
    const { query, type = 'search' } = await req.json();
    
    console.log('Search proxy - Received request:', { query, type });

    if (!query || !query.trim()) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Make request to n8n webhook
    const webhookUrl = 'https://automate.ihata.ma/webhook/ace564c4-9f4a-40bf-aa42-fc5f5e29a3c7';
    
    console.log('Search proxy - Making request to:', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        type: type
      }),
    });

    console.log('Search proxy - Response status:', response.status);
    console.log('Search proxy - Response content-type:', response.headers.get('content-type'));

    if (!response.ok) {
      console.error('Search proxy - HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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
    console.error('Search proxy - Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Search service temporarily unavailable',
        details: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});