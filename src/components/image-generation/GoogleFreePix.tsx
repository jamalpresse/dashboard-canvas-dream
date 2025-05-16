
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Copy } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const GoogleFreePix = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImage = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        "https://n8n-jamal-u38598.vm.elestio.app/webhook/a13ac2e6-cac4-4b6a-ae7f-7f2f9b848c34",
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
        toast("Succès", {
          description: "Image téléchargée avec succès!",
        });
      } else {
        throw new Error("URL d'image non trouvée dans la réponse");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'image:", err);
      setError(err instanceof Error ? err.message : "Une erreur inconnue s'est produite");
      toast("Erreur", {
        description: "Impossible de récupérer l'image. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyImageUrl = () => {
    if (imageUrl) {
      navigator.clipboard.writeText(imageUrl)
        .then(() => {
          toast("URL copiée", {
            description: "L'URL de l'image a été copiée dans le presse-papiers",
          });
        })
        .catch((err) => {
          console.error("Erreur lors de la copie:", err);
          toast("Erreur", {
            description: "Impossible de copier l'URL",
            variant: "destructive"
          });
        });
    }
  };

  return (
    <div className="w-full">
      <Card className="shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <Button
              onClick={fetchImage}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-lg py-6 px-8 rounded-xl shadow-lg transition duration-300 w-full md:w-auto"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                "🔍 Rechercher"
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {imageUrl && !error && (
            <div className="mt-4 rounded-lg overflow-hidden border border-purple-100 shadow-sm">
              <AspectRatio ratio={16 / 9} className="bg-gray-100">
                <img 
                  src={imageUrl} 
                  alt="Image générée" 
                  className="object-contain w-full h-full max-h-[600px]"
                />
              </AspectRatio>
            </div>
          )}
        </CardContent>

        {imageUrl && !error && (
          <CardFooter className="flex justify-center pb-6">
            <Button 
              variant="outline" 
              onClick={copyImageUrl}
              className="flex items-center gap-2 border-purple-200 hover:bg-purple-50"
            >
              <Copy className="h-4 w-4" />
              📋 Copier l'URL
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
