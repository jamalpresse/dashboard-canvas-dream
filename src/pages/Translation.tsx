
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import LanguageSelector from '@/components/translation/LanguageSelector';
import ErrorDisplay from '@/components/translation/ErrorDisplay';
import { formatTranslationResult } from '@/utils/translationUtils';

export default function Translation() {
  const [text, setText] = useState('');
  const [langPair, setLangPair] = useState('fr-ar');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState<any>(null);

  // URL du webhook n8n pour la traduction
  const WEBHOOK_URL = 'https://n8n-jamal-u38598.vm.elestio.app/webhook/4732aeff-7544-4f0e-8554-ebd0f614947b';

  // Détection RTL uniquement pour la langue source ou cible arabe
  const isSourceRTL = langPair.split('-')[0] === 'ar';
  const isTargetRTL = langPair.split('-')[1] === 'ar';

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      setText(clip);
      setError('');
    } catch (err) {
      console.error("Erreur de presse-papier:", err);
      setError('Impossible de lire le presse-papier.');
    }
  };

  const handleTranslate = async () => {
    setError('');
    setResult('');
    if (!text.trim()) {
      setError('Veuillez entrer du texte à traduire.');
      return;
    }
    
    setLoading(true);

    // Préparer le payload pour n8n
    const payload = {
      text: text.trim(),
      langPair,
      type: "translation", // Ajout d'un type pour aider n8n à identifier la requête
      timestamp: new Date().toISOString()
    };

    // Enregistrer les détails de la requête pour le débogage
    setRequestDetails(payload);
    
    console.log("Envoi de la requête à n8n:", WEBHOOK_URL);
    console.log("Payload:", payload);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // MODE IMPORTANT: essayer avec différentes options CORS
        mode: 'cors', // Essayer avec 'cors' au lieu de 'no-cors'
        body: JSON.stringify(payload),
      });
      
      console.log("Statut de la réponse:", response.status);
      
      // Si mode: 'cors', on peut vérifier la réponse
      if (!response.ok) {
        console.error("Erreur HTTP:", response.status);
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      // Essayer de récupérer la réponse JSON
      try {
        const data = await response.json();
        console.log("Réponse complète:", data);
        
        if (data && data.Traduction !== undefined) {
          const translation = formatTranslationResult(data);
          setResult(translation);
          toast({
            title: "Traduction réussie",
            description: "Le texte a été traduit avec succès.",
          });
        } else {
          console.error("Format de réponse inattendu:", data);
          throw new Error("Format de réponse inattendu");
        }
      } catch (jsonError) {
        console.error("Erreur lors du parsing JSON:", jsonError);
        throw new Error("Erreur lors du traitement de la réponse");
      }
    } catch (err: any) {
      console.error("Erreur complète:", err);
      setError(err.message || 'Erreur lors de la traduction. Vérifiez la console pour plus de détails.');
      toast({
        title: "Erreur de traduction",
        description: err.message || "Une erreur s'est produite pendant la traduction",
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
    setRequestDetails(null);
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copié",
        description: "Le texte traduit a été copié dans le presse-papier.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <header className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-black">Traduction Multilingue</h1>
      </header>

      <section className="mb-6">
        <textarea
          placeholder="Collez ici votre texte à traduire"
          value={text}
          onChange={e => setText(e.target.value)}
          dir={isSourceRTL ? 'rtl' : 'ltr'}
          className={`w-full h-40 p-4 border rounded focus:outline-none focus:ring-2 focus:ring-red-600 ${
            isSourceRTL ? 'text-right' : 'text-left'
          }`}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePaste}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            COLLER
          </button>
          <button
            type="button"
            onClick={handleTranslate}
            disabled={loading}
            className={`px-4 py-2 text-white rounded ${
              loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'TRADUCTION...' : 'TRADUIRE'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
          >
            EFFACER
          </button>
        </div>
      </section>

      <LanguageSelector 
        selectedLangPair={langPair}
        onLangPairChange={setLangPair}
      />

      <section className="mt-6">
        {error && <ErrorDisplay error={error} />}
        
        <div
          dir={isTargetRTL ? 'rtl' : 'ltr'}
          className={`w-full min-h-[8rem] p-4 border rounded bg-gray-50 ${
            isTargetRTL ? 'text-right' : 'text-left'
          }`}
        >
          {result || <span className="text-gray-400">Le résultat apparaîtra ici</span>}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!result}
            className={`px-4 py-2 ${result ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-300 text-gray-600'} rounded`}
          >
            COPIER
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
          >
            EFFACER
          </button>
        </div>
      </section>

      {/* Section de débogage */}
      {requestDetails && (
        <section className="mt-8 p-4 border rounded bg-gray-100">
          <h3 className="font-medium mb-2">Détails de la dernière requête (pour débogage):</h3>
          <pre className="text-xs overflow-auto p-2 bg-white border rounded">
            {JSON.stringify(requestDetails, null, 2)}
          </pre>
          <p className="mt-2 text-sm text-gray-600">
            Si le workflow n8n ne se déclenche pas, vérifiez que l'URL du webhook est correcte et que le format de la requête est attendu par n8n.
          </p>
        </section>
      )}
    </div>
  );
}
