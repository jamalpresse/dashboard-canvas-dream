
import React from 'react';
import { Button } from "@/components/ui/button";

interface LanguagePair {
  label: string;
  value: string;
}

interface LanguageSelectorProps {
  selectedLangPair: string;
  onLangPairChange: (value: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  selectedLangPair,
  onLangPairChange 
}) => {
  const langs: LanguagePair[] = [
    { label: 'AR → FR', value: 'ar-fr' },
    { label: 'FR → AR', value: 'fr-ar' },
    { label: 'ANG → AR', value: 'en-ar' },
    { label: 'ANG → FR', value: 'en-fr' },
    { label: 'ES → AR', value: 'es-ar' },
    { label: 'ES → FR', value: 'es-fr' },
  ];

  return (
    <section>
      <div className="mb-2">
        <span className="text-sm font-medium">Sélectionner la paire de langues:</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {langs.map(({ label, value }) => (
          <Button
            key={value}
            onClick={() => onLangPairChange(value)}
            className={`py-2 rounded-md border shadow-sm transition-all duration-200 ${
              selectedLangPair === value
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white ring-2 ring-purple-600'
                : 'bg-white text-black border-gray-300 hover:bg-purple-50'
            }`}
            variant={selectedLangPair === value ? "default" : "outline"}
          >
            {label}
          </Button>
        ))}
      </div>
    </section>
  );
};

export default LanguageSelector;
