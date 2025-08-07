import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
      console.log("Début de la recherche avec la requête:", query);
      
      const response = await fetch('https://automate.ihata.ma/webhook/c1d2aee7-e096-4dc9-a69c-023af6631d88', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          type: 'search'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Réponse complète reçue du webhook de recherche:", responseData);
      
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
      // Méthode 4: Chercher dans toutes les clés pour une valeur de type string
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
      setError(`Erreur lors de la recherche: ${errorMessage}`);
      
      toast({
        title: "Erreur de recherche",
        description: errorMessage,
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