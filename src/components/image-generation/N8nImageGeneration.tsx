import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, ImageIcon, RefreshCw, Download, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createDownloadableImage } from "@/services/imageGenerationService";

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
      // Appel au webhook n8n avec la méthode GET
      const webhookUrl = `https://n8n-jamal-u38598.vm.elestio.app/webhook/9f32367c-65f7-4868-a660-bbab69fc391c?prompt=${encodeURIComponent(prompt)}`;
      
      console.log("Appel du webhook n8n (GET):", webhookUrl);
      
      const result = await fetch(webhookUrl, {
        method: "GET",
      });
      
      const data = await result.json();
      console.log("Réponse du webhook n8n:", data);
      
      // Traiter comme une réponse complète pour capturer les détails d'erreur potentiels
      setResponse(data);
      
      // Vérification si l'URL de l'image est valide
      if (data.imageUrl && typeof data.imageUrl === 'string' && 
          !data.imageUrl.includes('{{') && !data.imageUrl.includes('}}')) {
        toast({
          title: "Succès",
          description: "Image générée avec succès!"
        });
      } else if (data.error) {
        toast({
          title: "Attention",
          description: data.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Attention",
          description: "La réponse ne contient pas d'URL d'image valide",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Erreur lors de l'appel du webhook:", err);
      toast({
        title: "Erreur",
        description: "Échec de la communication avec le webhook",
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
  const hasValidImage = response?.imageUrl && 
    typeof response.imageUrl === 'string' && 
    !response.imageUrl.includes('{{') &&
    !response.imageUrl.includes('}}');

  // Vérification si nous avons une erreur de modèle n8n non évalué
  const hasTemplateError = response?.imageUrl && 
    typeof response.imageUrl === 'string' && 
    (response.imageUrl.includes('{{') || response.imageUrl.includes('}}'));

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Génération d'images - n8n
        </CardTitle>
        <CardDescription>
          Utilisez notre webhook n8n pour générer des images
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleGenerateWithN8n}>
        <CardContent className="space-y-6">
          <Textarea 
            placeholder="Décrivez l'image que vous souhaitez générer..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24"
            disabled={isGenerating}
          />
          
          {hasValidImage && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Image générée:</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <AspectRatio ratio={16/9} className="bg-gray-100">
                  <img 
                    src={response.imageUrl} 
                    alt="Image générée" 
                    className="w-full h-full object-contain"
                    onError={() => toast({
                      title: "Erreur",
                      description: "Impossible de charger l'image",
                      variant: "destructive"
                    })}
                  />
                </AspectRatio>
              </div>
            </div>
          )}
          
          {hasTemplateError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de modèle n8n</AlertTitle>
              <AlertDescription>
                <p>Le modèle n8n n'a pas été évalué correctement. Le webhook a retourné: "{response.imageUrl}"</p>
                <div className="mt-4 text-sm">
                  <h4 className="font-medium">Solution:</h4>
                  <ol className="list-decimal pl-5 space-y-1 mt-2">
                    <li>Ajoutez un nœud "Set" avant le nœud de réponse HTTP dans votre workflow n8n</li>
                    <li>Créez une variable qui évalue l'expression complète</li>
                    <li>Utilisez cette variable dans la réponse HTTP plutôt que l'expression directe</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {response?.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>{response.error}</AlertDescription>
              {response.details && <p className="mt-2 text-sm">{response.details}</p>}
            </Alert>
          )}
          
          {response && showDebug && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Détails de débogage:</h3>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-xs">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between flex-wrap gap-3">
          <div>
            {response && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={toggleDebug}
              >
                {showDebug ? "Masquer le débogage" : "Afficher le débogage"}
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            {response && (
              <Button 
                type="button" 
                variant="outline"
                onClick={resetForm}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            )}
            
            {hasValidImage && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            )}
            
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              disabled={isGenerating || !prompt.trim()}
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
        </CardFooter>
      </form>
    </Card>
  );
};
