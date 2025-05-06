
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { checkClipboardSupport } from '@/utils/textUtils';

export const useImproveText = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [canClipboard, setCanClipboard] = useState(false);
  const { toast } = useToast();

  // URL du webhook n8n pour l'amélioration de texte
  const WEBHOOK_URL =
    'https://n8n-jamal-u38598.vm.elestio.app/webhook/4732aeff-7544-4f0e-8554-ebd0f614947b';

  useEffect(() => {
    setCanClipboard(checkClipboardSupport());
  }, []);

  const handlePaste = async () => {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      toast({
        title: "Erreur",
        description: "Votre navigateur ne supporte pas le collage automatique",
        variant: "destructive",
      });
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast({
        title: "Collé avec succès",
        description: "Le texte a été collé depuis le presse-papier",
      });
    } catch (err) {
      console.error('Lecture presse-papier échouée:', err);
      toast({
        title: "Erreur",
        description: "Impossible de lire le presse-papier",
        variant: "destructive",
      });
    }
  };

  const handleImprove = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Attention",
        description: "Le champ texte est vide",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setResult(null); // Reset previous results
    
    console.log(`Envoi de la requête au webhook d'amélioration: ${WEBHOOK_URL}`);
    
    // Adapter le format de la charge utile pour correspondre à celui attendu par n8n
    const payload = { 
      text: inputText.trim(), 
      type: "improvement"  // Paramètre essentiel pour identifier le type de requête
    };
    
    console.log("Payload envoyé:", payload);
    
    try {
      toast({
        title: "Traitement en cours",
        description: "Envoi de la demande d'amélioration...",
      });
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        // Note: On n'utilise pas mode: 'no-cors' car cela empêcherait de lire la réponse
      });
      
      console.log("Statut de la réponse:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupération de la réponse JSON
      const responseData = await response.json();
      console.log("Réponse complète reçue du webhook:", responseData);
      
      // Gestion des différents formats possibles de réponse
      let processedResult;
      if (responseData.Traduction) {
        // Format utilisé par certaines configurations n8n
        processedResult = responseData.Traduction;
        console.log("Format de réponse avec champ Traduction détecté");
      } else {
        // Format standard
        processedResult = responseData;
        console.log("Format de réponse standard détecté");
      }
      
      setResult(processedResult);
      
      toast({
        title: "Traitement terminé",
        description: "Le texte a été amélioré avec succès",
      });
    } catch (err: any) {
      console.error("Erreur détaillée lors de l'amélioration:", err);
      toast({
        title: "Erreur",
        description: `Échec de l'amélioration: ${err.message || 'Problème de connexion ou CORS'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string) => {
    if (!canClipboard) {
      toast({
        title: "Attention",
        description: "Copie non disponible. Sélectionnez et copiez manuellement",
        variant: "default",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copié",
        description: "Texte copié dans le presse-papier",
      });
    } catch (err) {
      console.error('Échec copie presse-papier:', err);
      toast({
        title: "Erreur",
        description: "Impossible de copier",
        variant: "destructive",
      });
    }
  };

  return {
    inputText,
    setInputText,
    loading,
    result,
    handlePaste,
    handleImprove,
    handleCopy
  };
};
