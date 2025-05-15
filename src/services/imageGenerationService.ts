
// Service for image generation using the external webhook
export interface ImageGenerationResponse {
  myField: string;
  imageUrl: string;
  error?: string;
  details?: string;
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
    
    // S'assurer que myField existe
    const result = {
      myField: data.myField || "value",
      imageUrl: isValidUrl ? data.imageUrl : "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    };
    
    return result;
  } catch (error) {
    console.error('Error generating image:', error);
    // En cas d'erreur, retourner une image de secours
    return {
      myField: "error",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
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

// New function to handle n8n webhook response
export async function generateImageWithN8n(prompt: string): Promise<any> {
  try {
    const response = await fetch('https://n8n-jamal-u38598.vm.elestio.app/webhook/generate-image', {
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
    console.log("N8n webhook response:", data);
    
    // Return the raw response as we're not sure about the structure
    return data;
  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    throw error;
  }
}
