
import React from "react";
import { Link } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { useIndexStats } from "@/hooks/useIndexStats";
import { IndexHeader } from "@/components/dashboard/IndexHeader";
import { FeatureButtons } from "@/components/dashboard/FeatureButtons";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { NewsSection } from "@/components/dashboard/NewsSection";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  // Use custom hooks for data fetching
  const { isLoading, error, statsData } = useIndexStats();
  const {
    news,
    loading: newsLoading,
    error: newsError,
    activeTab,
    setActiveTab,
    featuredArticle,
    featuredLoading
  } = useNews();
  const { t } = useLanguage();

  // Get news items for grid only with validation
  const gridNews = news && Array.isArray(news) ? news.slice(0, 6) : [];

  // Transform statsData to include JSX icons
  const transformedStatsData = statsData.map(stat => ({
    ...stat,
    icon: <stat.icon className="h-5 w-5 text-white" />
  }));

  // Render loading skeletons while data is fetching
  if (isLoading) {
    return <LoadingState />;
  }

  // Render error state if there's an error
  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="animate-fade-in">
        <IndexHeader />
        
        {/* Main Content Layout */}
        <div className="w-full mt-3">
          <FeatureButtons />

          <HeroSection 
            featuredLoading={featuredLoading}
            featuredArticle={featuredArticle}
          />

          <NewsSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            newsLoading={newsLoading}
            newsError={newsError}
            gridNews={gridNews}
          />
        </div>
      </div>

        <section aria-labelledby="briefing-section" className="mt-6">
          <h2 id="briefing-section" className="text-xl font-semibold">
            <Link to="/briefing" className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {t('briefing', 'title')}
            </Link>
          </h2>
        </section>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }

          @keyframes pulse {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(3px); }
          }
          
          .animate-pulse {
            animation: pulse 1.5s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Index;
