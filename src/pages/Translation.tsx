
import React, { useState } from 'react';

export default function Translation() {
  const [text, setText] = useState('');
  const [langPair, setLangPair] = useState('fr-ar');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch {
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
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, langPair }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const raw = data.Traduction;
      const translation = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2);
      setResult(translation);
    } catch (err) {
      setError(err.message || 'Erreur lors de la traduction.');
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
    if (result) await navigator.clipboard.writeText(result);
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
        <div className="mt-2 flex space-x-2">
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

      <section className="mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {langs.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setLangPair(value)}
              className={`py-2 rounded border ${
                langPair === value
                  ? 'bg-red-600 text-white ring-2 ring-red-600'
                  : 'bg-white text-black border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div
          dir={isTargetRTL ? 'rtl' : 'ltr'}
          className={`w-full min-h-[8rem] p-4 border rounded bg-gray-50 ${
            isTargetRTL ? 'text-right' : 'text-left'
          }`}
        >
          {result || <span className="text-gray-400">Le résultat apparaîtra ici</span>}
        </div>
        <div className="mt-2 flex space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
    </div>
  );
}
