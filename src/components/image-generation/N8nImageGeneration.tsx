
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

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Génération d'image avec n8n</CardTitle>
        <CardDescription>Utilisez l'intégration n8n pour générer des images IA</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleGenerateWithN8n}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">Description de l'image</label>
            <Textarea
              id="prompt"
              placeholder="Décrivez l'image que vous souhaitez générer..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {hasValidImage && (
            <div className="space-y-4 pt-2">
              <AspectRatio ratio={1} className="overflow-hidden bg-gray-100 rounded-md">
                <img
                  src={response?.imageUrl}
                  alt="Image générée"
                  className="object-cover w-full h-full rounded-md"
                />
              </AspectRatio>
            </div>
          )}

          {hasTemplateError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de modèle n8n</AlertTitle>
              <AlertDescription>
                Le modèle n8n n'a pas été correctement évalué. Veuillez ajouter un nœud 'Set' dans votre workflow n8n pour évaluer l'expression avant de la renvoyer.
                {response?.details && <p className="mt-2 text-sm">{response.details}</p>}
              </AlertDescription>
            </Alert>
          )}

          {response?.error && !hasTemplateError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{response.error}</AlertDescription>
            </Alert>
          )}

          {showDebug && response && (
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[300px] text-xs">
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-auto flex-1">
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
                  Générer
                </>
              )}
            </Button>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {hasValidImage && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            )}
            
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={resetForm}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={toggleDebug}
            >
              {showDebug ? "Masquer" : "Debug"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
