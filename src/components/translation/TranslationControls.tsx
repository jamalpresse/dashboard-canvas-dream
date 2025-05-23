
import React from 'react';
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

interface TranslationControlsProps {
  loading: boolean;
  handleTranslate: () => void;
  handleClear: () => void;
}

const TranslationControls: React.FC<TranslationControlsProps> = ({
  loading,
  handleTranslate,
  handleClear
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={handleTranslate}
        disabled={loading}
        className={`${
          loading 
            ? 'bg-gray-400' 
            : 'bg-gradient-to-r from-snrt-red to-red-700 hover:from-red-700 hover:to-red-800 transition-colors'
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
  );
};

export default TranslationControls;
