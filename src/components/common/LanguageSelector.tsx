
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: string;
  onLanguageChange: (lang: "fr" | "ar") => void;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onLanguageChange,
  className
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 px-2 ${currentLang === 'fr' ? 'bg-snrt-red/10 text-snrt-red' : ''}`}
        onClick={() => onLanguageChange('fr')}
      >
        <span className="font-medium">FR</span>
      </Button>
      <span className="mx-1 text-gray-400">|</span>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 px-2 ${currentLang === 'ar' ? 'bg-snrt-red/10 text-snrt-red' : ''}`}
        onClick={() => onLanguageChange('ar')}
        dir="rtl"
      >
        <span className="font-medium">العربية</span>
      </Button>
      <Globe className="h-4 w-4 text-gray-400 ml-1" />
    </div>
  );
};

export default LanguageSelector;
