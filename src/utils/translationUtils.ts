
/**
 * Utility functions for handling translation data
 */

/**
 * Checks if a string contains unresolved template variables
 */
const containsTemplateVariables = (text: string): boolean => {
  return typeof text === 'string' && text.includes('{{') && text.includes('}}');
};

/**
 * Checks if an object has unresolved template variables in any of its values
 */
const objectContainsTemplateVariables = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  
  // Check each value in the object
  return Object.values(obj).some(value => {
    if (typeof value === 'string') {
      return containsTemplateVariables(value);
    } else if (Array.isArray(value)) {
      return value.some(item => typeof item === 'string' && containsTemplateVariables(item));
    } else if (typeof value === 'object' && value !== null) {
      return objectContainsTemplateVariables(value);
    }
    return false;
  });
};

/**
 * Filters out template variables from an object
 */
const filterTemplateVariables = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj
      .filter(item => !(typeof item === 'string' && containsTemplateVariables(item)))
      .map(item => {
        if (typeof item === 'object' && item !== null) {
          return filterTemplateVariables(item);
        }
        return item;
      });
  }
  
  // Handle objects
  const result: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    // Skip entries with template variables as values
    if (typeof value === 'string' && containsTemplateVariables(value)) {
      return;
    }
    
    if (typeof value === 'object' && value !== null) {
      result[key] = filterTemplateVariables(value);
    } else {
      result[key] = value;
    }
  });
  
  return result;
};

/**
 * Formats translation data into a readable structure
 * Prioritizes the "Traduction" field from the webhook response
 */
export const formatTranslationResult = (data: any): string => {
  console.log("Formatting translation data:", data);
  
  if (!data) {
    return "Aucune traduction disponible.";
  }
  
  // Filter out template variables
  const cleanedData = filterTemplateVariables(data);
  console.log("Cleaned data after filtering template variables:", cleanedData);
  
  // Priorité 1: Champ "Traduction" spécifique au webhook de traduction
  if (cleanedData && typeof cleanedData === 'object' && cleanedData.Traduction !== undefined) {
    console.log("Found 'Traduction' field:", cleanedData.Traduction);
    if (typeof cleanedData.Traduction === 'string') {
      return cleanedData.Traduction;
    }
    return JSON.stringify(cleanedData.Traduction);
  }
  
  // Priorité 2: Champs communs de traduction
  if (cleanedData && typeof cleanedData === 'object') {
    if (cleanedData.translation) return cleanedData.translation;
    if (cleanedData.translated_text) return cleanedData.translated_text;
    if (cleanedData.text) return cleanedData.text;
    if (cleanedData.output && typeof cleanedData.output === 'string') return cleanedData.output;
  }
  
  // Priorité 3: Champs de contenu (pour le contenu amélioré)
  if (cleanedData && typeof cleanedData === 'object') {
    if (cleanedData.body) return cleanedData.body;
    if (cleanedData.content) return cleanedData.content;
    if (cleanedData.main_content) return cleanedData.main_content;
  }
  
  // Vérifier si nous avons encore des données utiles après le filtrage
  const hasUsefulData = cleanedData && 
    Object.keys(cleanedData).length > 0 && 
    !objectContainsTemplateVariables(cleanedData);
  
  if (!hasUsefulData) {
    console.log("No useful data after filtering template variables");
    return "Aucune traduction disponible dans la réponse.";
  }
  
  // Retourner les données nettoyées en tant que chaîne simple si possible, sinon JSON formaté
  if (typeof cleanedData === 'string') {
    return cleanedData;
  } else {
    return JSON.stringify(cleanedData, null, 2);
  }
};

/**
 * Extract the most appropriate translation result from API response
 */
export const extractTranslationFromResponse = (data: any): any => {
  console.log("Extracting translation from response:", data);
  
  if (!data) {
    return { error: "Pas de données reçues" };
  }
  
  // Priorité absolue: champ "Traduction" spécifique du webhook
  if (data && typeof data === 'object' && data.Traduction !== undefined) {
    console.log("Found 'Traduction' field directly:", data.Traduction);
    return data.Traduction;
  }
  
  // Filter out template variables
  const cleanedData = filterTemplateVariables(data);
  
  // Check standard translation fields
  if (cleanedData && typeof cleanedData === 'object') {
    if (cleanedData.translation) return cleanedData.translation;
    if (cleanedData.translated_text) return cleanedData.translated_text;
    if (cleanedData.text) return cleanedData.text;
    if (cleanedData.output) return cleanedData.output;
    if (cleanedData.body) return cleanedData.body;
    if (cleanedData.content) return cleanedData.content;
    if (cleanedData.main_content) return cleanedData.main_content;
    
    // If we have cleaned data without template variables, return that
    if (Object.keys(cleanedData).length > 0) {
      return cleanedData;
    }
  }
  
  // If no useful content could be extracted, return a simplified message
  return { error: "Impossible d'extraire une traduction des données reçues" };
};

/**
 * Detects the type of translation result based on the data structure
 * Always return direct-translation as we want to force simple translations
 */
export const detectResultType = (data: any): 'direct-translation' | 'enhanced-content' | 'error' | 'unknown' => {
  if (!data) return 'error';
  
  // Check for error state
  if (data.error || data.erreur) return 'error';
  
  // Force direct translation for all successful responses
  return 'direct-translation';
};
