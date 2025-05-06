
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
  
  // Handle body text
  if (data.body) {
    formattedParts.push(data.body);
  } else if (data.texte) {
    formattedParts.push(data.texte);
  } else if (data.translation) {
    formattedParts.push(data.translation);
  } else if (data.Traduction) {
    formattedParts.push(data.Traduction);
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
    !['main_title', 'body', 'seo_titles', 'hashtags', 'titre', 'texte', 'titresSEO', 'Traduction', 'translation'].includes(key) && 
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
  
  // If no parts were found, provide fallback message
  if (formattedParts.length === 0) {
    return JSON.stringify(data, null, 2);
  }
  
  return formattedParts.join('\n');
};

/**
 * Extract the most appropriate translation result from API response
 */
export const extractTranslationFromResponse = (data: any): any => {
  console.log("Extracting translation from response data:", data);
  
  // If data is a string, return it directly
  if (typeof data === 'string') {
    return data;
  }
  
  // If data is not an object, convert to string
  if (typeof data !== 'object' || data === null) {
    return String(data);
  }

  // Check for common translation fields in order of priority
  if (data.result && typeof data.result === 'object') {
    // n8n webhook might wrap results in a 'result' field
    return extractTranslationFromResponse(data.result);
  } else if (data.data && typeof data.data === 'object') {
    // Some APIs wrap data in a 'data' field
    return extractTranslationFromResponse(data.data);
  } else if (data.main_title || data.body || data.titre || data.texte) {
    // Return complete structured data for formatting
    return data;
  } else if (data.Traduction && typeof data.Traduction === 'string') {
    return data.Traduction;
  } else if (data.translation && typeof data.translation === 'string') {
    return data.translation;
  } else if (data.result && typeof data.result === 'string') {
    return data.result;
  } else if (data.texte_traduit && typeof data.texte_traduit === 'string') {
    return data.texte_traduit;
  }
  
  // If no recognized fields, return the whole object for formatting
  return data;
};
