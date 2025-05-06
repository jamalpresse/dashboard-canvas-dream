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
  
  // Check for the specific "Traduction" field from the webhook
  if (cleanedData && typeof cleanedData === 'object' && cleanedData.Traduction) {
    return typeof cleanedData.Traduction === 'string' 
      ? cleanedData.Traduction
      : JSON.stringify(cleanedData.Traduction);
  }
  
  // Extract direct translation if it's enhanced content
  if (cleanedData && typeof cleanedData === 'object') {
    // Prioritize direct translation fields
    if (cleanedData.translation) return cleanedData.translation;
    if (cleanedData.translated_text) return cleanedData.translated_text;
    if (cleanedData.text) return cleanedData.text;
    
    // If it's enhanced content, extract the main text
    if (cleanedData.body) return cleanedData.body;
    if (cleanedData.content) return cleanedData.content;
    if (cleanedData.main_content) return cleanedData.main_content;
    
    // For output format that was specified in the user's examples
    if (cleanedData.output) return typeof cleanedData.output === 'string' 
      ? cleanedData.output 
      : JSON.stringify(cleanedData.output);
  }
  
  // Check if we still have useful data after filtering
  const hasUsefulData = cleanedData && 
    Object.keys(cleanedData).length > 0 && 
    !objectContainsTemplateVariables(cleanedData);
  
  if (!hasUsefulData) {
    console.log("No useful data after filtering template variables");
    return "Aucune traduction disponible dans la réponse du webhook.";
  }
  
  // Return the cleaned data as a simple string if possible, otherwise formatted JSON
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
  
  // First check for the specific "Traduction" field from the webhook
  if (data && typeof data === 'object' && data.Traduction) {
    return data.Traduction;
  }
  
  // Filter out template variables
  const cleanedData = filterTemplateVariables(data);
  
  // Check common translation fields
  if (cleanedData && typeof cleanedData === 'object') {
    // If we have a "translation" or "translated_text" field, prioritize that
    if (cleanedData.translation || cleanedData.translated_text || cleanedData.text) {
      return cleanedData.translation || cleanedData.translated_text || cleanedData.text;
    }
    
    // For enhanced content, extract just the textual part
    if (cleanedData.body) {
      return cleanedData.body;
    }
    
    if (cleanedData.content) {
      return cleanedData.content;
    }
    
    if (cleanedData.main_content || cleanedData.main_title) {
      return cleanedData.main_content || cleanedData.main_title;
    }
    
    // Check for output field format from the webhook
    if (cleanedData.output) {
      return cleanedData.output;
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
 * Always return direct-translation as we want to force simple translations
 */
export const detectResultType = (data: any): 'direct-translation' | 'enhanced-content' | 'error' | 'unknown' => {
  if (!data) return 'error';
  
  // Check for error state
  if (data.error || data.erreur) return 'error';
  
  // Force direct translation for all successful responses
  return 'direct-translation';
};
