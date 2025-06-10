
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
  language: "fr" | "ar";
  priority: number;
}

// Fonction pour extraire une image du contenu HTML
function extractImageFromContent(htmlContent: string): string | null {
  if (!htmlContent) return null;
  
  // 1. Chercher des balises img dans le HTML
  const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgTagRegex.exec(htmlContent)) !== null) {
    const imgSrc = match[1];
    // Vérifier que l'image a une extension valide et n'est pas un pixel de tracking
    if (imgSrc && 
        /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(imgSrc) && 
        !imgSrc.includes('1x1') && 
        !imgSrc.includes('pixel') &&
        imgSrc.length > 20) {
      console.log("Image extraite de la balise img:", imgSrc);
      return imgSrc.startsWith('http') ? imgSrc : `https://snrtnews.com${imgSrc}`;
    }
  }
  
  // 2. Chercher des URLs d'images directes dans le texte
  const imageUrlRegex = /(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|svg))(?:\?[^\s"'<>]*)?/gi;
  match = htmlContent.match(imageUrlRegex);
  
  if (match && match[0]) {
    const imgUrl = match[0];
    if (!imgUrl.includes('1x1') && !imgUrl.includes('pixel') && imgUrl.length > 20) {
      console.log("Image extraite de l'URL:", imgUrl);
      return imgUrl;
    }
  }
  
  // 3. Pour SNRT News spécifiquement, chercher des patterns spécifiques
  if (htmlContent.includes('snrtnews.com')) {
    const snrtImageRegex = /(?:src=["']?|url\(["']?)([^"'\s)]+snrtnews\.com[^"'\s)]*\.(?:jpg|jpeg|png|gif|webp))["']?/gi;
    match = snrtImageRegex.exec(htmlContent);
    if (match && match[1]) {
      console.log("Image SNRT extraite:", match[1]);
      return match[1];
    }
  }
  
  return null;
}

// Fonction pour détecter la langue d'un texte
function detectLanguage(text: string): "fr" | "ar" | "unknown" {
  if (!text) return "unknown";
  
  // Expressions régulières pour détecter l'arabe
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  // Mots-clés français courants
  const frenchKeywords = ['le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'ou', 'pour', 'avec', 'dans', 'sur', 'par', 'que', 'qui', 'sont', 'ont', 'est', 'être', 'avoir'];
  
  // Mots-clés arabes courants
  const arabicKeywords = ['في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'التي', 'الذي', 'وقال', 'قال', 'أن', 'كان', 'كانت', 'يمكن', 'يجب'];
  
  const lowerText = text.toLowerCase();
  
  // Compter les caractères arabes
  const arabicMatches = text.match(arabicRegex);
  const arabicCharCount = arabicMatches ? arabicMatches.length : 0;
  
  // Compter les mots-clés français
  const frenchKeywordCount = frenchKeywords.filter(keyword => 
    lowerText.includes(' ' + keyword + ' ') || 
    lowerText.startsWith(keyword + ' ') || 
    lowerText.endsWith(' ' + keyword)
  ).length;
  
  // Compter les mots-clés arabes
  const arabicKeywordCount = arabicKeywords.filter(keyword => 
    text.includes(keyword)
  ).length;
  
  // Logique de détection
  if (arabicCharCount > 5 || arabicKeywordCount > 0) {
    return "ar";
  } else if (frenchKeywordCount > 0) {
    return "fr";
  }
  
  // Si le texte contient plus de caractères latins, considérer comme français
  const latinCharCount = text.replace(/[^a-zA-ZÀ-ÿ]/g, '').length;
  if (latinCharCount > arabicCharCount) {
    return "fr";
  }
  
  return "unknown";
}

// Fonction pour filtrer les articles par langue
function filterArticlesByLanguage(articles: NewsItem[], targetLanguage: "fr" | "ar"): NewsItem[] {
  return articles.filter(article => {
    // Détecter la langue du titre et de la description
    const titleLanguage = detectLanguage(article.title);
    const descriptionLanguage = detectLanguage(article.description);
    
    // L'article est gardé si au moins le titre ou la description correspond à la langue cible
    const matchesLanguage = titleLanguage === targetLanguage || descriptionLanguage === targetLanguage;
    
    // Garder aussi les articles de langue "unknown" pour éviter de perdre du contenu
    const isUnknown = titleLanguage === "unknown" && descriptionLanguage === "unknown";
    
    console.log(`Article: "${article.title.substring(0, 50)}..." - Titre: ${titleLanguage}, Description: ${descriptionLanguage}, Gardé: ${matchesLanguage || isUnknown}`);
    
    return matchesLanguage || isUnknown;
  });
}

// Sources RSS multilingues - françaises et arabes
export const newsSources: NewsSource[] = [
  // Sources françaises mondiales
  {
    id: "lemonde",
    name: "Le Monde",
    url: "https://www.lemonde.fr/rss/une.xml",
    category: "general",
    country: "global",
    language: "fr",
    priority: 1
  },
  {
    id: "franceinfo",
    name: "Franceinfo",
    url: "https://www.francetvinfo.fr/titres.rss",
    category: "general",
    country: "global",
    language: "fr",
    priority: 2
  },
  {
    id: "euronews",
    name: "Euronews",
    url: "https://feeds.feedburner.com/euronews/fr/home/",
    category: "general",
    country: "global",
    language: "fr",
    priority: 3
  },
  {
    id: "rfi",
    name: "RFI",
    url: "https://www.rfi.fr/fr/rss",
    category: "general",
    country: "global",
    language: "fr",
    priority: 4
  },
  
  // Sources arabes mondiales
  {
    id: "aljazeera",
    name: "الجزيرة نت",
    url: "https://www.aljazeera.net/rss/all.xml",
    category: "general",
    country: "global",
    language: "ar",
    priority: 1
  },
  {
    id: "bbc-arabic",
    name: "BBC العربية",
    url: "https://feeds.bbci.co.uk/arabic/rss.xml",
    category: "general",
    country: "global",
    language: "ar",
    priority: 2
  },
  {
    id: "skynews-arabic",
    name: "سكاي نيوز عربية",
    url: "https://www.skynewsarabia.com/rss.xml",
    category: "general",
    country: "global",
    language: "ar",
    priority: 3
  },
  {
    id: "alarabiya",
    name: "العربية نت",
    url: "https://www.alarabiya.net/ar.rss",
    category: "general",
    country: "global",
    language: "ar",
    priority: 4
  },
  {
    id: "rt-arabic",
    name: "RT Arabic",
    url: "https://arabic.rt.com/rss/",
    category: "general",
    country: "global",
    language: "ar",
    priority: 5
  },
  
  // Sources marocaines françaises
  {
    id: "maroc-news-fr",
    name: "Actualités Maroc",
    url: "https://www.lemonde.fr/afrique/rss_full.xml",
    category: "general",
    country: "ma",
    language: "fr",
    priority: 1
  },
  {
    id: "maghreb-info-fr",
    name: "Maghreb Info",
    url: "https://feeds.feedburner.com/euronews/fr/home/",
    category: "general",
    country: "ma",
    language: "fr",
    priority: 2
  },
  {
    id: "snrtnews-fr",
    name: "SNRT News FR",
    url: "https://snrtnews.com/fr/rss_fr.xml",
    category: "general",
    country: "ma",
    language: "fr",
    priority: 1
  },
  
  // Sources marocaines arabes
  {
    id: "snrtnews-ar",
    name: "أخبار SNRT",
    url: "https://snrtnews.com/rss.xml",
    category: "general",
    country: "ma",
    language: "ar",
    priority: 1
  },
  {
    id: "maroc-news-ar",
    name: "أخبار المغرب",
    url: "https://www.aljazeera.net/rss/all.xml",
    category: "general",
    country: "ma",
    language: "ar",
    priority: 2
  },
  {
    id: "maghreb-info-ar",
    name: "معلومات المغرب العربي",
    url: "https://feeds.bbci.co.uk/arabic/rss.xml",
    category: "general",
    country: "ma",
    language: "ar",
    priority: 3
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

// Fonction pour filtrer les sources par langue et pays
export function getSourcesByLanguageAndCountry(language: "fr" | "ar", country: "ma" | "global"): NewsSource[] {
  return newsSources.filter(source => 
    source.language === language && source.country === country
  ).sort((a, b) => a.priority - b.priority);
}

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
export async function fetchNewsFromSource(sourceId: string, targetLanguage?: "fr" | "ar"): Promise<NewsItem[]> {
  const cacheKey = `source_${sourceId}_${targetLanguage || 'all'}`;
  
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
    
    let validItems: NewsItem[] = data.items
      .filter((item: any) => item && item.title && item.link)
      .map((item: any) => {
        // Extraire l'image du contenu si aucune thumbnail n'est fournie
        let thumbnail = item.thumbnail || item.enclosure?.link;
        
        // Pour SNRT News, essayer d'extraire l'image du contenu HTML
        if (!thumbnail && sourceId.includes('snrt') && item.content) {
          thumbnail = extractImageFromContent(item.content);
        }
        
        // Si toujours pas d'image, essayer avec la description
        if (!thumbnail && item.description) {
          thumbnail = extractImageFromContent(item.description);
        }
        
        console.log(`Article "${item.title?.substring(0, 30)}..." - Image trouvée: ${thumbnail || 'Aucune'}`);
        
        return {
          ...item,
          source: source.name,
          description: item.description || 'Pas de description disponible',
          content: item.content || item.description || '',
          categories: item.categories || [],
          guid: item.guid || item.link || `${sourceId}-${Date.now()}-${Math.random()}`,
          thumbnail
        };
      });
    
    // Filtrer par langue si spécifiée
    if (targetLanguage) {
      const originalCount = validItems.length;
      validItems = filterArticlesByLanguage(validItems, targetLanguage);
      console.log(`✓ ${source.name}: ${originalCount} articles récupérés, ${validItems.length} après filtrage langue ${targetLanguage}`);
    } else {
      console.log(`✓ ${source.name}: ${validItems.length} articles récupérés (sans filtrage langue)`);
    }
    
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

// Récupérer les actualités par langue et pays
export async function fetchNewsByLanguageAndCountry(language: "fr" | "ar", country: "ma" | "global"): Promise<NewsItem[]> {
  const cacheKey = `${language}_${country}`;
  
  // Vérifier le cache d'abord
  const cachedNews = getFromCache(cacheKey);
  if (cachedNews) {
    return cachedNews;
  }
  
  const sourcesForLanguage = getSourcesByLanguageAndCountry(language, country);
  
  const results: NewsItem[] = [];
  const failedSources: string[] = [];
  
  // Récupérer de chaque source avec filtrage par langue
  for (const source of sourcesForLanguage) {
    try {
      const sourceNews = await fetchNewsFromSource(source.id, language);
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
    console.error(`Aucune actualité disponible pour ${language}/${country}`);
    toast.error('Impossible de charger les actualités. Vérifiez votre connexion internet.');
  } else if (failedSources.length > 0) {
    console.warn(`Sources échouées pour ${language}/${country}:`, failedSources);
  } else {
    console.log(`✓ Toutes les sources chargées avec succès pour ${language}/${country}`);
  }
  
  return sortedResults;
}

// Fonction de compatibilité - garder pour l'ancien code
export async function fetchNewsByCountry(country: "ma" | "global"): Promise<NewsItem[]> {
  // Par défaut, utiliser le français pour la compatibilité
  return fetchNewsByLanguageAndCountry("fr", country);
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
