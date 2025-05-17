
import React from 'react';
import { Link } from 'react-router-dom';

const NavigationButtons: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
      <Link 
        to="/improve" 
        className="flex-1 px-6 py-6 bg-gradient-to-r from-snrt-red to-red-700 text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center"
      >
        <span className="text-xl font-medium">Améliorer Texte & SEO</span>
      </Link>
      
      <Link 
        to="/search" 
        className="flex-1 px-6 py-6 bg-black text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center hover:bg-snrt-red/90"
      >
        <span className="text-xl font-medium">Recherche (AR / FR)</span>
      </Link>
    </div>
  );
};

export default NavigationButtons;
