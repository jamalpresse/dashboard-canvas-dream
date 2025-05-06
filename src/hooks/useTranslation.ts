
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

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
    
    // Préparer les données à envoyer
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
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Statut de la réponse:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupération et traitement de la réponse JSON
      const responseData = await response.json();
      console.log("Réponse complète reçue du webhook:", responseData);
      
      // Enregistrement de la réponse complète pour le débogage
      setDebugData(responseData);
      
      // Extraction de la donnée de traduction depuis le champ "Traduction"
      if (responseData && responseData.Traduction) {
        console.log("Données de traduction trouvées dans le champ 'Traduction':", responseData.Traduction);
        
        try {
          // Essayer de parser le contenu de Traduction si c'est une chaîne JSON
          let translationData = responseData.Traduction;
          
          if (typeof translationData === 'string') {
            try {
              translationData = JSON.parse(translationData);
              console.log("Traduction parsée avec succès:", translationData);
            } catch (parseErr) {
              console.log("La traduction n'est pas au format JSON, utilisation comme texte brut");
            }
          }
          
          // Définir le résultat comme le contenu du champ Traduction (parsé ou brut)
          setResult(typeof translationData === 'object' ? 
            JSON.stringify(translationData, null, 2) : 
            String(translationData));
        } catch (parseErr) {
          console.error("Erreur lors du traitement de la traduction:", parseErr);
          setResult(JSON.stringify(responseData.Traduction));
        }
      } else {
        // Fallback si le format de réponse est différent
        console.log("Format de réponse différent, utilisation de la réponse complète");
        setResult(JSON.stringify(responseData, null, 2));
      }
      
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
