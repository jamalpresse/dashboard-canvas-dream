
import React from 'react';
import { Link } from 'react-router-dom';

const ImproveNavigationButtons: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
      <Link 
        to="/translation" 
        className="flex-1 px-6 py-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center"
      >
        <span className="text-xl font-medium">Traduction multilingue</span>
      </Link>
      
      <Link 
        to="/search" 
        className="flex-1 px-6 py-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center"
      >
        <span className="text-xl font-medium">Recherche (AR / FR)</span>
      </Link>
    </div>
  );
};

export default ImproveNavigationButtons;
