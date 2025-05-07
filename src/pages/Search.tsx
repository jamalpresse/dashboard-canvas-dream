
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 animate-fade-in">
      <Card className="w-full max-w-4xl mx-auto shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Recherche d'information (FR/AR)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Entrez votre question ici en arabe ou en français"
            dir={isQueryRTL ? 'rtl' : 'ltr'}
            className={`w-full h-24 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 ${isQueryRTL ? 'text-right' : 'text-left'}`}
          />
          <div className="flex space-x-3">
            <button onClick={handlePaste} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md hover:from-purple-700 hover:to-purple-800 shadow-sm transition-colors">
              COLLER
            </button>
            <button onClick={handleSearch} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:from-purple-700 hover:to-pink-600 shadow-sm transition-colors" disabled={loading}>
              {loading ? 'Chargement...' : 'RECHERCHER'}
            </button>
          </div>
          <div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {!error && (
              <>
                <textarea
                  readOnly
                  value={loading ? '' : result || 'Aucun résultat trouvé.'}
                  dir={isResultRTL ? 'rtl' : 'ltr'}
                  className={`w-full h-48 border border-gray-300 rounded-lg p-3 resize-none bg-white/80 backdrop-blur-sm shadow-inner focus:outline-none ${isResultRTL ? 'text-right' : 'text-left'}`}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button onClick={handleClear} className="px-3 py-1 bg-gray-200 text-black rounded-md hover:bg-gray-300 shadow-sm transition-colors">
                    EFFACER
                  </button>
                  <button onClick={handleCopy} className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 shadow-sm transition-colors">
                    COPIER
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
            <Link 
              to="/improve" 
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <Wrench size={20} />
              <span className="text-base font-medium">Améliorer texte & SEO</span>
            </Link>
            
            <Link 
              to="/translation" 
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <Globe size={20} />
              <span className="text-base font-medium">Traduction multilingue</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
