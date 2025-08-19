
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

      console.log('improve-proxy - sending request with text length:', inputText.trim().length);
      
      const { data, error } = await supabase.functions.invoke('improve-proxy', {
        body: { text: inputText.trim() },
      });

      setRequestSent(true);
      
      console.log('improve-proxy - raw response:', data);
      console.log('improve-proxy - error:', error);

      if (error) {
        console.error('improve-proxy - Supabase function error:', error);
        throw error;
      }

      if (data && typeof data === 'object') {
        const status = typeof (data as any).status === 'number' ? (data as any).status : 200;
        const attemptedUrls = (data as any).attemptedUrls;
        const attemptUsed = (data as any).attemptUsed;

        // Enhanced debugging logs
        console.log('improve-proxy - response status:', status);
        console.log('improve-proxy - attemptUsed:', attemptUsed);
        if (attemptedUrls && Array.isArray(attemptedUrls)) {
          console.log('improve-proxy - all attempts:', attemptedUrls);
          attemptedUrls.forEach((attempt: any, index: number) => {
            console.log(`  Attempt ${index + 1}: ${attempt.method} ${attempt.url} -> ${attempt.status} (${attempt.description})`);
          });
        }

        // Check if we have a recognizable response payload even if upstream status was non-2xx
        const hasRecognizedPayload = Boolean(
          (data as any).rewrittenText || 
          (data as any).improved_text || 
          (data as any).texte_ameliore || 
          (data as any).body || 
          (data as any).text || 
          (data as any).content || 
          (data as any).result
        );

        // Enhanced error handling with detailed debugging
        if ((data as any).ok === false && !hasRecognizedPayload) {
          const errorMsg = (data as any)?.details || (data as any)?.error || `Webhook returned status ${status}`;
          console.error('improve-proxy - webhook failed:', { status, errorMsg, attemptedUrls, attemptUsed });
          
          // Show detailed debugging info in console for troubleshooting
          if (attemptedUrls && Array.isArray(attemptedUrls) && attemptedUrls.length > 0) {
            console.log('improve-proxy - Debug: All attempted URLs and their results:');
            attemptedUrls.forEach((attempt: any, index: number) => {
              console.log(`  ${index + 1}. ${attempt.method} ${attempt.url} -> Status: ${attempt.status} (${attempt.description})`);
            });
          }
          
          // Special handling for 404 errors
          if (status === 404 || errorMsg.includes('404') || errorMsg.includes('not registered')) {
            throw new Error(`❌ Webhook indisponible (404)\n\nLe workflow n8n doit être:\n• Activé en mode Production\n• Configuré pour accepter POST avec {"text": "..."}\n• Retourner JSON avec rewrittenText/seoTitles\n\nVérifiez les logs console pour plus de détails.`);
          }
          
          throw new Error(`❌ Erreur webhook (${status}): ${errorMsg}\n\nConsultez les logs console pour le détail des tentatives.`);
        }
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
