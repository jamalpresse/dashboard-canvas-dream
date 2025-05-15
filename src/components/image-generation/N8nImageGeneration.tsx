
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Loader2, ImageIcon, RefreshCw, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { createDownloadableImage } from "@/services/imageGenerationService";

// Interface mise à jour pour correspondre au nouveau format de réponse
interface N8nGenerationResponse {
  imageUrl: string;
}

export const N8nImageGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<N8nGenerationResponse | null>(null);

  const handleGenerateWithN8n = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Veuillez saisir une description pour votre image");
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
      
      setResponse(data);
      
      // Vérification si l'URL de l'image est valide
      if (data.imageUrl && typeof data.imageUrl === 'string' && 
          !data.imageUrl.includes('{{') && !data.imageUrl.includes('}}')) {
        toast.success("Image générée avec succès!");
      } else {
        toast.warning("La réponse ne contient pas d'URL d'image valide");
      }
    } catch (err) {
      console.error("Erreur lors de l'appel du webhook:", err);
      toast.error("Échec de la communication avec le webhook");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setPrompt("");
    setResponse(null);
  };
  
  const handleDownload = () => {
    if (response?.imageUrl) {
      try {
        createDownloadableImage(response.imageUrl, `image-n8n-${Date.now()}`);
        toast.success("Téléchargement démarré!");
      } catch (err) {
        toast.error("Erreur lors du téléchargement de l'image");
      }
    }
  };

  // Vérification si l'URL de l'image semble valide
  const hasValidImage = response?.imageUrl && 
    typeof response.imageUrl === 'string' && 
    !response.imageUrl.includes('{{') &&
    !response.imageUrl.includes('}}');

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Génération d'images via n8n
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
                    onError={() => toast.error("Impossible de charger l'image")}
                  />
                </AspectRatio>
              </div>
            </div>
          )}
          
          {response && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Réponse JSON:</h3>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-xs">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3">
          {response && (
            <>
              <Button 
                type="button" 
                variant="outline"
                onClick={resetForm}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
              
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
            </>
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
        </CardFooter>
      </form>
    </Card>
  );
};
