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
        method: "GET"
      });
      const data = await result.json();
      console.log("Réponse du webhook n8n:", data);

      // Traiter comme une réponse complète pour capturer les détails d'erreur potentiels
      setResponse(data);

      // Vérification si l'URL de l'image est valide
      if (data.imageUrl && typeof data.imageUrl === 'string' && !data.imageUrl.includes('{{') && !data.imageUrl.includes('}}')) {
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
  const hasValidImage = response?.imageUrl && typeof response.imageUrl === 'string' && !response.imageUrl.includes('{{') && !response.imageUrl.includes('}}');

  // Vérification si nous avons une erreur de modèle n8n non évalué
  const hasTemplateError = response?.imageUrl && typeof response.imageUrl === 'string' && (response.imageUrl.includes('{{') || response.imageUrl.includes('}}'));
  return <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      
      
      <form onSubmit={handleGenerateWithN8n}>
        
        
        
      </form>
    </Card>;
};