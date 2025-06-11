// Service for image generation using the external webhook
import { translatePromptIfNeeded } from './promptTranslationService';

export interface ImageGenerationResponse {
  imageUrl: string;
  error?: string;
  details?: string;
  templatePath?: string;
  originalResponse?: any;
  translationInfo?: {
    originalPrompt: string;
    translatedPrompt: string;
    detectedLanguage: string;
    wasTranslated: boolean;
  };
}

export async function generateImage(prompt: string): Promise<ImageGenerationResponse> {
  try {
    // Translate prompt if needed
    const translationResult = await translatePromptIfNeeded(prompt);
    const finalPrompt = translationResult.translatedPrompt;
    
    console.log("Using prompt for generation:", finalPrompt);
    
    const response = await fetch('https://jajkfzwzmogpkwzclisv.supabase.co/functions/v1/image-generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: finalPrompt }),
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
        originalResponse: data,
        translationInfo: {
          originalPrompt: translationResult.originalPrompt,
          translatedPrompt: translationResult.translatedPrompt,
          detectedLanguage: translationResult.detectedLanguage,
          wasTranslated: translationResult.wasTranslated
        }
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
      originalResponse: data,
      translationInfo: {
        originalPrompt: translationResult.originalPrompt,
        translatedPrompt: translationResult.translatedPrompt,
        detectedLanguage: translationResult.detectedLanguage,
        wasTranslated: translationResult.wasTranslated
      }
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

// Fonction pour vérifier si l'URL est valide (mise à jour pour accepter divers formats)
function isValidImageUrl(url: any): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // Accepter les URL HTTP standard
  if (url.startsWith('http')) {
    return true;
  }
  
  // Accepter les URLs de données (data URLs)
  if (url.startsWith('data:image/')) {
    return true;
  }
  
  // Vérifier qu'il ne s'agit pas d'un modèle n8n non évalué
  if (url.includes('{{') || url.includes('}}')) {
    return false;
  }
  
  // On considère les autres formats comme potentiellement valides
  // et on laissera l'élément img essayer de les charger
  console.log("Format d'URL non standard détecté:", url.substring(0, 50) + "...");
  return true;
}

// Updated function to handle nested imageUrl structure with automatic translation
export async function generateImageWithN8n(prompt: string): Promise<ImageGenerationResponse> {
  try {
    // Translate prompt if needed
    const translationResult = await translatePromptIfNeeded(prompt);
    const finalPrompt = translationResult.translatedPrompt;
    
    console.log("Using translated prompt for n8n generation:", finalPrompt);
    
    const webhookUrl = `https://n8n-jamal-u38598.vm.elestio.app/webhook/generate-image?prompt=${encodeURIComponent(finalPrompt)}`;
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("N8n webhook response:", data);
    
    // Affichage plus détaillé de la réponse pour le débogage
    console.log("Type de réponse:", typeof data);
    console.log("Structure de la réponse:", JSON.stringify(data, null, 2));
    
    // Vérifier si nous avons reçu un objet 'data' qui contient imageUrl
    if (data && data.data && data.data.imageUrl) {
      console.log("Format de réponse détecté: { data: { imageUrl: ... } }");
      data.imageUrl = data.data.imageUrl;
    }
    
    // Handle nested imageUrl structure (when imageUrl is an object that contains imageUrl)
    if (data.imageUrl && typeof data.imageUrl === 'object' && data.imageUrl.imageUrl) {
      console.log("Detected nested imageUrl structure, extracting inner URL");
      data.imageUrl = data.imageUrl.imageUrl;
    }
    
    // Handle template strings in the response
    if (data.imageUrl && isTemplateString(data.imageUrl)) {
      const templatePath = extractPathFromTemplate(data.imageUrl);
      
      return {
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158", // Fallback image
        error: "Le modèle n8n n'a pas été évalué correctement",
        details: `L'URL contient un modèle non évalué: ${data.imageUrl}. Ajoutez un nœud 'Set' dans n8n pour évaluer cette expression avant le nœud 'Répondre Webhook'.`,
        templatePath: templatePath,
        originalResponse: data,
        translationInfo: {
          originalPrompt: translationResult.originalPrompt,
          translatedPrompt: translationResult.translatedPrompt,
          detectedLanguage: translationResult.detectedLanguage,
          wasTranslated: translationResult.wasTranslated
        }
      };
    }
    
    // Vérifier si l'URL est valide avec la nouvelle fonction
    if (!isValidImageUrl(data.imageUrl)) {
      console.warn("URL d'image invalide:", data.imageUrl);
      return { 
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        error: "URL d'image invalide dans la réponse",
        details: "Le webhook a retourné: " + JSON.stringify(data),
        translationInfo: {
          originalPrompt: translationResult.originalPrompt,
          translatedPrompt: translationResult.translatedPrompt,
          detectedLanguage: translationResult.detectedLanguage,
          wasTranslated: translationResult.wasTranslated
        }
      };
    }
    
    return {
      imageUrl: data.imageUrl,
      originalResponse: data,
      translationInfo: {
        originalPrompt: translationResult.originalPrompt,
        translatedPrompt: translationResult.translatedPrompt,
        detectedLanguage: translationResult.detectedLanguage,
        wasTranslated: translationResult.wasTranslated
      }
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
