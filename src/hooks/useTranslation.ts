
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { extractTranslationFromResponse, formatTranslationResult } from "@/utils/translationUtils";

export const useTranslation = (
  setDebugData: (data: any) => void
) => {
  const [text, setText] = useState('');
  const [langPair, setLangPair] = useState('fr-ar');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    console.log(`Envoi de la requête au webhook ${WEBHOOK_URL}`);
    console.log(`Données: texte=${text.substring(0, 50)}..., paire de langues=${langPair}`);
    
    // Préparer les données à envoyer - utiliser l'URL fixe du webhook
    const payload = { 
      text: text.trim(), 
      langPair
    };
    
    console.log("Payload complet:", payload);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Réponse brute du serveur:", response);
      console.log("Statut:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }

      let responseData;
      try {
        responseData = await response.json();
        console.log("Réponse JSON complète:", JSON.stringify(responseData, null, 2));
        setDebugData(responseData);
      } catch (jsonError) {
        const textResponse = await response.text();
        console.log("Réponse texte (non-JSON):", textResponse);
        responseData = textResponse;
        setDebugData({ textResponse });
      }
      
      if (!responseData) {
        throw new Error("Réponse vide reçue du serveur");
      }
      
      // Utilisation des fonctions d'extraction et de formatage
      const extractedData = extractTranslationFromResponse(responseData);
      console.log("Données extraites après traitement:", extractedData);
      
      const formattedResult = formatTranslationResult(extractedData);
      console.log("Résultat formaté final:", formattedResult.substring(0, 100) + "...");
      
      setResult(formattedResult);
      toast({
        title: "Traduction complétée",
        description: "Le texte a été traduit avec succès",
      });
    } catch (err: any) {
      console.error("Erreur de traduction:", err);
      setError(err.message || 'Erreur lors de la traduction.');
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
    isSourceRTL,
    isTargetRTL,
    handlePaste,
    handleTranslate,
    handleClear,
    handleCopy
  };
};

export default useTranslation;
