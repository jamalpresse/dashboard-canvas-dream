
// Service for image generation using the external webhook
export interface ImageGenerationResponse {
  myField: string;
  imageUrl?: string;
}

export async function generateImage(prompt: string): Promise<ImageGenerationResponse> {
  try {
    const response = await fetch('https://n8n-jamal-u38598.vm.elestio.app/webhook/9f32367c-65f7-4868-a660-bbab69fc391c', {
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
    return data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
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
