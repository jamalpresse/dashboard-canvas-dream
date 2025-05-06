
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
 */
export const formatTranslationResult = (data: any): string => {
  console.log("Formatting translation data:", data);
  
  // Filter out template variables
  const cleanedData = filterTemplateVariables(data);
  console.log("Cleaned data after filtering template variables:", cleanedData);
  
  // Check if we still have useful data after filtering
  const hasUsefulData = cleanedData && 
    Object.keys(cleanedData).length > 0 && 
    !objectContainsTemplateVariables(cleanedData);
  
  if (!hasUsefulData) {
    console.log("No useful data after filtering template variables");
    return "Aucune traduction disponible dans la réponse du webhook.";
  }
  
  // Return the cleaned data as formatted JSON
  return JSON.stringify(cleanedData, null, 2);
};

/**
 * Extract the most appropriate translation result from API response
 */
export const extractTranslationFromResponse = (data: any): any => {
  console.log("Extracting translation from response:", data);
  
  // First pass: Look for direct translation fields
  if (data && typeof data === 'object') {
    // Filter out template variables
    const cleanedData = filterTemplateVariables(data);
    
    // If we have a "translation" or "translated_text" field, prioritize that
    if (cleanedData.translation || cleanedData.translated_text || cleanedData.text) {
      return cleanedData.translation || cleanedData.translated_text || cleanedData.text;
    }
    
    // If we have cleaned data without template variables, return that
    if (Object.keys(cleanedData).length > 0) {
      return cleanedData;
    }
  }
  
  // If no useful content could be extracted, return a simplified message
  if (objectContainsTemplateVariables(data)) {
    return { error: "Variables non résolues dans la réponse du webhook" };
  }
  
  // Return the original data as fallback
  return data;
};

/**
 * Detects the type of translation result based on the data structure
 */
export const detectResultType = (data: any): 'direct-translation' | 'enhanced-content' | 'error' | 'unknown' => {
  if (!data) return 'error';
  
  // Check for error state
  if (data.error || data.erreur) return 'error';
  
  // Check if it's a simple translation string
  if (typeof data === 'string') return 'direct-translation';
  
  // Check if it's an enhanced content object with structure (main_title, body, etc.)
  if (data.main_title || data.body || data.content || data.seo_titles || data.hashtags) {
    return 'enhanced-content';
  }
  
  // Check for direct translation fields
  if (data.translation || data.translated_text || data.text) {
    return 'direct-translation';
  }
  
  return 'unknown';
};
