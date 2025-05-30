
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const NavigationButtons: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`flex flex-col sm:flex-row gap-4 w-full mt-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Link 
        to="/improve" 
        className="flex-1 px-6 py-6 bg-snrt-red text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center"
      >
        <span className="text-xl font-medium">{t('improve', 'title')}</span>
      </Link>
      
      <Link 
        to="/search" 
        className="flex-1 px-6 py-6 bg-black text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center hover:bg-snrt-red/90"
      >
        <span className="text-xl font-medium">{t('search', 'title')}</span>
      </Link>
    </div>
  );
};

export default NavigationButtons;
