import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { formatTranslationResult } from '@/utils/translationUtils';

export const useTranslation = (
  setDebugData: (data: any) => void
) => {
  const [text, setText] = useState('');
  const [langPair, setLangPair] = useState('fr-ar');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseType, setResponseType] = useState<'direct-translation' | 'enhanced-content' | 'error' | 'unknown'>('unknown');
  const { toast } = useToast();

  // URL fixe du webhook n8n pour la traduction
  const WEBHOOK_URL = 'https://n8n-jamal-u38598.vm.elestio.app/webhook/4732aeff-7544-4f0e-8554-ebd0f614947b';

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
    console.log(`Envoi de la requête au webhook de traduction: ${WEBHOOK_URL}`);
    
    // Modification importante: s'assurer que le type est explicitement "translation" 
    // et non "improvement" pour que le workflow n8n traite correctement la requête
    const payload = { 
      text: text.trim(), 
      langPair,
      type: "translation",
      service: "translation"
    };
    
    console.log("Payload envoyé:", payload);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
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

      // Récupération de la réponse JSON
      const responseData = await response.json();
      console.log("Réponse complète reçue du webhook:", responseData);
      
      // Enregistrement de la réponse complète pour le débogage
      setDebugData(responseData);
      
      // Définir le type de réponse comme traduction directe
      setResponseType('direct-translation');
      
      // Extraction spécifique du champ Traduction qui contient la sortie finale
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
            // Garder le texte tel quel si le parsing échoue
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
      }
    } catch (err: any) {
      console.error("Erreur de traduction:", err);
      setError(err.message || 'Erreur lors de la traduction.');
      setResponseType('error');
      toast({
        title: "Erreur",
        description: `Erreur lors de la traduction: ${err.message || 'Problème de connexion'}`,
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
