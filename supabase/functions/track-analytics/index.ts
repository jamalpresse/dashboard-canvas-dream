
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

// Handle CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Create a Supabase client
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the request body
    const body = await req.json();
    const { eventType, eventData } = body;

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Check if we already have an analytics record for today
    const { data: existingAnalytics, error: fetchError } = await supabaseClient
      .from("analytics")
      .select("*")
      .eq("date", today)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      throw fetchError;
    }

    let updateData = {};
    
    // Update the appropriate counter based on the event type
    switch (eventType) {
      case "page_view":
        updateData = { page_view_count: (existingAnalytics?.page_view_count || 0) + 1 };
        break;
      case "article_view":
        updateData = { article_view_count: (existingAnalytics?.article_view_count || 0) + 1 };
        break;
      case "search":
        updateData = { search_count: (existingAnalytics?.search_count || 0) + 1 };
        break;
      case "translation":
        updateData = { translation_count: (existingAnalytics?.translation_count || 0) + 1 };
        break;
      case "improve":
        updateData = { improve_count: (existingAnalytics?.improve_count || 0) + 1 };
        break;
      default:
        throw new Error(`Unknown event type: ${eventType}`);
    }

    // Update or insert the analytics record
    let result;
    if (existingAnalytics) {
      const { data, error } = await supabaseClient
        .from("analytics")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAnalytics.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabaseClient
        .from("analytics")
        .insert({
          date: today,
          ...updateData,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
