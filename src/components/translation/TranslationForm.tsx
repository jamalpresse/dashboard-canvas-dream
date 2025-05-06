
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Languages, Clipboard, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { extractTranslationFromResponse, formatTranslationResult } from "@/utils/translationUtils";
import TranslationResult from "@/components/translation/TranslationResult";
import LanguageSelector from "@/components/translation/LanguageSelector";

interface TranslationFormProps {
  onDebugToggle: () => void;
  setDebugData: (data: any) => void;
}

const TranslationForm: React.FC<TranslationFormProps> = ({ onDebugToggle, setDebugData }) => {
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

  return (
    <>
      {/* Source Text Input Section */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Texte source:</span>
          <span className="text-sm text-gray-500">
            {isSourceRTL ? 'RTL' : 'LTR'}
          </span>
        </div>
        <Textarea
          placeholder="Collez ici votre texte à traduire"
          value={text}
          onChange={e => setText(e.target.value)}
          dir={isSourceRTL ? 'rtl' : 'ltr'}
          className={`w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
            isSourceRTL ? 'text-right' : 'text-left'
          }`}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            onClick={handlePaste}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-800 transition-colors shadow-sm"
          >
            <Clipboard className="mr-1 h-4 w-4" />
            COLLER
          </Button>
          <Button
            onClick={handleTranslate}
            disabled={loading}
            className={`${
              loading 
                ? 'bg-gray-400' 
                : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-colors'
            }`}
          >
            <Languages className="mr-1 h-4 w-4" />
            {loading ? 'TRADUCTION...' : 'TRADUIRE'}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors shadow-sm"
          >
            EFFACER
          </Button>
        </div>
      </section>

      {/* Language Selector Component */}
      <section>
        <LanguageSelector 
          selectedLangPair={langPair}
          onLangPairChange={setLangPair}
        />
      </section>

      {/* Error Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Translation Results */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Résultat de la traduction:</span>
          <span className="text-sm text-gray-500">
            {isTargetRTL ? 'RTL' : 'LTR'}
          </span>
        </div>
        
        <TranslationResult 
          result={result} 
          isRTL={isTargetRTL} 
          onCopy={handleCopy}
        />
        
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            onClick={handleCopy}
            disabled={!result}
            className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors shadow-sm ${!result ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Clipboard className="mr-1 h-4 w-4" />
            COPIER
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            className="bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors shadow-sm"
          >
            EFFACER
          </Button>
          <Button
            onClick={onDebugToggle}
            variant="outline"
            className="ml-auto bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors shadow-sm"
          >
            DEBUG
          </Button>
        </div>
      </section>
    </>
  );
};

export default TranslationForm;
