
/**
 * Utility functions for handling translation data
 */

/**
 * Formats translation data into a readable structure
 */
export const formatTranslationResult = (data: any): string => {
  console.log("Formatting translation data:", data);
  
  // Check if the response has a Traduction field
  if (data && data.Traduction) {
    console.log("Traduction field found:", data.Traduction);
    
    // If Traduction is a string that looks like JSON, try to parse it
    if (typeof data.Traduction === 'string') {
      try {
        const parsed = JSON.parse(data.Traduction);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        // If parsing fails, return the raw string
        return data.Traduction;
      }
    }
    
    // If Traduction is already an object, stringify it
    return JSON.stringify(data.Traduction, null, 2);
  }
  
  // For direct JSON response, return stringified version
  return JSON.stringify(data, null, 2);
};

/**
 * Extract the most appropriate translation result from API response
 */
export const extractTranslationFromResponse = (data: any): any => {
  console.log("Extracting translation from response:", data);
  
  // Check for Traduction field first
  if (data && data.Traduction) {
    return data.Traduction;
  }
  
  // Return data directly if no Traduction field
  return data;
};
