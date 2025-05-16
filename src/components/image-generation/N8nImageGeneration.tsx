
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, ImageIcon, RefreshCw, Download, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createDownloadableImage, generateImageWithN8n } from "@/services/imageGenerationService";
import ImageGenerationNavigationButtons from "./ImageGenerationNavigationButtons";

// Interface mise à jour pour correspondre au format de réponse complet
interface N8nGenerationResponse {
  imageUrl: string;
  error?: string;
  details?: string;
  templatePath?: string;
  originalResponse?: any;
}
export const N8nImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<N8nGenerationResponse | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const handleGenerateWithN8n = async (e: React.FormEvent) => {
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
    try {
      // Utiliser la fonction du service pour appeler le webhook correctement
      const result = await generateImageWithN8n(prompt);
      console.log("Résultat de la génération d'image:", result);
      setResponse(result);
      if (result.error) {
        toast({
          title: "Attention",
          description: result.error,
          variant: "destructive"
        });
      } else if (result.imageUrl && !result.imageUrl.includes('{{')) {
        toast({
          title: "Succès",
          description: "Image générée avec succès!"
        });
      }
    } catch (err) {
      console.error("Erreur lors de la génération:", err);
      toast({
        title: "Erreur",
        description: "Échec de la communication avec le service de génération d'images",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const resetForm = () => {
    setPrompt("");
    setResponse(null);
    setShowDebug(false);
  };
  const handleDownload = () => {
    if (response?.imageUrl) {
      try {
        createDownloadableImage(response.imageUrl, `image-n8n-${Date.now()}`);
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
  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  // Vérification si l'URL de l'image semble valide
  const hasValidImage = response?.imageUrl && typeof response.imageUrl === 'string' && !response.imageUrl.includes('{{') && !response.imageUrl.includes('}}');

  // Vérification si nous avons une erreur de modèle n8n non évalué
  const hasTemplateError = response?.imageUrl && typeof response.imageUrl === 'string' && (response.imageUrl.includes('{{') || response.imageUrl.includes('}}'));
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Génération d'image N8n</CardTitle>
        <CardDescription className="text-center">
          Utilisez le service N8n pour générer des images
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleGenerateWithN8n}>
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-lg font-medium">
              Description de l'image
            </label>
            <Textarea 
              id="prompt" 
              placeholder="Décrivez l'image que vous souhaitez générer..." 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              className="w-full h-24" 
            />
          </div>
          
          <Button type="submit" className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600" disabled={isGenerating}>
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
        
        {response?.error && (
          <div className="mt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{response.error}</AlertDescription>
              
              {hasTemplateError && response.templatePath && (
                <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                  <p className="font-semibold">Information de débogage:</p>
                  <p>Chemin du modèle: {response.templatePath}</p>
                  <p className="mt-1">Il est nécessaire de modifier le workflow N8N pour évaluer les expressions avant de les renvoyer.</p>
                </div>
              )}
            </Alert>
            
            {showDebug && response.details && (
              <div className="mt-2 p-2 text-xs bg-gray-100 rounded">
                <p className="font-bold">Détails techniques:</p>
                <pre className="whitespace-pre-wrap">{response.details}</pre>
              </div>
            )}
          </div>
        )}
        
        {hasValidImage && (
          <div className="mt-6 space-y-4">
            <AspectRatio ratio={1}>
              <img 
                src={response.imageUrl} 
                alt="Image générée" 
                className="rounded-md w-full h-full object-cover" 
                onError={() => {
                  setResponse({
                    ...response,
                    error: "Impossible de charger l'image générée."
                  });
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
              
              {response.details && (
                <Button variant="outline" className="flex-1" onClick={toggleDebug}>
                  {showDebug ? "Masquer détails" : "Afficher détails"}
                </Button>
              )}
            </div>
          </div>
        )}
        
        {!hasValidImage && !isGenerating && !response?.error && (
          <div className="mt-6 border border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={48} className="mb-4" />
              <p>Aucune image générée</p>
              <p className="text-sm mt-2">Utilisez le formulaire ci-dessus pour générer une image</p>
            </div>
          </div>
        )}
        
        {/* Add navigation buttons */}
        <ImageGenerationNavigationButtons />
      </CardContent>
    </Card>
  );
};
