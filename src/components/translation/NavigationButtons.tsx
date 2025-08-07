
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const NavigationButtons: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`flex flex-col sm:flex-row gap-4 w-full mt-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Link 
        to="/improve" 
        className="flex-1 px-6 py-6 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center"
      >
        <span className="text-xl font-medium">{t('improve', 'title')}</span>
      </Link>
      
      <Link 
        to="/search" 
        className="flex-1 px-6 py-6 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center"
      >
        <span className="text-xl font-medium">{t('search', 'title')}</span>
      </Link>
    </div>
  );
};

export default NavigationButtons;
