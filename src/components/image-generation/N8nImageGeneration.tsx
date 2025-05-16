
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, ImageIcon, RefreshCw, Download, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createDownloadableImage, generateImageWithN8n } from "@/services/imageGenerationService";

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
  
  return <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Génération d'images avec N8n</CardTitle>
        <CardDescription>
          Créez des images à partir de descriptions textuelles
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleGenerateWithN8n}>
        <CardContent>
          <div className="space-y-4">
            <Textarea 
              placeholder="Décrivez l'image que vous souhaitez générer..." 
              className="min-h-[120px] resize-y"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
            
            {hasTemplateError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur de modèle</AlertTitle>
                <AlertDescription>
                  Le modèle n8n n'est pas correctement configuré. Veuillez contacter l'administrateur.
                </AlertDescription>
              </Alert>
            )}
            
            {hasValidImage && (
              <div className="rounded-md overflow-hidden border">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={response?.imageUrl} 
                    alt="Image générée" 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
            )}
            
            {showDebug && response && (
              <div className="bg-gray-50 rounded-md p-4 text-xs font-mono overflow-auto max-h-[300px]">
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-3 justify-between">
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isGenerating || !prompt.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Générer
                </>
              )}
            </Button>
            
            <Button type="button" variant="outline" onClick={resetForm} disabled={isGenerating}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
          
          <div className="flex gap-2">
            {hasValidImage && (
              <Button type="button" variant="secondary" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            )}
            
            <Button type="button" variant="ghost" size="sm" onClick={toggleDebug}>
              {showDebug ? 'Cacher' : 'Debug'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>;
};
