
import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Search, FileText, Languages, ImageIcon } from "lucide-react";

export const FeatureButtons: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="mx-4 md:mx-8">
      {/* Features Buttons - Cartes modulaires éclatantes */}
      <div className={`cards-grid mb-6 ${isRTL ? 'rtl' : ''}`}>
        <Link 
          to="/search" 
          className="group relative overflow-hidden bg-gradient-primary hover:scale-105 text-white font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 flex flex-col items-center justify-center space-y-2 min-h-[120px]"
        >
          <Search className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{t('dashboard', 'search')}</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link 
          to="/improve" 
          className="group relative overflow-hidden bg-gradient-secondary hover:scale-105 text-white font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 flex flex-col items-center justify-center space-y-2 min-h-[120px]"
        >
          <FileText className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{t('dashboard', 'improve')}</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link 
          to="/translation" 
          className="group relative overflow-hidden bg-gradient-accent hover:scale-105 text-black font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-accent transition-all duration-300 flex flex-col items-center justify-center space-y-2 min-h-[120px]"
        >
          <Languages className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg">{t('dashboard', 'translate')}</span>
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
      
      {/* Image Generation Button - Widget modulaire */}
      <Link 
        to="/image-generation" 
        className="group relative overflow-hidden flex w-full bg-gradient-data hover:scale-[1.02] text-white font-semibold py-6 px-6 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 justify-center items-center space-x-3 mb-6"
      >
        <ImageIcon className="h-8 w-8 group-hover:scale-110 transition-transform" />
        <span className="text-lg">{t('dashboard', 'imageGeneration')}</span>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </div>
  );
};
