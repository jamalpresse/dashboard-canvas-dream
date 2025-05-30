
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
  priority: number;
}

// Sources RSS gratuites et accessibles
export const newsSources: NewsSource[] = [
  // Sources mondiales fiables
  {
    id: "lemonde",
    name: "Le Monde",
    url: "https://www.lemonde.fr/rss/une.xml",
    category: "general",
    country: "global",
    priority: 1
  },
  {
    id: "franceinfo",
    name: "Franceinfo",
    url: "https://www.francetvinfo.fr/titres.rss",
    category: "general",
    country: "global",
    priority: 2
  },
  {
    id: "euronews",
    name: "Euronews",
    url: "https://feeds.feedburner.com/euronews/fr/home/",
    category: "general",
    country: "global",
    priority: 3
  },
  {
    id: "rfi",
    name: "RFI",
    url: "https://www.rfi.fr/fr/rss",
    category: "general",
    country: "global",
    priority: 4
  },
  // Sources marocaines alternatives (utilisant des flux génériques pour simulation)
  {
    id: "maroc-news",
    name: "Actualités Maroc",
    url: "https://www.lemonde.fr/afrique/rss_full.xml",
    category: "general",
    country: "ma",
    priority: 1
  },
  {
    id: "maghreb-info",
    name: "Maghreb Info",
    url: "https://feeds.feedburner.com/euronews/fr/home/",
    category: "general",
    country: "ma",
    priority: 2
  }
];

// Cache local pour les actualités
const NEWS_CACHE_KEY = 'news_cache_';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// APIs RSS alternatives
const RSS_APIS = [
  'https://api.rss2json.com/v1/api.json',
  'https://api.allorigins.win/get'
];

// Sauvegarder en cache
function saveToCache(key: string, data: NewsItem[]): void {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(NEWS_CACHE_KEY + key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Erreur lors de la sauvegarde en cache:', error);
  }
}

// Récupérer du cache
function getFromCache(key: string): NewsItem[] | null {
  try {
    const cached = localStorage.getItem(NEWS_CACHE_KEY + key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    // Vérifier si le cache est encore valide
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log(`Cache valide trouvé pour ${key}`);
      return data;
    }
    
    // Supprimer le cache expiré
    localStorage.removeItem(NEWS_CACHE_KEY + key);
    return null;
  } catch (error) {
    console.warn('Erreur lors de la lecture du cache:', error);
    return null;
  }
}

