
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
  url: string;
  category: string;
  country: "ma" | "global";
}

// Liste des sources d'actualités
export const newsSources: NewsSource[] = [
  {
    id: "snrt",
    name: "SNRT News",
    url: "https://snrtnews.com/rss.xml",
    category: "general",
    country: "ma"
  },
  {
    id: "hespress",
    name: "Hespress",
    url: "https://fr.hespress.com/feed/",
    category: "general",
    country: "ma"
  },
  {
    id: "le360",
    name: "Le360",
    url: "https://fr.le360.ma/rss",
    category: "general",
    country: "ma"
  },
  {
    id: "medias24",
    name: "Médias24",
    url: "https://medias24.com/feed/",
    category: "economy",
    country: "ma"
  },
  {
    id: "france24",
    name: "France24",
    url: "https://www.france24.com/fr/rss",
    category: "general",
    country: "global"
  },
  {
    id: "bbc",
    name: "BBC Afrique",
    url: "http://feeds.bbci.co.uk/afrique/rss.xml",
    category: "general",
    country: "global"
  }
];

// Récupérer les actualités d'une source
export async function fetchNewsFromSource(sourceId: string): Promise<NewsItem[]> {
  try {
    const source = newsSources.find(s => s.id === sourceId);
    if (!source) throw new Error(`Source ${sourceId} not found`);
    
    const rssUrl = source.url;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error fetching ${source.name}: ${response.statusText}`);
    
    const data = await response.json();
    
    if (data.status !== "ok") {
      throw new Error(`Error with RSS feed for ${source.name}: ${data.message || 'Unknown error'}`);
    }
    
    // Ajouter la source à chaque élément
    return data.items.map((item: any) => ({
      ...item,
      source: source.name
    }));
  } catch (error) {
    console.error(`Error fetching news from ${sourceId}:`, error);
    toast.error(`Impossible de charger les actualités de cette source`);
    return [];
  }
}

// Récupérer les actualités par pays
export async function fetchNewsByCountry(country: "ma" | "global"): Promise<NewsItem[]> {
  const sourcesForCountry = newsSources.filter(source => source.country === country);
  const allPromises = sourcesForCountry.map(source => fetchNewsFromSource(source.id));
  
  try {
    const results = await Promise.all(allPromises);
    // Fusionner et trier par date
    const allNews = results.flat().sort((a, b) => {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });
    return allNews;
  } catch (error) {
    console.error(`Error fetching news for ${country}:`, error);
    toast.error(`Erreur lors du chargement des actualités`);
    return [];
  }
}

// Recherche par mot-clé
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

// Filtrer par catégorie
export function filterNewsBySourceId(news: NewsItem[], sourceId: string | null): NewsItem[] {
  if (!sourceId) return news;
  
  const sourceName = newsSources.find(s => s.id === sourceId)?.name;
  if (!sourceName) return news;
  
  return news.filter(item => item.source === sourceName);
}

// Formater la date
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
