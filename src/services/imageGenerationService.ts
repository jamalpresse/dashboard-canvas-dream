
// Service for image generation using the external webhook
export interface ImageGenerationResponse {
  myField: string;
  imageUrl: string; // Maintenant toujours obligatoire
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
    
    // Vérifier qu'une URL d'image est présente
    if (!data.imageUrl) {
      // Utiliser une image de secours fiable si aucune URL n'est fournie
      console.warn("Aucune URL d'image reçue, utilisation de l'image de secours");
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
