
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, ImageIcon, RefreshCw, Download, AlertCircle, Bug } from "lucide-react";
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
  const [rawResponse, setRawResponse] = useState<string>("");

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
    setShowDebug(false);
    try {
      // Utiliser la fonction du service pour appeler le webhook correctement
      const result = await generateImageWithN8n(prompt);
      console.log("Résultat de la génération d'image:", result);
      
      // Stocker la réponse brute pour le débogage
      setRawResponse(JSON.stringify(result.originalResponse, null, 2));
      
      setResponse(result);
      if (result.error) {
        toast({
          title: "Attention",
          description: result.error,
          variant: "destructive"
        });
        // Afficher automatiquement les détails de débogage en cas d'erreur
        setShowDebug(true);
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
    setRawResponse("");
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
        <CardTitle className="text-2xl font-bold">Génération d'image avec n8n</CardTitle>
        <CardDescription>
          Utilisez cette interface pour générer des images via le service n8n
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleGenerateWithN8n} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="text-lg font-medium block mb-2">
              Description de l'image
            </label>
            <Textarea
              id="prompt"
              placeholder="Décrivez l'image que vous souhaitez générer..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-y"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
        
        {/* Information de débogage améliorée */}
        {response && !hasValidImage && (
          <Alert variant={response.error ? "destructive" : "default"} className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{response.error ? "Erreur détectée" : "Information"}</AlertTitle>
            <AlertDescription className="space-y-2">
              {response.error && <p className="font-medium">{response.error}</p>}
              {response.details && <p>{response.details}</p>}
              
              <div className="flex justify-between items-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleDebug}
                  className="mt-2"
                >
                  <Bug className="mr-2 h-4 w-4" />
                  {showDebug ? "Masquer" : "Afficher"} les détails techniques
                </Button>
                
                {response.templatePath && (
                  <span className="text-xs bg-gray-100 p-1 rounded">
                    Chemin: {response.templatePath}
                  </span>
                )}
              </div>
              
              {showDebug && (
                <div className="mt-4 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-[200px]">
                  <div className="font-medium mb-1">Réponse complète du webhook:</div>
                  <pre className="whitespace-pre-wrap break-words">{rawResponse}</pre>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {hasTemplateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de modèle n8n</AlertTitle>
            <AlertDescription>
              <p>Le webhook n8n a retourné un modèle non évalué: {response?.imageUrl}</p>
              <p className="text-sm mt-2">
                Il est nécessaire de modifier le workflow n8n. Ajoutez un nœud "Set" avant le nœud "Répondre Webhook" 
                pour évaluer correctement les expressions JSON.
              </p>
              {response?.templatePath && (
                <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                  <p className="font-medium">Chemin détecté:</p>
                  <code>{response.templatePath}</code>
                </div>
              )}
              {response?.details && (
                <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                  <p className="font-medium">Détails:</p>
                  <p>{response.details}</p>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={toggleDebug}
              >
                {showDebug ? "Masquer" : "Afficher"} les détails techniques
              </Button>
              {showDebug && response?.originalResponse && (
                <div className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto max-h-[200px]">
                  <pre>{JSON.stringify(response.originalResponse, null, 2)}</pre>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {response?.error && !hasTemplateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              {response.error}
              {response.details && (
                <p className="text-sm mt-1">{response.details}</p>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {hasValidImage && (
          <div className="space-y-4">
            <AspectRatio ratio={1}>
              <img
                src={response.imageUrl}
                alt="Image générée"
                className="rounded-md w-full h-full object-cover"
                onError={(e) => {
                  console.error("Erreur de chargement d'image:", e);
                  toast({
                    title: "Erreur",
                    description: "Impossible de charger l'image. Format d'URL potentiellement incorrect.",
                    variant: "destructive"
                  });
                  setShowDebug(true);
                }}
              />
            </AspectRatio>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex-1" onClick={resetForm}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Nouvelle image
              </Button>
              
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
          </div>
        )}
        
        {!hasValidImage && !isGenerating && !response?.error && (
          <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImageIcon size={48} className="mb-4" />
              <p>Aucune image générée</p>
              <p className="text-sm mt-2">Utilisez le formulaire ci-dessus pour générer une image</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
        <div className="text-sm text-gray-500">
          Génération via le webhook n8n
        </div>
        <Button variant="ghost" size="sm" onClick={resetForm} className="text-gray-500">
          Réinitialiser
        </Button>
      </CardFooter>
    </Card>
  );
};
