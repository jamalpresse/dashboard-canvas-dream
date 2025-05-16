
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Copy, Image, Download } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Textarea } from "@/components/ui/textarea";
import { createDownloadableImage } from "@/services/imageGenerationService";

export const GoogleFreePix = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);

  const fetchImage = async () => {
    setIsLoading(true);
    setError(null);
    
    if (!prompt.trim()) {
      toast.error("Veuillez saisir un prompt pour l'image");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch(
        `https://n8n-jamal-u38598.vm.elestio.app/webhook/a13ac2e6-cac4-4b6a-ae7f-7f2f9b848c34?prompt=${encodeURIComponent(prompt)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setResponse(data.response || "Image générée avec succès.");
        toast("Image générée avec succès!");
      } else {
        throw new Error("URL d'image non trouvée dans la réponse");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'image:", err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite");
      toast.error("Impossible de générer l'image. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyImageUrl = () => {
    if (imageUrl) {
      navigator.clipboard.writeText(imageUrl)
        .then(() => {
          toast("URL copiée dans le presse-papiers");
        })
        .catch((err) => {
          console.error("Erreur lors de la copie:", err);
          toast.error("Impossible de copier l'URL");
        });
    }
  };
  
  const handleDownload = () => {
    if (imageUrl) {
      try {
        createDownloadableImage(imageUrl, `google-freepix-${Date.now()}`);
        toast("Téléchargement démarré!");
      } catch (err) {
        toast.error("Erreur lors du téléchargement de l'image");
      }
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Google Free Pix
          </CardTitle>
          <CardDescription>
            Générez des images à partir d'une description textuelle
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Décrivez l'image que vous souhaitez générer..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] border-purple-100 focus:border-purple-300 transition-colors"
            />
            
            <Button
              onClick={fetchImage}
              disabled={isLoading || !prompt.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-lg py-6 px-8 rounded-xl shadow-lg transition duration-300 w-full md:w-auto"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <>
                  <Image className="h-5 w-5 mr-2" />
                  Générer une image
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {response && !error && (
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <h3 className="font-medium text-purple-700 mb-2">Réponse:</h3>
              <p className="text-gray-700">{response}</p>
            </div>
          )}

          {imageUrl && !error && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-3">Image générée:</h3>
              <div className="rounded-lg overflow-hidden border border-purple-100 shadow-sm">
                <AspectRatio ratio={16 / 9} className="bg-gray-100">
                  <img 
                    src={imageUrl} 
                    alt="Image générée" 
                    className="object-contain w-full h-full max-h-[600px]"
                  />
                </AspectRatio>
              </div>
            </div>
          )}
        </CardContent>

        {imageUrl && !error && (
          <CardFooter className="flex flex-wrap gap-3 justify-center pb-6">
            <Button 
              variant="outline" 
              onClick={copyImageUrl}
              className="flex items-center gap-2 border-purple-200 hover:bg-purple-50"
            >
              <Copy className="h-4 w-4" />
              Copier l'URL
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="flex items-center gap-2 border-purple-200 hover:bg-purple-50"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
