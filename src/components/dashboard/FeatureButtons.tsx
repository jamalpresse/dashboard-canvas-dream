
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export const FeatureButtons: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      {/* Features Buttons - Enlarged and full width */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <Link 
          to="/search" 
          className="bg-snrt-red hover:bg-red-700 text-white font-semibold text-xl py-8 px-4 rounded-lg shadow-lg text-center transition duration-300 flex items-center justify-center"
        >
          <span>{t('dashboard', 'search')}</span>
        </Link>

        <Link 
          to="/improve" 
          className="bg-snrt-red hover:bg-red-700 text-white font-semibold text-xl py-8 px-4 rounded-lg shadow-lg text-center transition duration-300 flex items-center justify-center"
        >
          {t('dashboard', 'improve')}
        </Link>

        <Link 
          to="/translation" 
          className="bg-snrt-red hover:bg-red-700 text-white font-semibold text-xl py-8 px-4 rounded-lg shadow-lg text-center transition duration-300 flex items-center justify-center"
        >
          {t('dashboard', 'translate')}
        </Link>
      </div>
      
      {/* Image Generation Button - Enlarged */}
      <Link 
        to="/image-generation" 
        className="flex w-full bg-snrt-red hover:bg-red-700 text-white font-semibold text-xl py-8 px-4 rounded-lg shadow-lg text-center transition duration-300 justify-center items-center mb-3"
      >
        <span>{t('dashboard', 'imageGeneration')}</span>
      </Link>
    </>
  );
};
