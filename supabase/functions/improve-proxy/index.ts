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

    const webhookUrl = 'https://automate.ihata.ma/webhook/c1d2aee7-e096-4dc9-a69c-023af6631d88';
    console.log('improve-proxy - forwarding to:', webhookUrl);

    // Overall timeout to avoid hanging requests
    const overallTimeoutMs = 55_000;
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

    let finalRes: Response | null = null;
    let finalText = '';
    let attempt: 'post' | 'redirect-post' | 'get-fallback' = 'post';
    try {
      const firstRes = await fetchWithTimeout(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        redirect: 'manual',
      });

      // Handle redirects manually to preserve POST body
      if (firstRes.status >= 300 && firstRes.status < 400) {
        const location = firstRes.headers.get('location');
        console.log('improve-proxy - redirect status:', firstRes.status, 'location:', location);
        if (location) {
          const redirectedUrl = new URL(location, webhookUrl).toString();
          finalRes = await fetchWithTimeout(redirectedUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          });
          attempt = 'redirect-post';
        } else {
          finalRes = firstRes;
        }
      } else {
        finalRes = firstRes;
      }

      finalText = await finalRes.text();
      console.log('improve-proxy - upstream status:', finalRes.status);
      console.log('improve-proxy - raw response length:', finalText.length);

      // Fallback to GET if upstream suggests GET usage
      if (finalRes.status === 404 && /not registered for POST|Did you mean to make a GET request/i.test(finalText)) {
        console.log('improve-proxy - attempting GET fallback for webhook');
        const getUrl = new URL(webhookUrl);
        getUrl.searchParams.set('text', text);

        const getFirst = await fetchWithTimeout(getUrl.toString(), {
          method: 'GET',
          redirect: 'manual',
        });

        if (getFirst.status >= 300 && getFirst.status < 400) {
          const location = getFirst.headers.get('location');
          console.log('improve-proxy - GET redirect status:', getFirst.status, 'location:', location);
          if (location) {
            const redirectedUrl = new URL(location, getUrl.toString()).toString();
            finalRes = await fetchWithTimeout(redirectedUrl, {
              method: 'GET',
            });
          } else {
            finalRes = getFirst;
          }
        } else {
          finalRes = getFirst;
        }

        finalText = await finalRes.text();
        attempt = 'get-fallback';
        console.log('improve-proxy - GET upstream status:', finalRes.status);
        console.log('improve-proxy - GET raw response length:', finalText.length);
      }
    } catch (err) {
      console.error('improve-proxy - upstream error:', (err as any)?.message || String(err));
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
      attempt,
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
