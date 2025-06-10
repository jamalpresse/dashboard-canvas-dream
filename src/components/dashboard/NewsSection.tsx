
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsGrid } from "@/components/news/NewsGrid";
import { useLanguage } from "@/context/LanguageContext";

interface NewsSectionProps {
  activeTab: 'maroc' | 'monde';
  setActiveTab: (tab: 'maroc' | 'monde') => void;
  newsLoading: boolean;
  newsError: string | null;
  gridNews: any[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  activeTab,
  setActiveTab,
  newsLoading,
  newsError,
  gridNews
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold font-playfair text-white">
          {t('dashboard', 'latestNews')}
        </h2>
        <Link 
          to="/news" 
          className={`px-6 py-2 bg-snrt-red text-white rounded-full flex items-center gap-1 text-sm font-medium hover:bg-red-700 transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {t('categories', 'viewMore')} 
          <ArrowRight className={`h-4 w-4 animate-pulse ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>
      
      {/* News Tabs - Enlarged */}
      <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'maroc' | 'monde')} className="mb-3">
        <TabsList className="w-fit bg-card shadow-sm border border-gray-800 p-2 rounded-full">
          <TabsTrigger value="maroc" className="text-base rounded-full data-[state=active]:bg-snrt-red data-[state=active]:text-white px-6 py-2">
            <span className="mr-1 text-lg">🇲🇦</span> {t('categories', 'maroc')}
          </TabsTrigger>
          <TabsTrigger value="monde" className="text-base rounded-full data-[state=active]:bg-snrt-red data-[state=active]:text-white px-6 py-2">
            <Globe className="h-4 w-4 mr-2" /> {t('categories', 'monde')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* News Grid */}
      {newsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-card rounded-lg shadow-sm p-4 h-[180px] animate-pulse">
              <div className="h-5 bg-gray-700 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded mb-4 w-1/2"></div>
              <div className="h-16 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : newsError ? (
        <div className="bg-red-900/30 border border-red-900 rounded-lg p-4 text-center">
          <div className="flex justify-center items-center mb-2">
            <AlertCircle className="h-5 w-5 text-snrt-red mr-2" />
            <p className="text-red-400 font-medium">{t('common', 'loadingError')}</p>
          </div>
          <p className="text-red-300">{newsError}</p>
        </div>
      ) : !gridNews || gridNews.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">{t('common', 'noResults')}</p>
        </div>
      ) : (
        <NewsGrid news={gridNews} />
      )}
    </div>
  );
};
