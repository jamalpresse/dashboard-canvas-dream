import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Textarea } from "@/components/ui/textarea";

// Détecte la présence de caractères arabes pour alignement RTL
const usesArabic = (text: string) => /[\u0600-\u06FF]/.test(text);
export default function Search() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const {
    t,
    isRTL,
    dir
  } = useLanguage();
  
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://n8n-jamal-u38598.vm.elestio.app/webhook/8260e0a1-02e7-4b4c-b9ba-bb1e56a1f004', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query
        })
      });
      const json = await res.json();
      setResult(json.result || '');
    } catch (e) {
      setError(t('search', 'error'));
    }
    setLoading(false);
  };
  
  const handleCopy = () => navigator.clipboard.writeText(result);
  const handlePaste = async () => {
    try {
      setQuery(await navigator.clipboard.readText());
    } catch (e) {
      setError(t('search', 'permissionError'));
    }
  };
  const handleClear = () => setResult('');
  const isQueryRTL = usesArabic(query) || isRTL;
  const isResultRTL = usesArabic(result) || isRTL;
  
  return <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 p-6 animate-fade-in" dir={dir}>
      <Card className="w-full max-w-4xl mx-auto shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-50">{t('search', 'title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <textarea 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder={t('search', 'placeholder')} 
            dir={isQueryRTL ? 'rtl' : 'ltr'} 
            className={`w-full h-24 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-snrt-red text-black ${isQueryRTL ? 'text-right' : 'text-left'}`} 
          />
          
          <div className={`flex space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <button onClick={handlePaste} className="px-4 py-2 bg-snrt-red text-white rounded-md hover:bg-red-700 shadow-sm transition-colors">
              {t('search', 'paste')}
            </button>
            <button onClick={handleSearch} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 shadow-sm transition-colors" disabled={loading}>
              {loading ? t('search', 'loading') : t('search', 'search')}
            </button>
          </div>
          
          <div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {!error && <>
                <textarea 
                  readOnly 
                  value={loading ? '' : result || t('search', 'noResult')} 
                  dir={isResultRTL ? 'rtl' : 'ltr'} 
                  className={`w-full h-48 border border-gray-300 rounded-lg p-3 resize-none bg-white/80 backdrop-blur-sm shadow-inner focus:outline-none text-gray-900 ${isResultRTL ? 'text-right' : 'text-left'}`} 
                />
                <div className={`flex justify-end space-x-2 mt-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <button onClick={handleClear} className="px-3 py-1 bg-gray-200 text-black rounded-md hover:bg-gray-300 shadow-sm transition-colors">
                    {t('search', 'clear')}
                  </button>
                  <button onClick={handleCopy} className="px-3 py-1 bg-snrt-red text-white rounded-md hover:bg-red-700 shadow-sm transition-colors">
                    {t('search', 'copy')}
                  </button>
                </div>
              </>}
          </div>
          
          {/* Navigation Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 w-full mt-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link to="/improve" className="flex-1 px-6 py-4 bg-snrt-red text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
              <Wrench size={20} />
              <span className="text-base font-medium">{t('improve', 'title')}</span>
            </Link>
            
            <Link to="/translation" className="flex-1 px-6 py-4 bg-black text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3 hover:bg-snrt-red/90">
              <Globe size={20} />
              <span className="text-base font-medium">{t('translation', 'title')}</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>;
}
