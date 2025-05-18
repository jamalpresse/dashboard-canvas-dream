
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { isRTL, alignFrom, dirFrom } from '@/utils/textUtils';
import { Loader2, Check } from 'lucide-react';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  handlePaste: () => Promise<void>;
  handleImprove: () => Promise<void>;
  loading: boolean;
  requestSent?: boolean;
}

export function InputSection({ 
  inputText, 
  setInputText, 
  handlePaste, 
  handleImprove, 
  loading,
  requestSent = false
}: InputSectionProps) {
  return (
    <div className="space-y-6">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Collez ici votre article ou brouillon en arabe ou en français"
        dir={dirFrom(inputText)}
        className={`w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-snrt-red text-black ${alignFrom(
          inputText
        )}`}
      />
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handlePaste}
          className="px-6 py-2 bg-snrt-red text-white rounded-md hover:bg-red-700 shadow-sm transition-colors"
        >
          COLLER
        </button>
        <button
          type="button"
          onClick={handleImprove}
          disabled={loading}
          className={`px-6 py-2 text-white rounded-md shadow-sm flex items-center justify-center ${
            loading 
              ? 'bg-gray-400' 
              : 'bg-gradient-to-r from-snrt-red to-red-700 hover:from-red-700 hover:to-red-800 transition-colors'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              CHARGEMENT...
            </>
          ) : (
            "AMÉLIORER & SEO"
          )}
        </button>
      </div>

      {loading && (
        <div className="text-center">
          <p className="text-snrt-red">Traitement en cours... Cela peut prendre jusqu'à une minute.</p>
          {requestSent && (
            <p className="text-green-600 flex items-center justify-center mt-2">
              <Check className="h-4 w-4 mr-2" />
              Requête envoyée avec succès, en attente de réponse...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
