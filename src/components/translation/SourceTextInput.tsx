
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clipboard, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SourceTextInputProps {
  text: string;
  setText: (text: string) => void;
  isRTL: boolean;
  handlePaste: () => void;
  handleTranslate: () => void;
  handleClear: () => void;
  loading: boolean;
}

const SourceTextInput: React.FC<SourceTextInputProps> = ({
  text,
  setText,
  isRTL,
  handlePaste,
  handleTranslate,
  handleClear,
  loading
}) => {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">Texte source:</span>
        <span className="text-sm text-gray-500">
          {isRTL ? 'RTL' : 'LTR'}
        </span>
      </div>
      <Textarea
        placeholder="Collez ici votre texte à traduire"
        value={text}
        onChange={e => setText(e.target.value)}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
          isRTL ? 'text-right' : 'text-left'
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
  );
};

export default SourceTextInput;
