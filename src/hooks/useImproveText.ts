
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { checkClipboardSupport } from '@/utils/textUtils';
import { supabase } from '@/integrations/supabase/client';

export const useImproveText = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [canClipboard, setCanClipboard] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const { toast } = useToast();

  // Using Supabase Edge Function 'improve-proxy' for cross-origin webhook calls

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
    setResult(null);
    setRequestSent(false);

    try {
      toast({
        title: "Traitement en cours",
        description: "Envoi de la demande d'amélioration...",
      });

      const { data, error } = await supabase.functions.invoke('improve-proxy', {
        body: { text: inputText.trim() },
      });

      setRequestSent(true);

      if (error) {
        throw error;
      }

      setResult(data);

      toast({
        title: "Traitement terminé",
        description: "Le texte a été amélioré avec succès",
      });
    } catch (err: any) {
      console.error("Erreur détaillée lors de l'amélioration:", err);
      toast({
        title: "Erreur",
        description: `Échec de l'amélioration: ${err.message || 'Problème de connexion'}`,
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
    requestSent,
    result,
    handlePaste,
    handleImprove,
    handleCopy
  };
};
