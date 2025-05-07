
import React from 'react';
import { Search, Wand } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavigationButtons: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
      <Link 
        to="/improve" 
        className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
      >
        <Wand size={20} />
        <span className="text-base font-medium">Améliorer Texte & SEO</span>
      </Link>
      
      <Link 
        to="/search" 
        className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
      >
        <Search size={20} />
        <span className="text-base font-medium">Recherche (AR / FR)</span>
      </Link>
    </div>
  );
};

export default NavigationButtons;
