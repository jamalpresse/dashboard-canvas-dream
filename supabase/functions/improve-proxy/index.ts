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

    const primaryUrl = 'http://automate.ihata.ma/webhook/generate-tags-title';
    const fallbackUrl = 'https://n8n-jamal-u38598.vm.elestio.app/webhook/d921f535-1665-4217-968c-acf14fdd55ce';
    console.log('improve-proxy - trying primary:', primaryUrl);

    let upstream = await fetch(primaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }).catch((e) => {
      console.error('improve-proxy - primary fetch error:', e?.message || e);
      return null;
    });

    let usedUrl = primaryUrl;
    if (!upstream || !upstream.ok) {
      console.warn('improve-proxy - primary failed status:', upstream?.status);
      console.log('improve-proxy - trying fallback:', fallbackUrl);
      upstream = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      usedUrl = fallbackUrl;
    }

    console.log('improve-proxy - used url:', usedUrl);

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

    return new Response(JSON.stringify(payload), {
      status: upstream.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('improve-proxy - error:', error?.message || error);
    return new Response(
      JSON.stringify({ error: 'Failed to improve text', details: error?.message || String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
