import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    // Get the form data from the request
    const formData = await req.formData()
    
    // Forward the form data to the n8n workflow
    const targetUrl = 'http://automate.ihata.ma:5678/form/3a6e4083-fbe7-40de-959e-ca3a0a8297c8'
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
    })

    const responseText = await response.text()
    
    // Try to parse as JSON, fallback to text
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = responseText
    }

    return new Response(
      JSON.stringify({
        ok: response.ok,
        status: response.status,
        data: response.ok ? responseData : undefined,
        body: !response.ok ? responseText : undefined,
        error: !response.ok ? 'Request failed' : undefined
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('PDF transcription proxy error:', error)
    
    return new Response(
      JSON.stringify({
        ok: false,
        status: 500,
        error: 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})