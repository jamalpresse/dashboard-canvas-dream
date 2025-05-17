
import React from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';

interface ResultHeaderProps {
  onCopy: () => void;
  result: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ onCopy, result }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-2 text-sm text-gray-500 flex justify-end">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-snrt-red hover:text-red-700 hover:bg-red-50"
        onClick={onCopy}
        disabled={!result || result.includes('Aucune traduction disponible') || result.includes('لا توجد ترجمة متاحة')}
      >
        <ClipboardCopy className="h-4 w-4 mr-1" /> 
        {t('translation', 'copy')}
      </Button>
    </div>
  );
};

export default ResultHeader;
