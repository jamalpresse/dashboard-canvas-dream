
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Languages, Clipboard, ClipboardCheck, AlertCircle } from "lucide-react";
import { extractTranslationFromResponse, formatTranslationResult } from "@/utils/translationUtils";
import TranslationResult from "@/components/translation/TranslationResult";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Define interface for the relevantData object to fix TypeScript errors
interface RelevantData {
  titre?: string;
  texte?: string;
  titresSEO?: string[];
  hashtags?: string[];
  [key: string]: any; // Allow for any additional properties
}

export default function Translation() {
  const [text, setText] = useState('');
  const [langPair, setLangPair] = useState('fr-ar');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);
  const { toast } = useToast();

  // URL fixe du webhook n8n pour la traduction
  const WEBHOOK_URL = 'https://n8n-jamal-u38598.vm.elestio.app/webhook/4732aeff-7544-4f0e-8554-ebd0f614947b';

  const langs = [
    { label: 'AR → FR', value: 'ar-fr' },
    { label: 'FR → AR', value: 'fr-ar' },
    { label: 'ANG → AR', value: 'en-ar' },
    { label: 'ANG → FR', value: 'en-fr' },
    { label: 'ES → AR', value: 'es-ar' },
    { label: 'ES → FR', value: 'es-fr' },
  ];

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

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 animate-fade-in">
      <Card className="w-full max-w-4xl mx-auto shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Languages className="h-6 w-6 text-purple-500" />
            Traduction Multilingue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {/* Language Pair Selection */}
          <section>
            <div className="mb-2">
              <span className="text-sm font-medium">Sélectionner la paire de langues:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {langs.map(({ label, value }) => (
                <Button
                  key={value}
                  onClick={() => setLangPair(value)}
                  className={`py-2 rounded-md border shadow-sm transition-all duration-200 ${
                    langPair === value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white ring-2 ring-purple-600'
                      : 'bg-white text-black border-gray-300 hover:bg-purple-50'
                  }`}
                  variant={langPair === value ? "default" : "outline"}
                >
                  {label}
                </Button>
              ))}
            </div>
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
                <ClipboardCheck className="mr-1 h-4 w-4" />
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
                onClick={toggleDebugInfo}
                variant="outline"
                className="ml-auto bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 transition-colors shadow-sm"
              >
                DEBUG
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Debug Dialog */}
      <Dialog open={showDebugInfo} onOpenChange={setShowDebugInfo}>
        <DialogContent className="max-w-4xl max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Informations de débogage</DialogTitle>
            <DialogDescription>Détails de la dernière traduction</DialogDescription>
          </DialogHeader>
          <div className="bg-gray-100 p-4 rounded-md overflow-auto">
            <h3 className="font-bold mb-2">Paramètres:</h3>
            <pre>
              {JSON.stringify({ text: text.substring(0, 100) + "...", langPair }, null, 2)}
            </pre>
            
            <h3 className="font-bold mt-4 mb-2">Réponse brute:</h3>
            <pre className="text-xs">
              {debugData ? JSON.stringify(debugData, null, 2) : "Aucune donnée disponible"}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
