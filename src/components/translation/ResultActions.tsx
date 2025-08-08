
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
interface ResultActionsProps {
  result: string;
  handleCopy: () => void;
  handleClear: () => void;
  onDebugToggle: () => void;
}

const ResultActions: React.FC<ResultActionsProps> = ({
  result,
  handleCopy,
  handleClear,
  onDebugToggle
}) => {
  const { t } = useLanguage();
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <Button 
        onClick={handleCopy} 
        disabled={!result} 
        className={`bg-gradient-to-r from-snrt-red to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors shadow-sm ${!result ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Clipboard className="mr-1 h-4 w-4" />
        {t('translation', 'copy')}
      </Button>
      
      <Button 
        onClick={handleClear} 
        variant="outline" 
        className="bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors shadow-sm"
      >
        {t('translation', 'clear')}
      </Button>
      
      <Button 
        onClick={onDebugToggle}
        variant="outline"
        className="bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors ml-auto"
        size="sm"
      >
        {t('common', 'debug')}
      </Button>
    </div>
  );
};

export default ResultActions;
