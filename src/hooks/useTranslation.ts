
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { formatTranslationResult } from '@/utils/translationUtils';

export const useTranslation = (
  setDebugData: (data: any) => void
) => {
  const [text, setText] = useState('');
  const [langPair, setLangPair] = useState('any-fr');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseType, setResponseType] = useState<'direct-translation' | 'enhanced-content' | 'error' | 'unknown'>('unknown');
  const { toast } = useToast();

  // URLs des webhooks n8n pour la traduction
  const WEBHOOK_URL_OLD = 'https://n8n-jamal-u38598.vm.elestio.app/webhook/4732aeff-7544-4f0e-8554-ebd0f614947b';
  const WEBHOOK_URL_NEW = 'https://automate.ihata.ma:5678/webhook/c1d2aee7-e096-4dc9-a69c-023af6631d8';

  // Détection RTL uniquement pour la langue source ou cible arabe
  const isSourceRTL = langPair.split('-')[0] === 'ar';
  const isTargetRTL = langPair.split('-')[1] === 'ar';

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      setText(clip);
      setError('');
      toast({
        title: "Collé avec succès",
        description: "Le texte a été collé depuis le presse-papier",
      });
    } catch {
      setError('Impossible de lire le presse-papier.');
      toast({
        title: "Erreur",
        description: "Impossible de lire le presse-papier",
        variant: "destructive",
      });
    }
  };

  const handleTranslate = async () => {
    setError('');
    setResult('');
    setResponseType('unknown');
    setDebugData(null);
    
    // Validation du texte d'entrée
    if (!text.trim()) {
      setError('Veuillez entrer du texte à traduire.');
      toast({
        title: "Attention",
        description: "Veuillez entrer du texte à traduire",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // TEMPORAIRE: Utiliser uniquement l'ancien webhook jusqu'à résolution des problèmes CORS
    console.log(`Envoi de la requête au webhook de traduction: ${WEBHOOK_URL_OLD}`);
    console.log(`Traduction pour ${langPair}`);
    
    // Payload standardisé pour l'ancien webhook
    const payload = { 
      text: text.trim(), 
      langPair,
      type: "translation",
      service: "translation",
      action: "translate",
      request_type: "translation"
    };
    
    console.log("Payload envoyé pour la traduction:", payload);
    
    try {
      const response = await fetch(WEBHOOK_URL_OLD, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Statut de la réponse:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Traitement de la réponse JSON
      const responseData = await response.json();
      console.log("Réponse complète reçue du webhook:", responseData);
      
      setDebugData({ ...responseData, webhook: 'old' });
      setResponseType('direct-translation');
      
      // Extraction spécifique du champ Traduction
      if (responseData && responseData.Traduction !== undefined) {
        let translationText = responseData.Traduction;
        
        // Si Traduction est une chaîne JSON, essayer de la parser
        if (typeof translationText === 'string' && 
            (translationText.trim().startsWith('{') || translationText.trim().startsWith('['))) {
          try {
            const parsedTraduction = JSON.parse(translationText);
            translationText = typeof parsedTraduction === 'string' 
              ? parsedTraduction 
              : JSON.stringify(parsedTraduction, null, 2);
          } catch (e) {
            console.log("Échec du parsing JSON, utilisation de la chaîne brute:", e);
          }
        }
        
        console.log("Traduction finale à afficher:", translationText);
        setResult(translationText);
        
        toast({
          title: "Traduction complétée",
          description: "Le texte a été traduit avec succès",
        });
      } else {
        // Fallback au formateur existant si Traduction n'est pas présent
        const formattedResult = formatTranslationResult(responseData);
        setResult(formattedResult);
        
        toast({
          title: "Attention",
          description: "Format de réponse inattendu - vérifiez la configuration n8n",
        });
      }
    } catch (err: any) {
      console.error("Erreur de traduction:", err);
      
      // Messages d'erreur plus spécifiques
      let errorMessage = 'Erreur lors de la traduction.';
      if (err.message.includes('NetworkError') || err.message.includes('fetch')) {
        errorMessage = 'Service de traduction temporairement indisponible. Veuillez réessayer dans quelques instants.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'Problème de configuration du service de traduction.';
      } else if (err.message.includes('HTTP: 500')) {
        errorMessage = 'Erreur du service de traduction. Veuillez réessayer.';
      }
      
      setError(errorMessage);
      setResponseType('error');
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult('');
    setError('');
    setResponseType('unknown');
    setDebugData(null);
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copié",
        description: "Le texte traduit a été copié dans le presse-papier",
      });
    }
  };

  return {
    text,
    setText,
    langPair,
    setLangPair,
    result,
    error,
    loading,
    responseType,
    isSourceRTL,
    isTargetRTL,
    handlePaste,
    handleTranslate,
    handleClear,
    handleCopy
  };
};

export default useTranslation;
