
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// URL de secours fiable d'Unsplash (image fixe)
const fallbackImageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extraire le prompt de la requête
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({
          imageUrl: fallbackImageUrl,
          error: 'Le prompt est requis'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log("Génération d'image pour prompt:", prompt);

    // L'URL du webhook externe pour la génération d'images
    const externalWebhookUrl = "https://n8n-jamal-u38598.vm.elestio.app/webhook/9f32367c-65f7-4868-a660-bbab69fc391c";
    
    // Appeler le service externe avec une méthode GET au lieu de POST
    const webhookUrl = `${externalWebhookUrl}?prompt=${encodeURIComponent(prompt)}`;
    console.log("URL du webhook:", webhookUrl);

    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur du service externe:", response.status, errorText);
      
      // En cas d'erreur, retourner une réponse avec une image de secours
      return new Response(
        JSON.stringify({
          imageUrl: fallbackImageUrl,
          error: `Erreur du service externe: ${response.status}`,
          details: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Traiter la réponse
    const data = await response.json();
    console.log("Réponse du webhook:", data);
    
    // Vérifier si la réponse contient une URL d'image valide ou si elle contient une référence n8n non évaluée
    let finalImageUrl = fallbackImageUrl;
    
    // Cas où l'URL est une chaîne valide
    if (typeof data.imageUrl === 'string' && 
      data.imageUrl.startsWith('http') && 
      !data.imageUrl.includes('{{') && 
      !data.imageUrl.includes('}}')) {
      finalImageUrl = data.imageUrl;
    }
    // Cas où nous avons une référence n8n {{...}} non évaluée
    else if (typeof data.imageUrl === 'string' && 
      (data.imageUrl.includes('{{') || data.imageUrl.includes('}}'))) {
      console.log("Template n8n détecté dans l'URL, utilisation de l'image de secours");
    }
    
    // Formatter la réponse de manière simplifiée avec uniquement l'imageUrl
    const formattedResponse = {
      imageUrl: finalImageUrl
    };
    
    console.log("Réponse formatée:", formattedResponse);

    return new Response(
      JSON.stringify(formattedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Erreur lors de la génération d'image:", error);
    
    // En cas d'erreur, retourner une réponse avec une image par défaut
    return new Response(
      JSON.stringify({ 
        imageUrl: fallbackImageUrl,
        error: "Une erreur s'est produite lors de la génération de l'image", 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
