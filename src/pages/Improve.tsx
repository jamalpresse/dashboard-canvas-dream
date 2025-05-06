
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Improve() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [canClipboard, setCanClipboard] = useState(false);
  const { toast } = useToast();

  // URL du webhook n8n pour l'amélioration de texte - même URL que celle de traduction
  const WEBHOOK_URL =
    'https://n8n-jamal-u38598.vm.elestio.app/webhook/4732aeff-7544-4f0e-8554-ebd0f614947b';

  useEffect(() => {
    setCanClipboard(
      !!navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
    );
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
    console.log(`Envoi de la requête au webhook d'amélioration: ${WEBHOOK_URL}`);
    
    // Adapter le format de la charge utile pour correspondre à celui utilisé dans useTranslation
    const payload = { 
      text: inputText.trim(), 
      type: "improvement"  // Paramètre essentiel pour identifier le type de requête
    };
    
    console.log("Payload envoyé:", payload);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log("Statut de la réponse:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupération de la réponse JSON
      const responseData = await response.json();
      console.log("Réponse complète reçue du webhook:", responseData);
      
      setResult(responseData);
      
      toast({
        title: "Traitement terminé",
        description: "Le texte a été amélioré avec succès",
      });
    } catch (err: any) {
      console.error("Erreur lors de l'amélioration:", err);
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
        variant: "warning",
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

  const isRTL = (txt: string = '') => /[\u0600-\u06FF]/.test(txt);
  const dirFrom = (txt: string) => (isRTL(txt) ? 'rtl' : 'ltr');
  const alignFrom = (txt: string) => (isRTL(txt) ? 'text-right' : 'text-left');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 animate-fade-in">
      <Card className="w-full max-w-3xl mx-auto shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Améliorer Texte & SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Collez ici votre article ou brouillon en arabe ou en français"
            dir={dirFrom(inputText)}
            className={`w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${alignFrom(
              inputText
            )}`}
          />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handlePaste}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-800 shadow-sm transition-colors"
            >
              COLLER
            </button>
            <button
              type="button"
              onClick={handleImprove}
              disabled={loading}
              className={`px-6 py-2 text-white rounded-md shadow-sm ${
                loading 
                  ? 'bg-gray-400' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-colors'
              }`}
            >
              {loading ? "CHARGEMENT..." : "AMÉLIORER & SEO"}
            </button>
          </div>

          {loading && <p className="text-center">Chargement...</p>}

          {result && (
            <div className="grid gap-6">
              {result.main_title !== undefined && (
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">Main Title</h3>
                    <p
                      dir={dirFrom(result.main_title)}
                      className={alignFrom(result.main_title)}
                    >
                      {result.main_title}
                    </p>
                    <button
                      onClick={() => handleCopy(result.main_title)}
                      className="mt-2 text-purple-600 hover:underline"
                    >
                      COPIER
                    </button>
                  </CardContent>
                </Card>
              )}
              {result.body !== undefined && (
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">Body</h3>
                    <p
                      dir={dirFrom(result.body)}
                      className={alignFrom(result.body)}
                    >
                      {result.body}
                    </p>
                    <button
                      onClick={() => handleCopy(result.body)}
                      className="mt-2 text-purple-600 hover:underline"
                    >
                      COPIER
                    </button>
                  </CardContent>
                </Card>
              )}
              {Array.isArray(result.seo_titles) && (
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">SEO Titles</h3>
                    <ul className="space-y-2">
                      {result.seo_titles.map((t: string, i: number) => (
                        <li key={i} className="flex justify-between items-center">
                          <span
                            dir={dirFrom(t)}
                            className={alignFrom(t)}
                          >
                            {t}
                          </span>
                          <button
                            onClick={() => handleCopy(t)}
                            className="text-purple-600 hover:underline ml-2"
                          >
                            COPIER
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {Array.isArray(result.keywords) && (
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.map((k: string, i: number) => (
                        <div key={i} className="flex items-center">
                          <span
                            dir={dirFrom(k)}
                            className={alignFrom(k)}
                          >
                            {k}
                          </span>
                          <button
                            onClick={() => handleCopy(k)}
                            className="text-purple-600 hover:underline ml-1"
                          >
                            COPIER
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              {Array.isArray(result.hashtags) && (
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">Hashtags</h3>
                    <div className="flex flex-col gap-1">
                      {result.hashtags.map((h: string, i: number) => (
                        <p
                          key={i}
                          dir={dirFrom(h)}
                          className={alignFrom(h)}
                        >
                          {h}
                        </p>
                      ))}
                    </div>
                    <button
                      onClick={() => handleCopy(result.hashtags.join('\n'))}
                      className="mt-2 text-purple-600 hover:underline"
                    >
                      COPIER
                    </button>
                  </CardContent>
                </Card>
              )}
              {result.youtube_thumbnail_title !== undefined && (
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2">YouTube Thumbnail Title</h3>
                    <p
                      dir={dirFrom(result.youtube_thumbnail_title)}
                      className={alignFrom(result.youtube_thumbnail_title)}
                    >
                      {result.youtube_thumbnail_title}
                    </p>
                    <button
                      onClick={() => handleCopy(result.youtube_thumbnail_title)}
                      className="mt-2 text-purple-600 hover:underline"
                    >
                      COPIER
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
