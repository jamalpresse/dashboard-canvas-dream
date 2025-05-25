import { toast } from "@/components/ui/sonner";

export interface NewsItem {
  title: string;
  description: string;
  content: string;
  pubDate: string;
  link: string;
  guid: string;
  author?: string;
  thumbnail?: string;
  enclosure?: {
    link: string;
    type: string;
    length: number;
  };
  categories: string[];
  source: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string | ((lang: "fr" | "ar") => string);
  category: string;
  country: "ma" | "global";
  priority: number; // Added priority for fallback order
}

// Updated sources list with priority and backup sources
export const newsSources: NewsSource[] = [
  {
    id: "snrt",
    name: "SNRT News",
    url: (lang: "fr" | "ar") => lang === "fr" 
      ? "https://snrtnews.com/fr/rss_fr.xml" 
      : "https://snrtnews.com/rss.xml",
    category: "general",
    country: "ma",
    priority: 1
  },
  {
    id: "medias24",
    name: "Médias24",
    url: "https://medias24.com/feed/",
    category: "economy",
    country: "ma",
    priority: 2
  },
  {
    id: "france24",
    name: "France24",
    url: "https://www.france24.com/fr/rss",
    category: "general",
    country: "global",
    priority: 1
  },
  {
    id: "bbc",
    name: "BBC Afrique",
    url: "http://feeds.bbci.co.uk/afrique/rss.xml",
    category: "general",
    country: "global",
    priority: 2
  },
  // Backup sources
  {
    id: "rfi",
    name: "RFI Afrique",
    url: "https://www.rfi.fr/fr/afrique/rss",
    category: "general",
    country: "global",
    priority: 3
  }
];

// Retry mechanism
async function retryFetch(url: string, maxRetries: number = 2): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt + 1} failed for ${url}:`, error);
      
      if (attempt < maxRetries) {
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError!;
}

// Enhanced fetch function with better error handling
export async function fetchNewsFromSource(sourceId: string, lang: "fr" | "ar" = "fr"): Promise<NewsItem[]> {
  try {
    const source = newsSources.find(s => s.id === sourceId);
    if (!source) {
      console.warn(`Source ${sourceId} not found`);
      return [];
    }
    
    // Handle URL function or string
    const rssUrl = typeof source.url === 'function' ? source.url(lang) : source.url;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    console.log(`Fetching news from ${source.name}...`);
    const response = await retryFetch(apiUrl);
    const data = await response.json();
    
    if (data.status !== "ok") {
      console.warn(`RSS feed error for ${source.name}:`, data.message);
      return [];
    }
    
    if (!data.items || !Array.isArray(data.items)) {
      console.warn(`Invalid data structure from ${source.name}`);
      return [];
    }
    
    // Add source to each item and filter out invalid items
    const validItems = data.items
      .filter((item: any) => item && item.title && item.link)
      .map((item: any) => ({
        ...item,
        source: source.name,
        description: item.description || 'Pas de description disponible',
        content: item.content || item.description || '',
        categories: item.categories || []
      }));
    
    console.log(`Successfully fetched ${validItems.length} items from ${source.name}`);
    return validItems;
    
  } catch (error) {
    console.warn(`Failed to fetch news from ${sourceId}:`, error);
    return []; // Return empty array instead of throwing
  }
}

// Enhanced function to fetch news by country with fallback
export async function fetchNewsByCountry(country: "ma" | "global", lang: "fr" | "ar" = "fr"): Promise<NewsItem[]> {
  const sourcesForCountry = newsSources
    .filter(source => source.country === country)
    .sort((a, b) => a.priority - b.priority); // Sort by priority
  
  const results: NewsItem[] = [];
  const failedSources: string[] = [];
  
  // Try to fetch from each source
  for (const source of sourcesForCountry) {
    try {
      const sourceNews = await fetchNewsFromSource(source.id, lang);
      if (sourceNews.length > 0) {
        results.push(...sourceNews);
        console.log(`✓ ${source.name}: ${sourceNews.length} articles`);
      } else {
        failedSources.push(source.name);
        console.log(`⚠ ${source.name}: No articles`);
      }
    } catch (error) {
      failedSources.push(source.name);
      console.log(`✗ ${source.name}: Error`);
    }
  }
  
  // Sort results by date (newest first)
  const sortedResults = results.sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });
  
  // Show appropriate message based on results
  if (sortedResults.length === 0) {
    console.error(`No news could be loaded for ${country}. Failed sources:`, failedSources);
    toast.error(`Impossible de charger les actualités. Veuillez réessayer plus tard.`);
  } else if (failedSources.length > 0) {
    console.warn(`Some sources failed for ${country}:`, failedSources);
    // Don't show error toast if we have some results
  } else {
    console.log(`✓ All sources loaded successfully for ${country}`);
  }
  
  return sortedResults;
}

// Search function remains the same
export function searchNews(news: NewsItem[], query: string): NewsItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return news;
  
  return news.filter(item => {
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery) ||
      item.content.toLowerCase().includes(normalizedQuery)
    );
  });
}

// Filter function remains the same
export function filterNewsBySourceId(news: NewsItem[], sourceId: string | null): NewsItem[] {
  if (!sourceId) return news;
  
  const sourceName = newsSources.find(s => s.id === sourceId)?.name;
  if (!sourceName) return news;
  
  return news.filter(item => item.source === sourceName);
}

// Date formatting function remains the same
export function formatNewsDate(dateString: string, locale: string = 'fr-FR'): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}