// Fetch avec retry et fallback API
async function fetchWithRetry(url: string, maxRetries: number = 2): Promise<any> {
  let lastError: Error;
  
  // Essayer avec différentes APIs RSS
  for (const apiBase of RSS_APIS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        let apiUrl: string;
        
        if (apiBase.includes('rss2json')) {
          apiUrl = `${apiBase}?rss_url=${encodeURIComponent(url)}`;
        } else {
          // AllOrigins API
          apiUrl = `${apiBase}?url=${encodeURIComponent(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)}`;
        }
        
        console.log(`Tentative ${attempt + 1} avec ${apiBase.includes('rss2json') ? 'RSS2JSON' : 'AllOrigins'}`);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        let data = await response.json();
        
        // Si on utilise AllOrigins, extraire le contenu
        if (apiBase.includes('allorigins')) {
          data = JSON.parse(data.contents);
        }
        
        if (data.status === "ok" && data.items) {
          return data;
        }
        
        throw new Error(data.message || 'Données invalides');
        
      } catch (error) {
        lastError = error as Error;
        console.log(`Échec tentative ${attempt + 1}:`, error);
        
        if (attempt < maxRetries) {
          // Attendre avant de réessayer
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
  }
  
  throw lastError!;
}

// Récupérer les actualités d'une source
export async function fetchNewsFromSource(sourceId: string): Promise<NewsItem[]> {
  const cacheKey = `source_${sourceId}`;
  
  // Vérifier le cache d'abord
  const cachedNews = getFromCache(cacheKey);
  if (cachedNews) {
    return cachedNews;
  }
  
  const source = newsSources.find(s => s.id === sourceId);
  if (!source) {
    console.warn(`Source ${sourceId} non trouvée`);
    return [];
  }
  
  try {
    console.log(`Récupération des actualités de ${source.name}...`);
    const data = await fetchWithRetry(source.url);
    
    const validItems: NewsItem[] = data.items
      .filter((item: any) => item && item.title && item.link)
      .map((item: any) => ({
        ...item,
        source: source.name,
        description: item.description || 'Pas de description disponible',
        content: item.content || item.description || '',
        categories: item.categories || [],
        guid: item.guid || item.link || `${sourceId}-${Date.now()}-${Math.random()}`
      }));
    
    console.log(`✓ ${source.name}: ${validItems.length} articles récupérés`);
    
    // Sauvegarder en cache
    if (validItems.length > 0) {
      saveToCache(cacheKey, validItems);
    }
    
    return validItems;
    
  } catch (error) {
    console.warn(`Erreur lors de la récupération de ${source.name}:`, error);
    
    // Essayer de retourner des données en cache même expirées
    try {
      const expiredCache = localStorage.getItem(NEWS_CACHE_KEY + cacheKey);
      if (expiredCache) {
        const { data } = JSON.parse(expiredCache);
        console.log(`Utilisation du cache expiré pour ${source.name}`);
        return data || [];
      }
    } catch (cacheError) {
      console.warn('Erreur lors de la lecture du cache expiré:', cacheError);
    }
    
    return [];
  }
}

// Récupérer les actualités par pays avec cache
export async function fetchNewsByCountry(country: "ma" | "global"): Promise<NewsItem[]> {
  const cacheKey = `country_${country}`;
  
  // Vérifier le cache d'abord
  const cachedNews = getFromCache(cacheKey);
  if (cachedNews) {
    return cachedNews;
  }
  
  const sourcesForCountry = newsSources
    .filter(source => source.country === country)
    .sort((a, b) => a.priority - b.priority);
  
  const results: NewsItem[] = [];
  const failedSources: string[] = [];
  
  // Récupérer de chaque source
  for (const source of sourcesForCountry) {
    try {
      const sourceNews = await fetchNewsFromSource(source.id);
      if (sourceNews.length > 0) {
        results.push(...sourceNews);
        console.log(`✓ ${source.name}: ${sourceNews.length} articles`);
      } else {
        failedSources.push(source.name);
      }
    } catch (error) {
      failedSources.push(source.name);
      console.log(`✗ ${source.name}: Erreur`);
    }
  }
  
  // Trier par date
  const sortedResults = results.sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });
  
  // Sauvegarder en cache si on a des résultats
  if (sortedResults.length > 0) {
    saveToCache(cacheKey, sortedResults);
  }
  
  // Messages d'information
  if (sortedResults.length === 0) {
    console.error(`Aucune actualité disponible pour ${country}`);
    toast.error('Impossible de charger les actualités. Vérifiez votre connexion internet.');
  } else if (failedSources.length > 0) {
    console.warn(`Sources échouées pour ${country}:`, failedSources);
  } else {
    console.log(`✓ Toutes les sources chargées avec succès pour ${country}`);
  }
  
  return sortedResults;
}

// Fonctions de recherche et filtrage (inchangées)
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

export function filterNewsBySourceId(news: NewsItem[], sourceId: string | null): NewsItem[] {
  if (!sourceId) return news;
  
  const sourceName = newsSources.find(s => s.id === sourceId)?.name;
  if (!sourceName) return news;
  
  return news.filter(item => item.source === sourceName);
}

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

// Fonction pour vider le cache (utile pour le développement)
export function clearNewsCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(NEWS_CACHE_KEY)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cache des actualités vidé');
  } catch (error) {
    console.warn('Erreur lors du vidage du cache:', error);
  }
}
