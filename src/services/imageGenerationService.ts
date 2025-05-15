
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

// Updated function to use the new webhook URL
export async function generateImageWithN8n(prompt: string): Promise<{imageUrl: string}> {
  try {
    // Mise à jour avec la nouvelle URL de webhook
    const webhookUrl = `https://n8n-jamal-u38598.vm.elestio.app/webhook/generate-image?prompt=${encodeURIComponent(prompt)}`;
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("N8n webhook response:", data);
    
    // Vérifier si l'URL est valide ou si c'est un modèle n8n non évalué
    if (!data.imageUrl || 
        typeof data.imageUrl !== 'string' || 
        data.imageUrl.includes('{{') || 
        data.imageUrl.includes('}}')) {
      console.warn("URL d'image invalide ou modèle non évalué:", data.imageUrl);
      return { imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" };
    }
    
    return data;
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    throw error;
  }
}
