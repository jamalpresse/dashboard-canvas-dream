import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    console.log('Transcription proxy: Processing request...')
    
    // Get the form data from the request
    const formData = await req.formData()
    
    // Forward the exact form data to the external endpoint
    const response = await fetch('https://automate.ihata.ma/form/c1d21c44-f668-4570-9b81-b4d18a9e5d5d', {
      method: 'POST',
      body: formData, // Forward the FormData as-is
    })

    console.log('External API response status:', response.status)
    
    let responseData
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
      console.log('JSON response received:', responseData)
    } else {
      // If not JSON, get as text for debugging
      const textData = await response.text()
      console.log('Non-JSON response received:', textData)
      responseData = { body: textData }
    }

    return new Response(
      JSON.stringify({
        ok: response.ok,
        status: response.status,
        data: response.ok ? responseData : undefined,
        error: !response.ok ? responseData || 'Request failed' : undefined
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Transcription proxy error:', error)
    return new Response(
      JSON.stringify({ 
        ok: false,
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})