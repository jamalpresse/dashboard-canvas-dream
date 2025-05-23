
export const isRTL = (txt: string = '') => /[\u0600-\u06FF]/.test(txt);
export const dirFrom = (txt: string) => (isRTL(txt) ? 'rtl' : 'ltr');
export const alignFrom = (txt: string) => (isRTL(txt) ? 'text-right' : 'text-left');

export const checkClipboardSupport = () => {
  return !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
};

// Helper function for joining keywords with Arabic commas
export const joinKeywordsWithArabicCommas = (keywords: string[]) => {
  return keywords.join('، '); // Join with Arabic comma
};

export const formatResponseData = (data: any) => {
  // Handle different response formats
  if (!data) return { body: "Aucune réponse reçue" };
  
  // Si la réponse contient déjà le champ Traduction, l'extraire
  if (data.Traduction) {
    console.log("Format avec champ Traduction détecté");
    
    // Si Traduction est une chaîne qui semble être du JSON
    if (typeof data.Traduction === 'string' && 
        (data.Traduction.trim().startsWith('{') || data.Traduction.trim().startsWith('['))) {
      try {
        return JSON.parse(data.Traduction);
      } catch (e) {
        console.error("Erreur lors du parsing du champ Traduction:", e);
        return { body: data.Traduction };
      }
    }
    
    // Si Traduction est déjà un objet
    if (typeof data.Traduction === 'object' && data.Traduction !== null) {
      return data.Traduction;
    }
    
    // Sinon, utiliser Traduction comme corps
    return { body: data.Traduction };
  }
  
  // Si c'est une chaîne qui semble être du JSON
  if (typeof data === 'string') {
    try {
      const parsedData = JSON.parse(data);
      
      // Handle the case where keywords might be a string and need to be converted to array
      if (parsedData.keywords && typeof parsedData.keywords === 'string') {
        const keywordSeparator = parsedData.keywords.includes(',') ? ',' : ' ';
        parsedData.keywords = parsedData.keywords.split(keywordSeparator)
          .map((k: string) => k.trim())
          .filter((k: string) => k.length > 0);
      }
      
      return parsedData;
    } catch (e) {
      console.error("Erreur lors du parsing de la réponse:", e);
      return { body: data };
    }
  }
  
  // Check if data has keywords as string that need to be converted to array
  if (data && typeof data === 'object' && data.keywords && typeof data.keywords === 'string') {
    const keywordSeparator = data.keywords.includes(',') ? ',' : ' ';
    data.keywords = data.keywords.split(keywordSeparator)
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);
    console.log("Processed keywords:", data.keywords);
  }
  
  // Si c'est déjà un objet avec la structure attendue (SEO titles, etc.)
  if (typeof data === 'object' && data !== null) {
    // Vérifier si c'est déjà au format attendu
    const hasExpectedFields = 
      data.main_title !== undefined ||
      data.body !== undefined ||
      Array.isArray(data.seo_titles) ||
      data.keywords !== undefined ||
      Array.isArray(data.hashtags);
      
    if (hasExpectedFields) {
      return data;
    }
    
    // Si c'est un objet avec un champ texte unique, l'extraire
    const textProperties = ['text', 'content', 'message', 'output', 'result', 'translated_text'];
    for (const prop of textProperties) {
      if (data[prop] && typeof data[prop] === 'string') {
        return { body: data[prop] };
      }
    }
  }
  
  // Fallback: retourner l'objet tel quel
  return data;
};
