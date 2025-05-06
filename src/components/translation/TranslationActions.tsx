
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clipboard, Languages } from "lucide-react";

interface TranslationActionsProps {
  text: string;
  loading: boolean;
  handlePaste: () => void;
  handleTranslate: () => void;
  handleClear: () => void;
}

const TranslationActions: React.FC<TranslationActionsProps> = ({
  text,
  loading,
  handlePaste,
  handleTranslate,
  handleClear
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 mb-6">
      <Button
        onClick={handlePaste}
        className="bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-sm"
      >
        <Clipboard className="mr-1 h-4 w-4" />
        COLLER
      </Button>
      
      <Button
        onClick={handleTranslate}
        disabled={loading || !text.trim()}
        className={`${
          loading || !text.trim()
            ? 'bg-gray-400 opacity-70 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'
        } text-white rounded-md transition-colors shadow-sm`}
      >
        <Languages className="mr-1 h-4 w-4" />
        {loading ? 'TRADUCTION...' : 'TRADUIRE'}
      </Button>
      
      <Button
        onClick={handleClear}
        variant="outline"
        disabled={!text.trim()}
        className={`bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors shadow-sm ${!text.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        EFFACER
      </Button>
    </div>
  );
};

export default TranslationActions;
