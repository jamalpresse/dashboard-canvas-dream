
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// URL de secours fiable d'Unsplash (image fixe)
const fallbackImageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";

// Fonction pour extraire le chemin d'accès dans un modèle n8n non évalué
// Par exemple: "{{ $json['results'][0].urls.stream }}" → Extraire la structure du chemin d'accès
function extractPathFromN8nTemplate(template) {
  // Vérifie si le modèle contient la structure n8n non évaluée
  const match = template.match(/\{\{\s*\$json\['(.+?)'\](.+?)\s*\}\}/);
  if (match) {
    console.log("Modèle n8n détecté:", template);
    console.log("Structure de chemin extraite:", match[1] + match[2]);
    return {
      isTemplate: true,
      path: match[1] + match[2] // Ex: "results[0].urls.stream"
    };
  }
  return { isTemplate: false, path: null };
}

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

    // L'URL du webhook externe pour la génération d'images - URL harmonisée
    const externalWebhookUrl = "https://n8n-jamal-u38598.vm.elestio.app/webhook/generate-image";
    
    // Appeler le service externe avec une méthode GET
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
    
    // Vérifier si l'imageUrl est un modèle n8n non évalué
    let finalImageUrl = fallbackImageUrl;
    
    if (data.imageUrl) {
      const templateInfo = extractPathFromN8nTemplate(data.imageUrl);
      
      if (templateInfo.isTemplate) {
        console.log("Détecté modèle n8n non évalué:", data.imageUrl);
        console.log("Utilisation de l'image de secours car le template n8n n'est pas évalué");
        
        // Ajouter des détails supplémentaires sur le problème pour faciliter le débogage
        return new Response(
          JSON.stringify({
            imageUrl: fallbackImageUrl,
            error: "Le modèle n8n n'a pas été évalué correctement",
            details: `Modèle reçu: ${data.imageUrl}. Ajoutez un nœud 'Set' dans n8n pour évaluer cette expression avant de l'envoyer.`,
            templatePath: templateInfo.path,
            originalResponse: data
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      else if (typeof data.imageUrl === 'string' && data.imageUrl.startsWith('http')) {
        finalImageUrl = data.imageUrl;
      }
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
