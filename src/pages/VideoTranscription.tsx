import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

const VideoTranscription: React.FC = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [iframeError, setIframeError] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleOpenNewTab = () => {
    window.open("https://kome.ai/tools/youtube-transcript-generator", "_blank");
    toast.success("Ouverture dans un nouvel onglet");
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  return (
    <div className={`container mx-auto p-4 space-y-4 ${isRTL ? 'rtl' : ''}`}>
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common', 'back') || 'Retour'}
          </Button>
          <h1 className="text-2xl font-bold gradient-text-primary">
            {t('pages', 'videoTranscription') || 'Transcription vidéo'}
          </h1>
        </div>
        
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleOpenNewTab}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          {t('common', 'openNewTab') || 'Nouvel onglet'}
        </Button>
      </div>

      {/* Main content */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="gradient-text-primary">
            Générateur de transcription YouTube
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!iframeError ? (
            <iframe
              src="https://kome.ai/tools/youtube-transcript-generator"
              className="w-full h-[700px] border-0 rounded-b-lg"
              title="YouTube Transcript Generator"
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
              <p className="text-muted-foreground">
                Le contenu ne peut pas être affiché dans cette iframe.
              </p>
              <p className="text-sm text-muted-foreground">
                Certains sites web bloquent l'affichage en iframe pour des raisons de sécurité.
              </p>
              <Button onClick={handleOpenNewTab} className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Ouvrir dans un nouvel onglet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoTranscription;