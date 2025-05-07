
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { checkClipboardSupport } from '@/utils/textUtils';
import { formatResponseData } from '@/utils/textUtils';

export const useImproveText = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [canClipboard, setCanClipboard] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const { toast } = useToast();

  // URL du webhook n8n pour l'amélioration de texte - MISE À JOUR
  const WEBHOOK_URL =
    'https://n8n-jamal-u38598.vm.elestio.app/webhook/d921f535-1665-4217-968c-acf14fdd55ce';

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
    setRequestSent(false);
    
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
      
      // Modifier la requête pour utiliser mode: 'no-cors' afin d'éviter les erreurs CORS
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Important: Résout les problèmes CORS mais empêche de lire la réponse
        body: JSON.stringify(payload),
      });
      
      setRequestSent(true);
      
      console.log("Requête envoyée avec succès (mode no-cors)");
      
      // Comme on ne peut pas lire la réponse avec mode: 'no-cors',
      // on attend un moment puis on fait une autre requête pour vérifier le résultat
      setTimeout(async () => {
        try {
          // Cette requête pour simuler la réception de la réponse
          // Dans un environnement réel, vous pourriez utiliser un webhook de retour ou polling
          const checkResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              text: inputText.trim().substring(0, 100) + "...", 
              type: "improvement_check",
              check: true
            }),
          });
          
          if (checkResponse.ok) {
            try {
              const responseData = await checkResponse.json();
              console.log("Réponse reçue:", responseData);
              
              // Traiter les différents formats possibles de réponse
              let processedResult = formatResponseData(responseData);
              
              setResult(processedResult);
              
              toast({
                title: "Traitement terminé",
                description: "Le texte a été amélioré avec succès",
              });
            } catch (jsonErr) {
              console.error("Erreur lors du parsing JSON:", jsonErr);
              // Pour les réponses qui ne sont pas au format JSON
              setResult({ body: "Le résultat n'a pas pu être formaté correctement. Veuillez vérifier le webhook." });
              
              toast({
                title: "Avertissement",
                description: "Le résultat a été reçu mais le format est inattendu",
                variant: "default",
              });
            }
          } else {
            throw new Error(`Erreur HTTP: ${checkResponse.status}`);
          }
        } catch (checkErr) {
          console.error("Erreur lors de la vérification:", checkErr);
          // En cas d'erreur, on affiche un message pour au moins montrer que la requête a été envoyée
          if (requestSent) {
            setResult({ 
              body: "La requête a été envoyée mais le résultat n'a pas pu être récupéré. Veuillez vérifier votre webhook n8n." 
            });
            
            toast({
              title: "Information",
              description: "La requête a été envoyée, mais la réponse n'a pas pu être récupérée",
              variant: "default",
            });
          }
        } finally {
          setLoading(false);
        }
      }, 5000); // Attendre 5 secondes avant de vérifier

    } catch (err: any) {
      console.error("Erreur détaillée lors de l'amélioration:", err);
      setLoading(false);
      
      toast({
        title: "Erreur",
        description: `Échec de l'amélioration: ${err.message || 'Problème de connexion ou CORS'}`,
        variant: "destructive",
      });
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
