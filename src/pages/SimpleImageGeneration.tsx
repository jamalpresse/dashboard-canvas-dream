
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, ImageIcon, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { generateImageWithN8n } from "@/services/imageGenerationService";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { createDownloadableImage } from "@/services/imageGenerationService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SimpleImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une description pour votre image",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setDetails(null);

    try {
      // Utiliser la fonction améliorée qui gère les structures d'URL imbriquées
      const result = await generateImageWithN8n(prompt);
      
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      }
      
      if (result.error) {
        setError(result.error);
        setDetails(result.details || null);
        
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Succès",
          description: "Image générée avec succès!"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      setError("Une erreur s'est produite lors de la génération de l'image");
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération de l'image",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      try {
        createDownloadableImage(imageUrl, `image-générée-${Date.now()}`);
        toast({
          title: "Succès",
          description: "Téléchargement démarré!"
        });
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Erreur lors du téléchargement de l'image",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Génération d'image
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleGenerateImage} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-lg font-medium">
                Description de l'image
              </label>
              <Input
                id="prompt"
                placeholder="Décrivez l'image que vous souhaitez générer..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Générer l'image
                </>
              )}
            </Button>
          </form>
          
          {error && (
            <div className="mt-6">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                  {error}
                  {details && (
                    <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                      <p className="font-medium">Détails:</p>
                      <p>{details}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {imageUrl && (
            <div className="mt-8 space-y-4">
              <AspectRatio ratio={1}>
                <img
                  src={imageUrl}
                  alt="Image générée"
                  className="rounded-md w-full h-full object-cover"
                />
              </AspectRatio>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDownload}
              >
                Télécharger l'image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleImageGeneration;
