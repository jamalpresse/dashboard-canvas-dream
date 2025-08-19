import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Veuillez saisir une requête de recherche');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      console.log("🔍 Search - Starting search with query:", query);
      console.log("🔍 Search - Invoking edge function search-proxy...");
      
      const { data: responseData, error: functionError } = await supabase.functions.invoke('search-proxy', {
        body: {
          query: query.trim(),
          type: 'search'
        },
      });

      console.log("🔍 Search - Raw Supabase response:");
      console.log("🔍 Search - responseData:", responseData);
      console.log("🔍 Search - functionError:", functionError);
      console.log("🔍 Search - responseData type:", typeof responseData);
      console.log("🔍 Search - functionError type:", typeof functionError);

      if (functionError) {
        console.error("🔍 Search - Function error details:", JSON.stringify(functionError, null, 2));
        
        // Enhanced error analysis
        if (functionError.message && functionError.message.includes('non-2xx')) {
          console.error("🔍 Search - This is a non-2xx status code error from the edge function");
          console.error("🔍 Search - This means our edge function received an error from the n8n webhook");
        }
        
        throw new Error(functionError.message || 'Erreur du service de recherche');
      }

      // Check if the response indicates an error (new format)
      if (responseData && responseData.success === false) {
        console.error("🔍 Search - Edge function returned error in response:", responseData);
        const errorMsg = `${responseData.error || 'Erreur inconnue'}. ${responseData.suggestion || ''}`;
        if (responseData.attemptedUrls) {
          console.log("🔍 Search - Attempted URLs:", responseData.attemptedUrls);
        }
        throw new Error(errorMsg);
      }

      console.log("🔍 Search - Réponse complète reçue du webhook de recherche:", responseData);
      
      let searchResult = '';
      
      // Méthode 1: Extraction du champ result (format standard)
      if (responseData && responseData.result !== undefined) {
        searchResult = responseData.result;
        console.log("Résultat extrait du champ result:", searchResult);
      }
      // Méthode 2: Extraction du champ output
      else if (responseData && responseData.output !== undefined) {
        searchResult = responseData.output;
        console.log("Résultat extrait du champ output:", searchResult);
      }
      // Méthode 3: Format {"object Object": {"output": "..."}}
      else if (responseData && responseData["object Object"] && responseData["object Object"].output) {
        searchResult = responseData["object Object"].output;
        console.log("Résultat extrait du format object Object:", searchResult);
      }
      // Méthode 4: Extraction du champ message
      else if (responseData && responseData.message !== undefined) {
        searchResult = responseData.message;
        console.log("Résultat extrait du champ message:", searchResult);
      }
      // Méthode 5: Extraction du champ data
      else if (responseData && responseData.data !== undefined) {
        searchResult = responseData.data;
        console.log("Résultat extrait du champ data:", searchResult);
      }
      // Méthode 6: Extraction du champ payload
      else if (responseData && responseData.payload !== undefined) {
        searchResult = responseData.payload;
        console.log("Résultat extrait du champ payload:", searchResult);
      }
      // Méthode 7: Chercher dans toutes les clés pour une valeur de type string
      else if (responseData && typeof responseData === 'object') {
        console.log("Recherche de résultat dans toutes les clés de la réponse...");
        for (const [key, value] of Object.entries(responseData)) {
          if (typeof value === 'string' && value.trim().length > 0) {
            searchResult = value;
            console.log(`Résultat trouvé dans la clé "${key}":`, searchResult);
            break;
          }
          // Si la valeur est un objet, chercher dedans
          else if (typeof value === 'object' && value !== null) {
            for (const [subKey, subValue] of Object.entries(value as any)) {
              if (typeof subValue === 'string' && subValue.trim().length > 0) {
                searchResult = subValue;
                console.log(`Résultat trouvé dans "${key}.${subKey}":`, searchResult);
                break;
              }
            }
            if (searchResult) break;
          }
        }
      }

      // Si un résultat a été trouvé
      if (searchResult && searchResult.trim()) {
        // Si le résultat est une chaîne JSON, essayer de la parser
        if (typeof searchResult === 'string' && 
            (searchResult.trim().startsWith('{') || searchResult.trim().startsWith('['))) {
          try {
            const parsed = JSON.parse(searchResult);
            // Si c'est un objet avec une propriété texte, utiliser cette propriété
            if (typeof parsed === 'object' && parsed !== null) {
              const textContent = parsed.text || parsed.content || parsed.result || parsed.output;
              setResult(textContent || JSON.stringify(parsed, null, 2));
            } else {
              setResult(String(parsed));
            }
          } catch (parseError) {
            // Si le parsing échoue, utiliser la chaîne telle quelle
            setResult(searchResult);
          }
        } else {
          setResult(String(searchResult));
        }

        toast({
          title: "Recherche terminée",
          description: "La recherche a été effectuée avec succès",
        });
      } else {
        // Aucun résultat trouvé, utiliser un fallback
        console.log("Aucun résultat trouvé, utilisation du fallback");
        const fallbackResult = JSON.stringify(responseData, null, 2);
        setResult(fallbackResult || 'Aucun résultat trouvé');
        
        toast({
          title: "Recherche terminée",
          description: "Recherche effectuée, mais aucun résultat spécifique trouvé",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      // Try to parse error response for detailed information
      let detailedError = errorMessage;
      let attemptedUrls: string[] = [];
      
      try {
        // If the error contains JSON response, try to parse it
        if (errorMessage.includes('attemptedUrls')) {
          const errorMatch = errorMessage.match(/\{.*\}/);
          if (errorMatch) {
            const errorData = JSON.parse(errorMatch[0]);
            detailedError = errorData.error || errorData.details || errorMessage;
            attemptedUrls = errorData.attemptedUrls || [];
          }
        }
      } catch (parseError) {
        console.warn('Could not parse error details:', parseError);
      }
      
      // Provide more specific error messages
      let userFriendlyMessage = detailedError;
      if (detailedError.includes('inaccessibles') || attemptedUrls.length > 0) {
        userFriendlyMessage = `Service de recherche indisponible. ${attemptedUrls.length} endpoints testés.`;
      } else if (errorMessage.includes('404')) {
        userFriendlyMessage = 'Le service de recherche semble inactif. Vérifiez que le workflow n8n est actif.';
      } else if (errorMessage.includes('500')) {
        userFriendlyMessage = 'Erreur serveur du service de recherche. Veuillez réessayer plus tard.';
      } else if (errorMessage.includes('Network')) {
        userFriendlyMessage = 'Problème de connexion réseau. Vérifiez votre connexion internet.';
      }
      
      setError(`Erreur lors de la recherche: ${userFriendlyMessage}`);
      
      // Show attempted URLs in console for debugging
      if (attemptedUrls.length > 0) {
        console.log('URLs tentées:', attemptedUrls);
      }
      
      toast({
        title: "Erreur de recherche",
        description: userFriendlyMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copié",
        description: "Le résultat a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le résultat",
        variant: "destructive",
      });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setQuery(text);
      toast({
        title: "Collé",
        description: "Le texte a été collé depuis le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au presse-papiers",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setResult('');
    setError('');
  };

  return {
    query,
    setQuery,
    result,
    loading,
    error,
    handleSearch,
    handleCopy,
    handlePaste,
    handleClear,
  };
};