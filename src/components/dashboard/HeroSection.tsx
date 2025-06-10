
import React from "react";
import { HeroNews } from "@/components/news/HeroNews";
import { formatNewsDate } from "@/services/newsService";
import { useLanguage } from "@/context/LanguageContext";

interface NewsItem {
  title?: string;
  content?: string;
  description?: string;
  pubDate?: string;
  link?: string;
  enclosure?: { link?: string };
  thumbnail?: string;
}

interface HeroSectionProps {
  featuredLoading: boolean;
  featuredArticle: NewsItem | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredLoading,
  featuredArticle
}) => {
  const { t } = useLanguage();

  if (featuredLoading) {
    return (
      <div className="bg-card rounded-lg shadow-sm h-[300px] md:h-[400px] animate-pulse flex items-center justify-center mb-3">
        <p className="text-gray-400">{t('common', 'loading')}</p>
      </div>
    );
  }

  if (featuredArticle) {
    return (
      <HeroNews 
        title={featuredArticle.title || "Actualité SNRT"} 
        imageUrl={featuredArticle.enclosure?.link || featuredArticle.thumbnail || ""} 
        content={featuredArticle.content || featuredArticle.description || ""}
        category="SNRT News" 
        timestamp={formatNewsDate(featuredArticle.pubDate)} 
        link={featuredArticle.link} 
      />
    );
  }

  return (
    <HeroNews 
      title="Actualité SNRT" 
      imageUrl="/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png" 
      category="SNRT News" 
    />
  );
};
