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

    const webhookUrl = 'http://automate.ihata.ma/webhook/generate-tags-title';
    console.log('improve-proxy - forwarding to:', webhookUrl);

    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const responseText = await upstream.text();
    console.log('improve-proxy - upstream status:', upstream.status);
    console.log('improve-proxy - raw response length:', responseText.length);

    let payload: any;
    try {
      payload = responseText.trim() ? JSON.parse(responseText) : { body: '' };
    } catch (e) {
      // Non-JSON response, return as body string for nicer UI rendering
      payload = { body: responseText };
    }

    const normalized = {
      ok: upstream.ok,
      status: upstream.status,
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
