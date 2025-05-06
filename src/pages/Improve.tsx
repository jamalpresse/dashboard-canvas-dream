
import React, { useState, useEffect } from 'react';

export default function Improve() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [canClipboard, setCanClipboard] = useState(false);

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
      alert('⚠️ Votre navigateur ne supporte pas le collage automatique.');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Lecture presse-papier échouée:', err);
      alert('⚠️ Impossible de lire le presse-papier.');
    }
  };

  const handleImprove = async () => {
    if (!inputText.trim()) {
      alert('⚠️ Le champ texte est vide.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
        const unquoted = text.replace(/^"|"$/g, '');
        data = JSON.parse(unquoted);
      }
      setResult(data);
    } catch (err: any) {
      console.error('Échec du webhook:', err);
      alert(`⚠️ Échec du webhook: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string) => {
    if (!canClipboard) {
      alert('⚠️ Copie non disponible. Sélectionnez et copiez manuellement.');
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      alert('📋 Copié !');
    } catch (err) {
      console.error('Échec copie presse-papier:', err);
      alert('⚠️ Impossible de copier.');
    }
  };

  const isRTL = (txt: string = '') => /[\u0600-\u06FF]/.test(txt);
  const dirFrom = (txt: string) => (isRTL(txt) ? 'rtl' : 'ltr');
  const alignFrom = (txt: string) => (isRTL(txt) ? 'text-right' : 'text-left');

  return (
    <div className="w-full max-w-3xl mx-auto bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Améliorer Texte & SEO</h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Collez ici votre article ou brouillon en arabe ou en français"
          dir={dirFrom(inputText)}
          className={`w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 ${alignFrom(
            inputText
          )}`}
        />
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={handlePaste}
            className="px-6 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700"
          >
            COLLER
          </button>
          <button
            type="button"
            onClick={handleImprove}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700"
          >
            {loading ? "CHARGEMENT..." : "AMÉLIORER & SEO"}
          </button>
        </div>

        {loading && <p className="mt-4 text-center">Chargement...</p>}

        {result && (
          <div className="grid gap-6 mt-6">
            {result.main_title !== undefined && (
              <div className="p-4 bg-white shadow-sm rounded-2xl border">
                <h3 className="font-bold">Main Title</h3>
                <p
                  dir={dirFrom(result.main_title)}
                  className={alignFrom(result.main_title)}
                >
                  {result.main_title}
                </p>
                <button
                  onClick={() => handleCopy(result.main_title)}
                  className="mt-2 text-red-600 hover:underline"
                >
                  COPIER
                </button>
              </div>
            )}
            {result.body !== undefined && (
              <div className="p-4 bg-white shadow-sm rounded-2xl border">
                <h3 className="font-bold">Body</h3>
                <p
                  dir={dirFrom(result.body)}
                  className={alignFrom(result.body)}
                >
                  {result.body}
                </p>
                <button
                  onClick={() => handleCopy(result.body)}
                  className="mt-2 text-red-600 hover:underline"
                >
                  COPIER
                </button>
              </div>
            )}
            {Array.isArray(result.seo_titles) && (
              <div className="p-4 bg-white shadow-sm rounded-2xl border">
                <h3 className="font-bold">SEO Titles</h3>
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
                        className="text-red-600 hover:underline"
                      >
                        COPIER
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(result.keywords) && (
              <div className="p-4 bg-white shadow-sm rounded-2xl border">
                <h3 className="font-bold">Keywords</h3>
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
                        className="text-red-600 hover:underline ml-1"
                      >
                        COPIER
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(result.hashtags) && (
              <div className="p-4 bg-white shadow-sm rounded-2xl border">
                <h3 className="font-bold">Hashtags</h3>
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
                  className="mt-2 text-red-600 hover:underline"
                >
                  COPIER
                </button>
              </div>
            )}
            {result.youtube_thumbnail_title !== undefined && (
              <div className="p-4 bg-white shadow-sm rounded-2xl border">
                <h3 className="font-bold">YouTube Thumbnail Title</h3>
                <p
                  dir={dirFrom(result.youtube_thumbnail_title)}
                  className={alignFrom(result.youtube_thumbnail_title)}
                >
                  {result.youtube_thumbnail_title}
                </p>
                <button
                  onClick={() => handleCopy(result.youtube_thumbnail_title)}
                  className="mt-2 text-red-600 hover:underline"
                >
                  COPIER
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
