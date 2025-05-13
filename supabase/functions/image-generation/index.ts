
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// L'URL du webhook externe pour la génération d'images
const externalWebhookUrl = "https://n8n-jamal-u38598.vm.elestio.app/webhook/9f32367c-65f7-4868-a660-bbab69fc391c";

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
        JSON.stringify({ error: 'Le prompt est requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log("Génération d'image pour prompt:", prompt);

    // Appeler le service externe avec une méthode GET au lieu de POST
    const webhookUrl = `${externalWebhookUrl}?prompt=${encodeURIComponent(prompt)}`;
    console.log("URL du webhook:", webhookUrl);

    const response = await fetch(webhookUrl, {
      method: 'GET', // Changé de POST à GET selon l'erreur rapportée
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur du service externe:", response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Erreur du service externe: ${response.status}`, 
          details: errorText 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Traiter la réponse
    const data = await response.json();
    console.log("Réponse du webhook:", data);
    
    // Formatter la réponse selon ce qui est attendu
    const formattedResponse = {
      myField: data.myField || "value",
      imageUrl: data.imageUrl || 'https://picsum.photos/800/600'
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
        myField: "erreur", 
        imageUrl: 'https://picsum.photos/800/600',
        error: "Une erreur s'est produite lors de la génération de l'image", 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
