
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Loader2, ImageIcon, RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface N8nGenerationResponse {
  myField: string;
  imageUrl?: string; // We make this optional since we're not sure if it will be included
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
      // Modification: Changed from POST to GET method
      // Removed Content-Type header and body
      // Added prompt as a query parameter in the URL
      const webhookUrl = `https://n8n-jamal-u38598.vm.elestio.app/webhook/generate-image?prompt=${encodeURIComponent(prompt)}`;
      
      console.log("Appel du webhook n8n (GET):", webhookUrl);
      
      const result = await fetch(webhookUrl, {
        method: "GET", // Changed from POST to GET
      });
      
      const data = await result.json();
      console.log("Réponse du webhook n8n:", data);
      
      setResponse(data);
      toast.success("Requête traitée avec succès!");
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
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Décrivez l'image que vous souhaitez générer..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-24"
            disabled={isGenerating}
          />
          
          {response && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Réponse reçue:</h3>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3">
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
