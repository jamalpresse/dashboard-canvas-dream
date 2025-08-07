
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
  const WEBHOOK_URL_NEW = 'https://automate.ihata.ma/webhook/c1d2aee7-e096-4dc9-a69c-023af6631d88';

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
    
    // Utilisation du nouveau webhook corrigé
    console.log(`Utilisation du nouveau webhook: ${WEBHOOK_URL_NEW}`);
    console.log(`Traduction pour ${langPair}`);
    
    // Payload standardisé
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
      const response = await fetch(WEBHOOK_URL_NEW, {
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
      
      setDebugData({ ...responseData, webhook: 'new' });
      setResponseType('direct-translation');
      
      let translationText = '';
      
      // Méthode 1: Extraction du champ Traduction (format standard)
      if (responseData && responseData.Traduction !== undefined) {
        translationText = responseData.Traduction;
        console.log("Traduction extraite du champ Traduction:", translationText);
      }
      // Méthode 2: Format {"object Object": {"output": "..."}} pour any-ar
      else if (responseData && responseData["object Object"] && responseData["object Object"].output) {
        translationText = responseData["object Object"].output;
        console.log("Traduction extraite du format object Object:", translationText);
      }
      // Méthode 3: Chercher dans toutes les clés pour une valeur de type string
      else if (responseData && typeof responseData === 'object') {
        console.log("Recherche de traduction dans toutes les clés de la réponse...");
        for (const [key, value] of Object.entries(responseData)) {
          if (typeof value === 'string' && value.trim().length > 0) {
            translationText = value;
            console.log(`Traduction trouvée dans la clé "${key}":`, translationText);
            break;
          }
          // Si la valeur est un objet, chercher dedans
          else if (typeof value === 'object' && value !== null) {
            for (const [subKey, subValue] of Object.entries(value as any)) {
              if (typeof subValue === 'string' && subValue.trim().length > 0) {
                translationText = subValue;
                console.log(`Traduction trouvée dans "${key}.${subKey}":`, translationText);
                break;
              }
            }
            if (translationText) break;
          }
        }
      }
      
      // Si une traduction a été trouvée
      if (translationText && translationText.trim()) {
        // Si la traduction est une chaîne JSON, essayer de la parser
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
        // Aucune traduction trouvée, utiliser le formateur de fallback
        console.log("Aucune traduction trouvée, utilisation du formateur de fallback");
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
