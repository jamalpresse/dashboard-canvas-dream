
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className
}) => {
  const { lang, setLang, isRTL } = useLanguage();

  return (
    <div className={`flex items-center ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 px-2 ${lang === 'fr' ? 'bg-snrt-red/10 text-snrt-red' : ''}`}
        onClick={() => setLang('fr')}
      >
        <span className="font-medium">FR</span>
      </Button>
      <span className="mx-1 text-gray-400">|</span>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-1 px-2 ${lang === 'ar' ? 'bg-snrt-red/10 text-snrt-red' : ''}`}
        onClick={() => setLang('ar')}
        dir="rtl"
      >
        <span className="font-medium">العربية</span>
      </Button>
      <Globe className="h-4 w-4 text-gray-400 ml-1" />
    </div>
  );
};

export default LanguageSelector;
