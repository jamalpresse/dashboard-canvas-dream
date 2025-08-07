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
    const webhookUrl = 'http://automate.ihata.ma:5678/webhook/c1d2aee7-e096-4dc9-a69c-023af6631d88';
    
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

    if (!response.ok) {
      console.error('Search proxy - HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Search proxy - Response data:', responseData);

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