
/**
 * Utility functions for handling translation data
 */

/**
 * Formats translation data into a readable structure
 */
export const formatTranslationResult = (data: any): string => {
  // If data is a simple string, return it directly
  if (typeof data === 'string') {
    return data;
  }
  
  // For structured data, organize and format it
  const formattedParts: string[] = [];
  
  // Handle main title/heading
  if (data.main_title) {
    formattedParts.push(`# ${data.main_title}\n`);
  } else if (data.titre) {
    formattedParts.push(`# ${data.titre}\n`);
  }
  
  // Handle body text - check for additional possible field names
  if (data.body) {
    formattedParts.push(data.body);
  } else if (data.texte) {
    formattedParts.push(data.texte);
  } else if (data.translation) {
    formattedParts.push(data.translation);
  } else if (data.Traduction) {
    formattedParts.push(data.Traduction);
  } else if (data.translatedText) {
    formattedParts.push(data.translatedText);
  } else if (data.translated_text) {
    formattedParts.push(data.translated_text);
  } else if (data.target_text) {
    formattedParts.push(data.target_text);
  } else if (data.result && typeof data.result === 'string') {
    formattedParts.push(data.result);
  } else if (data.text) {
    formattedParts.push(data.text);
  }
  
  // Handle SEO titles
  if (data.seo_titles && Array.isArray(data.seo_titles) && data.seo_titles.length > 0) {
    formattedParts.push(`\n## Titres SEO:\n${data.seo_titles.map((title: string) => `• ${title}`).join('\n')}`);
  } else if (data.titresSEO && Array.isArray(data.titresSEO) && data.titresSEO.length > 0) {
    formattedParts.push(`\n## Titres SEO:\n${data.titresSEO.map((title: string) => `• ${title}`).join('\n')}`);
  }
  
  // Handle hashtags
  if (data.hashtags && Array.isArray(data.hashtags) && data.hashtags.length > 0) {
    formattedParts.push(`\n## Hashtags:\n${data.hashtags.join(' ')}`);
  }
  
  // Handle other relevant fields that might be in the data
  const otherFields = Object.entries(data).filter(([key]) => 
    !['main_title', 'body', 'seo_titles', 'hashtags', 'titre', 'texte', 'titresSEO', 'Traduction', 'translation',
      'translatedText', 'translated_text', 'target_text', 'result', 'text'].includes(key) && 
    typeof data[key] !== 'undefined' && 
    data[key] !== null
  );
  
  if (otherFields.length > 0) {
    formattedParts.push('\n## Autres informations:');
    otherFields.forEach(([key, value]) => {
      if (typeof value === 'object') {
        formattedParts.push(`\n### ${key}:`);
        formattedParts.push(JSON.stringify(value, null, 2));
      } else {
        formattedParts.push(`\n### ${key}: ${value}`);
      }
    });
  }
  
  // If no parts were found, provide the original data as JSON
  if (formattedParts.length === 0) {
    console.log("Aucun format reconnu dans la réponse, données brutes:", data);
    return JSON.stringify(data, null, 2);
  }
  
  return formattedParts.join('\n');
};

/**
 * Extract the most appropriate translation result from API response
 */
export const extractTranslationFromResponse = (data: any): any => {
  console.log("Données brutes de la réponse:", data);
  
  // If data is a string, return it directly
  if (typeof data === 'string') {
    return data;
  }
  
  // If data is not an object, convert to string
  if (typeof data !== 'object' || data === null) {
    return String(data);
  }

  // Check for n8n specific response formats 
  if (data.data && typeof data.data === 'object') {
    console.log("Données dans le champ 'data':", data.data);
    return extractTranslationFromResponse(data.data);
  } 
  
  if (data.result && typeof data.result === 'object') {
    console.log("Données dans le champ 'result':", data.result);
    return extractTranslationFromResponse(data.result);
  }
  
  // Check common OpenAI format
  if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
    console.log("Format OpenAI détecté:", data.choices[0]);
    if (data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    } else if (data.choices[0].text) {
      return data.choices[0].text;
    }
  }
  
  // Check for common API formats
  if (data.translated_text || data.translatedText || data.translation || data.Traduction) {
    console.log("Format API de traduction standard détecté");
    return data;
  }
  
  // Check for Google Translate-like format
  if (data.translations && Array.isArray(data.translations) && data.translations.length > 0) {
    console.log("Format similaire à Google Translate détecté:", data.translations[0]);
    if (data.translations[0].translatedText) {
      return data.translations[0].translatedText;
    }
    return data.translations[0];
  }
  
  // Check for main_title or titre or body or texte
  if (data.main_title || data.body || data.titre || data.texte) {
    console.log("Structure avec titre/corps détectée");
    return data;
  }
  
  // If there's a string result field, use that
  if (data.result && typeof data.result === 'string') {
    console.log("Résultat sous forme de chaîne détecté");
    return data.result;
  }
  
  // For very simple responses with just text
  if (data.text && typeof data.text === 'string') {
    console.log("Champ texte simple détecté");
    return data.text;
  }
  
  // Log if we don't recognize the format
  console.log("Format non reconnu, retour des données brutes");
  return data;
};
