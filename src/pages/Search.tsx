
import React, { useState } from 'react';

// Détecte la présence de caractères arabes pour alignement RTL
const usesArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

export default function Search() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        'https://n8n-jamal-u38598.vm.elestio.app/webhook/8260e0a1-02e7-4b4c-b9ba-bb1e56a1f004',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        }
      );
      const json = await res.json();
      setResult(json.result || '');
    } catch (e) {
      setError('Erreur réseau, veuillez réessayer.');
    }
    setLoading(false);
  };

  const handleCopy = () => navigator.clipboard.writeText(result);
  const handlePaste = async () => {
    try {
      setQuery(await navigator.clipboard.readText());
    } catch (e) {
      setError('Impossible d\'accéder au presse-papiers. Veuillez vérifier les permissions.');
    }
  };
  const handleClear = () => setResult('');

  const isQueryRTL = usesArabic(query);
  const isResultRTL = usesArabic(result);

  // Base64-encoded logo pour éviter les problèmes de chemin
  const logoBase64 = 'iVBORw0KGgoAAAANSUhEUgAACAAAAAgACAYAAACyp9MwAAAgAElEQVR4XuzaMREAAAjDMO5fN' +
                     'D1hD0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
                     'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABA' +
                     'gQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgMAYAHgCAgQIECBAgAABAgQIECBAgAA' +
                     'BAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAAB' +
                     'AgQIECBAgMAYAHgCAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAg' +
                     'AABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgMAYAHgCAgQIECBAgAABAgQIECB' +
                     'AgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBP/';

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6">
      <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Recherche d'information (FR/AR)</h2>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Entrez votre question ici en arabe ou en français"
          dir={isQueryRTL ? 'rtl' : 'ltr'}
          className={`w-full h-24 border border-gray-300 rounded p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-600 ${isQueryRTL ? 'text-right' : 'text-left'}`}
        />
        <div className="flex space-x-3 mt-4">
          <button onClick={handlePaste} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            COLLER
          </button>
          <button onClick={handleSearch} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" disabled={loading}>
            {loading ? 'Chargement...' : 'RECHERCHER'}
          </button>
        </div>
        <div className="mt-6">
          {error && <p className="text-red-500">{error}</p>}
          {!error && (
            <>
              <textarea
                readOnly
                value={loading ? '' : result || 'Aucun résultat trouvé.'}
                dir={isResultRTL ? 'rtl' : 'ltr'}
                className={`w-full h-48 border border-gray-300 rounded p-3 resize-none bg-white focus:outline-none ${isResultRTL ? 'text-right' : 'text-left'}`}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={handleClear} className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400">
                  EFFACER
                </button>
                <button onClick={handleCopy} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                  COPIER
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
