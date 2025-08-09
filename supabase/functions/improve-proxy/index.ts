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

    // 20s timeout to avoid hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try { controller.abort(); } catch (_) {}
    }, 20_000);

    let finalRes: Response | null = null;
    let finalText = '';
    try {
      const firstRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        redirect: 'manual',
        signal: controller.signal,
      });

      // Handle redirects manually to preserve POST body
      if (firstRes.status >= 300 && firstRes.status < 400) {
        const location = firstRes.headers.get('location');
        console.log('improve-proxy - redirect status:', firstRes.status, 'location:', location);
        if (location) {
          const redirectedUrl = new URL(location, webhookUrl).toString();
          finalRes = await fetch(redirectedUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
            signal: controller.signal,
          });
        } else {
          finalRes = firstRes;
        }
      } else {
        finalRes = firstRes;
      }

      finalText = await finalRes.text();
      console.log('improve-proxy - upstream status:', finalRes.status);
      console.log('improve-proxy - raw response length:', finalText.length);
    } catch (err) {
      console.error('improve-proxy - upstream error:', (err as any)?.message || String(err));
      throw err;
    } finally {
      clearTimeout(timeoutId);
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
