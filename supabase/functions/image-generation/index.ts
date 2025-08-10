
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
  if (typeof template !== 'string') return { isTemplate: false, path: null };
  
  // Vérification standard pour "{{ $json['key'] }}"
  const standardMatch = template.match(/\{\{\s*\$json\['(.+?)'\](.+?)\s*\}\}/);
  if (standardMatch) {
    console.log("Modèle n8n standard détecté:", template);
    console.log("Structure de chemin extraite:", standardMatch[1] + standardMatch[2]);
    return {
      isTemplate: true,
      path: standardMatch[1] + standardMatch[2] // Ex: "results[0].urls.stream"
    };
  }
  
  // Nouvelle vérification pour "={{ $json.key }}"
  const equalMatch = template.match(/=\{\{\s*\$json\.(.+?)\s*\}\}/);
  if (equalMatch) {
    console.log("Modèle n8n avec préfixe '=' détecté:", template);
    console.log("Structure de chemin extraite:", equalMatch[1]);
    return {
      isTemplate: true,
      path: equalMatch[1] // Ex: "imageUrl"
    };
  }
  
  // Vérification basique de présence de {{ ou }}
  const hasTemplateMarkers = template.includes('{{') || template.includes('}}');
  if (hasTemplateMarkers) {
    console.log("Marqueurs de modèle n8n détectés:", template);
    return {
      isTemplate: true,
      path: null
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

    // Préparer plusieurs tentatives (HTTPS puis HTTP, POST JSON, POST form, GET)
    const webhookHttps = "https://automate.ihata.ma/webhook/generate-image";
    const webhookHttp = "http://automate.ihata.ma/webhook/generate-image";

    const attempts: Array<{ label: string; exec: () => Promise<Response> }> = [
      {
        label: "HTTPS POST JSON",
        exec: () => fetch(webhookHttps, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        })
      },
      {
        label: "HTTPS POST form-urlencoded",
        exec: () => fetch(webhookHttps, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ prompt }).toString()
        })
      },
      {
        label: "HTTPS GET",
        exec: () => fetch(`${webhookHttps}?prompt=${encodeURIComponent(prompt)}`, { method: 'GET' })
      },
      {
        label: "HTTP POST JSON",
        exec: () => fetch(webhookHttp, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        })
      },
      {
        label: "HTTP POST form-urlencoded",
        exec: () => fetch(webhookHttp, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ prompt }).toString()
        })
      },
      {
        label: "HTTP GET",
        exec: () => fetch(`${webhookHttp}?prompt=${encodeURIComponent(prompt)}`, { method: 'GET' })
      },
    ];

    const errors: string[] = [];
    let response: Response | null = null;

    for (const attempt of attempts) {
      try {
        console.log(`Tentative: ${attempt.label}`);
        const res = await attempt.exec();
        if (res.ok) {
          response = res;
          console.log(`Succès avec: ${attempt.label}`);
          break;
        } else {
          const txt = await res.text();
          errors.push(`${attempt.label}: ${res.status} ${txt.substring(0, 200)}`);
        }
      } catch (e) {
        errors.push(`${attempt.label}: ${(e as Error).message}`);
      }
    }

    if (!response) {
      console.error("Toutes les tentatives ont échoué:", errors.join(" | "));
      return new Response(
        JSON.stringify({
          imageUrl: fallbackImageUrl,
          error: `Erreur du service externe: 404`,
          details: errors.join(" | ")
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Traiter la réponse
    const data = await response.json();
    console.log("Réponse du webhook:", data);

    // Fonction utilitaire pour trouver une URL dans un objet arbitraire
    const findUrl = (obj: unknown): string | null => {
      if (!obj) return null;
      if (typeof obj === 'string' && /^https?:\/\//i.test(obj)) return obj;
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const found = findUrl(item);
          if (found) return found;
        }
      } else if (typeof obj === 'object') {
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
          if (k === 'imageUrl' || k === 'url' || k === 'image_url') {
            const s = findUrl(v);
            if (s) return s;
          }
        }
        for (const v of Object.values(obj as Record<string, unknown>)) {
          const found = findUrl(v);
          if (found) return found;
        }
      }
      return null;
    };

    // Gérer la structure imbriquée (si imageUrl est un objet contenant imageUrl)
    let candidateUrl: any = (data as any)?.imageUrl ?? (data as any)?.url ?? (data as any)?.image_url;
    if (!candidateUrl && (data as any)?.data?.imageUrl) candidateUrl = (data as any).data.imageUrl;
    if (!candidateUrl && (data as any)?.data?.url) candidateUrl = (data as any).data.url;
    if (!candidateUrl) candidateUrl = findUrl(data);

    if (candidateUrl && typeof candidateUrl === 'object' && (candidateUrl as any).imageUrl) {
      candidateUrl = (candidateUrl as any).imageUrl;
    }

    // Vérifier si l'imageUrl est un modèle n8n non évalué
    let finalImageUrl = fallbackImageUrl;
    if (candidateUrl) {
      const templateInfo = extractPathFromN8nTemplate(candidateUrl);
      if (templateInfo.isTemplate) {
        console.log("Détecté modèle n8n non évalué:", candidateUrl);
        return new Response(
          JSON.stringify({
            imageUrl: fallbackImageUrl,
            error: "Le modèle n8n n'a pas été évalué correctement",
            details: `Modèle reçu: ${candidateUrl}. Ajoutez un nœud 'Set' dans n8n pour évaluer cette expression avant le nœud 'Répondre Webhook'.`,
            templatePath: templateInfo.path,
            originalResponse: data
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (typeof candidateUrl === 'string' && candidateUrl.startsWith('http')) {
        finalImageUrl = candidateUrl;
      }
    }

    const formattedResponse = { imageUrl: finalImageUrl };
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
