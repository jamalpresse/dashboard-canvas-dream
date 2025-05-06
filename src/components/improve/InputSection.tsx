
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { isRTL, alignFrom, dirFrom } from '@/utils/textUtils';
import { Loader2 } from 'lucide-react';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  handlePaste: () => Promise<void>;
  handleImprove: () => Promise<void>;
  loading: boolean;
}

export function InputSection({ 
  inputText, 
  setInputText, 
  handlePaste, 
  handleImprove, 
  loading 
}: InputSectionProps) {
  return (
    <div className="space-y-6">
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
          className={`px-6 py-2 text-white rounded-md shadow-sm flex items-center justify-center ${
            loading 
              ? 'bg-gray-400' 
              : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-colors'
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
          <p className="text-purple-700">Traitement en cours... Cela peut prendre jusqu'à une minute.</p>
        </div>
      )}
    </div>
  );
}
