
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateImage, createDownloadableImage } from "@/services/imageGenerationService";
import { toast } from "@/components/ui/sonner";
import { Loader2, Download, ImageIcon } from "lucide-react";

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Veuillez saisir une description pour votre image");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateImage(prompt);
      console.log("Résultat de la génération:", result);
      
      // On utilise maintenant l'URL d'image qui est garantie par le service
      setGeneratedImage(result.imageUrl);
      toast.success("Image générée avec succès!");
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Une erreur s'est produite lors de la génération de l'image. Veuillez réessayer.");
      toast.error("Échec de la génération de l'image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      try {
        createDownloadableImage(generatedImage, `image-${Date.now()}`);
        toast.success("Téléchargement démarré!");
      } catch (err) {
        toast.error("Erreur lors du téléchargement de l'image");
      }
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
        Génération d'Images
      </h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Décrivez l'image que vous souhaitez générer</CardTitle>
          <CardDescription>
            Soyez précis dans votre description pour obtenir les meilleurs résultats
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Textarea 
              className="min-h-32 text-base"
              placeholder="Exemple: Un paysage de montagne avec un lac reflétant le ciel étoilé..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>Générer</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {generatedImage && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Image générée</CardTitle>
            <CardDescription>
              Voici l'image générée selon votre description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img 
                src={generatedImage} 
                alt="Generated image" 
                className="w-full h-auto object-contain"
                onError={() => {
                  setError("Impossible de charger l'image générée.");
                  // Utiliser une image de secours en cas d'erreur de chargement
                  setGeneratedImage("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158");
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => {
                setGeneratedImage(null);
                setPrompt("");
              }}
            >
              Recommencer
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Download className="mr-2 h-4 w-4" /> Télécharger (WebP)
            </Button>
          </CardFooter>
        </Card>
      )}

      {!generatedImage && !isGenerating && (
        <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={48} className="mb-4" />
            <p>Aucune image générée</p>
            <p className="text-sm mt-2">Utilisez le formulaire ci-dessus pour générer une image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGeneration;
