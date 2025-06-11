import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, ImageIcon, RefreshCw, Download, AlertCircle, Bug, Languages } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createDownloadableImage, generateImageWithN8n } from "@/services/imageGenerationService";
import { useLanguage } from "@/context/LanguageContext";

// Interface mise à jour pour correspondre au format de réponse complet
interface N8nGenerationResponse {
  imageUrl: string;
  error?: string;
  details?: string;
  templatePath?: string;
  originalResponse?: any;
  translationInfo?: {
    originalPrompt: string;
    translatedPrompt: string;
    detectedLanguage: string;
    wasTranslated: boolean;
  };
}

export const N8nImageGeneration = () => {
  const { t, isRTL } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<N8nGenerationResponse | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [rawResponse, setRawResponse] = useState<string>("");

  const handleGenerateWithN8n = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: t("imageGeneration", "error"),
        description: t("imageGeneration", "enterDescription"),
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    setShowDebug(false);
    try {
      const result = await generateImageWithN8n(prompt);
      console.log("Résultat de la génération d'image:", result);
      
      setRawResponse(JSON.stringify(result.originalResponse, null, 2));
      
      setResponse(result);
      if (result.error) {
        toast({
          title: t("imageGeneration", "error"),
          description: result.error,
          variant: "destructive"
        });
        setShowDebug(true);
      } else if (result.imageUrl && !result.imageUrl.includes('{{')) {
        toast({
          title: t("imageGeneration", "success"),
          description: t("imageGeneration", "successMessage")
        });
        
        // Show translation info if available
        if (result.translationInfo?.wasTranslated) {
          toast({
            title: t("imageGeneration", "promptTranslated"),
            description: `${t("imageGeneration", "detectedLanguage")}: ${result.translationInfo.detectedLanguage}`,
          });
        }
      }
    } catch (err) {
      console.error("Erreur lors de la génération:", err);
      toast({
        title: t("imageGeneration", "error"),
        description: t("imageGeneration", "errorMessage"),
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
          title: t("imageGeneration", "success"),
          description: t("imageGeneration", "downloadStarted")
        });
      } catch (err) {
        toast({
          title: t("imageGeneration", "error"),
          description: t("imageGeneration", "downloadError"),
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
    <div className={isRTL ? 'rtl' : 'ltr'}>
      <Card className="shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t("imageGeneration", "n8nTitle")}</CardTitle>
          <CardDescription>
            {t("imageGeneration", "n8nDescription")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleGenerateWithN8n} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="text-lg font-medium block mb-2">
                {t("imageGeneration", "imageDescription")}
              </label>
              <Textarea
                id="prompt"
                placeholder={t("imageGeneration", "placeholder")}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-y bg-white text-black border-gray-300 placeholder:text-gray-500 focus:border-primary focus:ring-primary"
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />
                  {t("imageGeneration", "generating")}
                </>
              ) : (
                <>
                  <ImageIcon className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t("imageGeneration", "generateButton")}
                </>
              )}
            </Button>
          </form>
          
          {/* Translation information display */}
          {response?.translationInfo?.wasTranslated && (
            <Alert className="bg-blue-50 border-blue-200">
              <Languages className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">{t("imageGeneration", "promptTranslated")}</AlertTitle>
              <AlertDescription className="text-blue-700">
                <div className="space-y-1 text-sm">
                  <p><strong>{t("imageGeneration", "detectedLanguage")}:</strong> {response.translationInfo.detectedLanguage.toUpperCase()}</p>
                  <p><strong>{t("imageGeneration", "originalPrompt")}:</strong> {response.translationInfo.originalPrompt}</p>
                  <p><strong>{t("imageGeneration", "translatedPrompt")}:</strong> {response.translationInfo.translatedPrompt}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Information de débogage améliorée */}
          {response && !hasValidImage && (
            <Alert variant={response.error ? "destructive" : "default"} className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{response.error ? t("imageGeneration", "errorDetected") : t("imageGeneration", "information")}</AlertTitle>
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
                    <Bug className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {showDebug ? t("imageGeneration", "hideTechnicalDetails") : t("imageGeneration", "showTechnicalDetails")}
                  </Button>
                  
                  {response.templatePath && (
                    <span className="text-xs bg-gray-100 p-1 rounded">
                      {t("imageGeneration", "detectedPath")} {response.templatePath}
                    </span>
                  )}
                </div>
                
                {showDebug && (
                  <div className="mt-4 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-[200px]">
                    <div className="font-medium mb-1">{t("imageGeneration", "fullWebhookResponse")}:</div>
                    <pre className="whitespace-pre-wrap break-words">{rawResponse}</pre>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {hasTemplateError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("imageGeneration", "templateError")}</AlertTitle>
              <AlertDescription>
                <p>{t("imageGeneration", "templateErrorDescription")}: {response?.imageUrl}</p>
                <p className="text-sm mt-2">
                  {t("imageGeneration", "templateErrorSolution")}
                </p>
                {response?.templatePath && (
                  <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                    <p className="font-medium">{t("imageGeneration", "detectedPath")}:</p>
                    <code>{response.templatePath}</code>
                  </div>
                )}
                {response?.details && (
                  <div className="mt-2 text-xs bg-red-50 p-2 rounded">
                    <p className="font-medium">{t("imageGeneration", "details")}:</p>
                    <p>{response.details}</p>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={toggleDebug}
                >
                  {showDebug ? t("imageGeneration", "hideTechnicalDetails") : t("imageGeneration", "showTechnicalDetails")}
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
              <AlertTitle>{t("imageGeneration", "error")}</AlertTitle>
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
                  alt={t("imageGeneration", "title")}
                  className="rounded-md w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Erreur de chargement d'image:", e);
                    toast({
                      title: t("imageGeneration", "error"),
                      description: t("imageGeneration", "loadingError"),
                      variant: "destructive"
                    });
                    setShowDebug(true);
                  }}
                />
              </AspectRatio>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="flex-1" onClick={resetForm}>
                  <RefreshCw className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t("imageGeneration", "newImage")}
                </Button>
                
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" onClick={handleDownload}>
                  <Download className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t("imageGeneration", "download")}
                </Button>
              </div>
            </div>
          )}
          
          {!hasValidImage && !isGenerating && !response?.error && (
            <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageIcon size={48} className="mb-4" />
                <p>{t("imageGeneration", "noImageGenerated")}</p>
                <p className="text-sm mt-2">{t("imageGeneration", "useFormAbove")}</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
          <div className="text-sm text-gray-500">
            {t("imageGeneration", "webhookGeneration")}
          </div>
          <Button variant="ghost" size="sm" onClick={resetForm} className="text-gray-500">
            {t("imageGeneration", "reset")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
