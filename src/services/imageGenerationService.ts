
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
    
    // Vérifier que l'URL d'image est valide (n'est pas la valeur "URL_DE_VOTRE_IMAGE")
    if (!data.imageUrl || data.imageUrl === "URL_DE_VOTRE_IMAGE") {
      console.warn("URL d'image invalide reçue, utilisation de l'image de secours");
      return {
        myField: data.myField || "value",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
      };
    }
    
    return {
      myField: data.myField || "value",
      imageUrl: data.imageUrl
    };
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
