import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const WEBHOOK_URL = "http://automate.ihata.ma/webhook/204dc11f-4f0f-4467-9e8c-96f04717c3eb";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const text = await req.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = { text };
      }
    }

    const subject = (body?.subject ?? "").toString().trim();
    if (!subject) {
      return new Response(JSON.stringify({ error: "Missing 'subject' field" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Forwarding to webhook with subject:", subject);

    const forwardRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject }),
    });

    const resText = await forwardRes.text();
    let resJson: any;
    try {
      resJson = JSON.parse(resText);
    } catch {
      resJson = { raw: resText };
    }

    const responsePayload = {
      ok: forwardRes.ok,
      status: forwardRes.status,
      webhookResponse: resJson,
    };

    return new Response(JSON.stringify(responsePayload), {
      status: forwardRes.ok ? 200 : 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in briefing-proxy:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
