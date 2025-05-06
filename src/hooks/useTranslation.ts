
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { formatTranslationResult, extractTranslationFromResponse } from '@/utils/translationUtils';

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
    console.log(`Envoi de la requête au webhook fixe: ${WEBHOOK_URL}`);
    
    // Préparer les données à envoyer avec le format exact attendu par le webhook
    const payload = { 
      text: text.trim(), 
      langPair
    };
    
    console.log("Payload envoyé:", payload);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Statut de la réponse:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupération de la réponse JSON
      const responseData = await response.json();
      console.log("Réponse complète brute reçue du webhook:", responseData);
      
      // Enregistrement de la réponse complète pour le débogage
      setDebugData(responseData);
      
      // Vérification du format de la réponse pour détecter les variables non résolues
      if (responseData && 
          responseData.Traduction && 
          typeof responseData.Traduction === 'string' && 
          responseData.Traduction.includes('{{') && 
          responseData.Traduction.includes('}}')) {
        console.log("Détection de variables non résolues dans la réponse:", responseData.Traduction);
        toast({
          title: "Attention",
          description: "La réponse contient des variables non résolues",
          variant: "destructive",
        });
      }
      
      // Extraction et traitement de la traduction en utilisant nos utilitaires
      const translationContent = extractTranslationFromResponse(responseData);
      console.log("Contenu de traduction extrait:", translationContent);
      
      const formattedResult = formatTranslationResult(responseData);
      console.log("Résultat formaté:", formattedResult);
      
      setResult(formattedResult);
      
      // Afficher un toast en fonction du résultat
      if (formattedResult && !formattedResult.includes('variables non résolues')) {
        toast({
          title: "Traduction complétée",
          description: "Le texte a été traduit avec succès",
        });
      } else {
        toast({
          title: "Traduction partielle",
          description: "Certaines parties n'ont pas pu être traduites correctement",
          variant: "destructive",
        });
      }
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
