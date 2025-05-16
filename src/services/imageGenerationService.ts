
// Service for image generation using the external webhook
export interface ImageGenerationResponse {
  imageUrl: string;
  error?: string;
  details?: string;
  templatePath?: string;
  originalResponse?: any;
}

export async function generateImage(prompt: string): Promise<ImageGenerationResponse> {
  try {
    const response = await fetch('https://jajkfzwzmogpkwzclisv.supabase.co/functions/v1/image-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Données reçues de la fonction Edge:", data);
    
    // Vérification améliorée pour détecter les templates non évalués
    if (data.imageUrl && isTemplateString(data.imageUrl)) {
      const templatePath = extractPathFromTemplate(data.imageUrl);
      
      return {
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", // Image de secours
        error: "Le modèle n8n n'a pas été évalué correctement",
        details: `L'URL contient un modèle non évalué: ${data.imageUrl}. Ajoutez un nœud 'Set' dans n8n pour évaluer cette expression.`,
        templatePath: templatePath,
        originalResponse: data
      };
    }
    
    // Vérification simplifiée de l'URL d'image
    const isValidUrl = typeof data.imageUrl === 'string' && 
      data.imageUrl.startsWith('http') &&
      !data.imageUrl.includes('{{') &&
      !data.imageUrl.includes('}}');
    
    // S'assurer que imageUrl existe et est valide
    const result = {
      imageUrl: isValidUrl ? data.imageUrl : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      error: data.error,
      details: data.details,
      templatePath: data.templatePath,
      originalResponse: data.originalResponse
    };
    
    return result;
  } catch (error) {
    console.error('Error generating image:', error);
    // En cas d'erreur, retourner une image de secours
    return {
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      error: "Une erreur s'est produite lors de la génération de l'image"
    };
  }
}

// Helper function to convert data to a downloadable WebP file
export function createDownloadableImage(imageUrl: string, fileName: string = 'generated-image'): void {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `${fileName}.webp`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper function to check if the response contains an unevaluated template
// Mise à jour pour prendre en compte les expressions qui commencent par "="
function isTemplateString(str: string): boolean {
  if (typeof str !== 'string') return false;
  
  // Détecte les expressions n8n standard avec {{ }}
  const hasTemplateMarkers = str.includes('{{') || str.includes('}}');
  
  // Détecte les expressions n8n qui commencent par "="
  const hasEqualTemplate = str.match(/=\{\{\s*\$json/i) !== null;
  
  // Nouvelle condition - détecte si c'est une expression de la forme "={{ $json.quelqueChose }}"
  const isEqualExpression = str.startsWith('={{') || str.startsWith('= {{');
  
  return hasTemplateMarkers || hasEqualTemplate || isEqualExpression;
}

// Function to extract the path from a template expression
// Mise à jour pour extraire les chemins des expressions "="
function extractPathFromTemplate(template: string): string | null {
  // Pour les expressions standard {{ $json['path'] }}
  const standardMatch = template.match(/\{\{\s*\$json\['(.+?)'\](.+?)\s*\}\}/);
  if (standardMatch) {
    return `${standardMatch[1]}${standardMatch[2]}`;
  }
  
  // Pour les expressions avec "=" comme "={{ $json.imageUrl }}"
  const equalMatch = template.match(/=\{\{\s*\$json\.(.+?)\s*\}\}/);
  if (equalMatch) {
    return equalMatch[1];
  }
  
  return null;
}

// Updated function to use the correct webhook URL
export async function generateImageWithN8n(prompt: string): Promise<ImageGenerationResponse> {
  try {
    // URL du webhook harmonisée
    const webhookUrl = `https://n8n-jamal-u38598.vm.elestio.app/webhook/generate-image?prompt=${encodeURIComponent(prompt)}`;
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("N8n webhook response:", data);
    
    // Handle template strings in the response - avec support amélioré pour "={{ $json.xxx }}"
    if (data.imageUrl && isTemplateString(data.imageUrl)) {
      const templatePath = extractPathFromTemplate(data.imageUrl);
      
      return {
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", // Fallback image
        error: "Le modèle n8n n'a pas été évalué correctement",
        details: `L'URL contient un modèle non évalué: ${data.imageUrl}. Ajoutez un nœud 'Set' dans n8n pour évaluer cette expression avant le nœud 'Répondre Webhook'.`,
        templatePath: templatePath,
        originalResponse: data
      };
    }
    
    // Vérifier si l'URL est valide
    if (!data.imageUrl || typeof data.imageUrl !== 'string' || !data.imageUrl.startsWith('http')) {
      console.warn("URL d'image invalide:", data.imageUrl);
      return { 
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        error: "URL d'image invalide dans la réponse",
        details: "Le webhook a retourné: " + JSON.stringify(data)
      };
    }
    
    return {
      imageUrl: data.imageUrl,
      originalResponse: data
    };
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    return { 
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      error: "Une erreur s'est produite lors de la génération de l'image",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
}
