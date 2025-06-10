
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NewsCard } from '@/components/news/NewsCard';
import { Search, Filter, ChevronDown, Globe, List } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { formatNewsDate } from '@/services/newsService';
import { useLanguage } from '@/context/LanguageContext';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export default function News() {
  const {
    news,
    loading,
    error,
    activeTab,
    setActiveTab,
    activeSource,
    setActiveSource,
    searchQuery,
    handleSearch,
    availableSources
  } = useNews();
  
  const { t, lang, isRTL } = useLanguage();
  const [showSourcesDropdown, setShowSourcesDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Pagination
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const currentNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Réinitialiser la pagination lorsque le filtre change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activeSource, searchQuery]);

  // Libellés selon la langue
  const labels = {
    title: t('navigation', 'news'),
    maroc: t('categories', 'maroc'),
    monde: t('categories', 'monde'),
    search: lang === 'ar' ? 'البحث في الأخبار...' : 'Rechercher des actualités...',
    sources: t('common', 'sources'),
    allSources: t('common', 'allSources'),
    loading: t('common', 'loading'),
    tryAgain: t('common', 'tryAgain'),
    noResults: t('common', 'noResults'),
    searchNoResults: t('common', 'searchNoResults')
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {labels.title}
        </h1>
        
        {/* Tabs principale Maroc/Monde */}
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value as 'maroc' | 'monde');
            setActiveSource(null);
          }}
          className="mb-6"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="maroc" className="text-lg">
              <span className={isRTL ? "ml-2" : "mr-2"}>🇲🇦</span> {labels.maroc}
            </TabsTrigger>
            <TabsTrigger value="monde" className="text-lg">
              <Globe className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} /> {labels.monde}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Barre de recherche et filtres */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4`} />
            <Input
              type="text"
              placeholder={labels.search}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`${isRTL ? 'pr-10' : 'pl-10'} py-6`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          {/* Menu déroulant des sources */}
          <div className="relative">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-full"
              onClick={() => setShowSourcesDropdown(!showSourcesDropdown)}
            >
              <Filter className="h-4 w-4" />
              {labels.sources}
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {showSourcesDropdown && (
              <div className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-1 bg-white rounded-md shadow-lg z-10 min-w-[200px]`}>
                <div className="p-2">
                  <Button
                    variant={activeSource === null ? "default" : "ghost"}
                    className="w-full justify-start mb-1"
                    onClick={() => {
                      setActiveSource(null);
                      setShowSourcesDropdown(false);
                    }}
                  >
                    <List className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {labels.allSources}
                  </Button>
                  
                  {availableSources.map(source => (
                    <Button
                      key={source.id}
                      variant={activeSource === source.id ? "default" : "ghost"}
                      className="w-full justify-start mb-1"
                      onClick={() => {
                        setActiveSource(source.id);
                        setShowSourcesDropdown(false);
                      }}
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {source.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Contenu des actualités */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-4 h-[380px] animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              {labels.tryAgain}
            </Button>
          </div>
        ) : currentNews.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {searchQuery ? labels.searchNoResults : labels.noResults}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentNews.map((item) => (
                <NewsCard
                  key={item.guid}
                  title={item.title}
                  description={item.description}
                  imageUrl={item.thumbnail || item.enclosure?.link}
                  source={item.source}
                  date={formatNewsDate(item.pubDate, lang === 'ar' ? 'ar-SA' : 'fr-FR')}
                  link={item.link}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    // Afficher seulement quelques pages pour éviter trop de boutons
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <PaginationItem key={page}>...</PaginationItem>;
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
