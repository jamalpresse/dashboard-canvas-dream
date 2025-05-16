import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateImage, generateImageWithN8n, createDownloadableImage } from "@/services/imageGenerationService";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Download, ImageIcon, RefreshCw, AlertCircle } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ImageGenerationNavigationButtons from "@/components/image-generation/ImageGenerationNavigationButtons";

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

  // Image generation function
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
    setTemplateError(null);
    
    try {
      const result = await generateImageWithN8n(prompt);
      
      if (result.error) {
        setError(result.error);
        
        // Check if it's a template error
        if (result.error.includes("modèle n8n") && result.templatePath) {
          setTemplateError(`Chemin du modèle détecté: ${result.templatePath}`);
        }
        
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
      
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
      }
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      setError("Une erreur s'est produite lors de la génération de l'image. Veuillez réessayer.");
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
    if (generatedImage) {
      try {
        createDownloadableImage(generatedImage, `image-générée-${Date.now()}`);
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
  
  const resetForm = () => {
    setPrompt("");
    setGeneratedImage(null);
    setError(null);
    setTemplateError(null);
  };
  
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="grid grid-cols-1 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Génération d'image
            </CardTitle>
            <CardDescription className="text-center">
              Décrivez l'image que vous souhaitez générer
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleGenerateImage} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="prompt" className="text-lg font-medium">
                  Description de l'image
                </label>
                <Input id="prompt" placeholder="Décrivez l'image que vous souhaitez générer..." value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full" />
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600" disabled={isGenerating}>
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
              <div className="mt-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                  
                  {templateError && (
                    <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                      <p className="font-semibold">Information de débogage:</p>
                      <p>{templateError}</p>
                      <p className="mt-1">Il est nécessaire de modifier le workflow N8N pour évaluer les expressions avant de les renvoyer.</p>
                    </div>
                  )}
                </Alert>
              </div>
            )}
            
            {generatedImage && !isGenerating && (
              <div className="mt-8 space-y-4">
                <AspectRatio ratio={1}>
                  <img 
                    src={generatedImage} 
                    alt="Image générée" 
                    className="rounded-md w-full h-full object-cover" 
                    onError={() => {
                      setError("Impossible de charger l'image générée.");
                      setGeneratedImage("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158");
                    }} 
                  />
                </AspectRatio>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="flex-1" onClick={resetForm}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Recommencer
                  </Button>
                  
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </div>
            )}
            
            {!generatedImage && !isGenerating && !error && (
              <div className="mt-6 border border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={48} className="mb-4" />
                  <p>Aucune image générée</p>
                  <p className="text-sm mt-2">Utilisez le formulaire ci-dessus pour générer une image</p>
                </div>
              </div>
            )}
            
            {/* Add navigation buttons component */}
            <ImageGenerationNavigationButtons />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageGeneration;
