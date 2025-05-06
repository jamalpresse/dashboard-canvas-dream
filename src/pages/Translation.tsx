import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Languages, Clipboard, ClipboardCheck, AlertCircle } from "lucide-react";
import { extractTranslationFromResponse, formatTranslationResult } from "@/utils/translationUtils";
import TranslationResult from "@/components/translation/TranslationResult";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const { toast } = useToast();

  // URL du webhook n8n pour la traduction
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
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, langPair }),
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log("Réponse API de traduction:", data);
      
      // Utilisation des nouvelles fonctions d'extraction et de formatage
      const extractedData = extractTranslationFromResponse(data);
      const formattedResult = formatTranslationResult(extractedData);
      
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
        description: "Erreur lors de la traduction. Veuillez réessayer.",
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
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
