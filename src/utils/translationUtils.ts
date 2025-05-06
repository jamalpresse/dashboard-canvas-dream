
/**
 * Utility functions for handling translation data
 */

/**
 * Formats translation data into a readable structure
 */
export const formatTranslationResult = (data: any): string => {
  console.log("Formatting translation data:", data);
  
  // Check if the response has a Traduction field
  if (data && data.Traduction !== undefined) {
    console.log("Traduction field found:", data.Traduction);
    
    // If Traduction is a string that contains unresolved template variables
    if (typeof data.Traduction === 'string' && data.Traduction.includes('{{') && data.Traduction.includes('}}')) {
      console.log("Traduction contains template variables:", data.Traduction);
      return data.Traduction; // Return as is - will be displayed as raw text
    }
    
    // If Traduction is a string that looks like JSON, try to parse it
    if (typeof data.Traduction === 'string') {
      try {
        const parsed = JSON.parse(data.Traduction);
        console.log("Successfully parsed JSON from Traduction string:", parsed);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        console.log("Failed to parse Traduction as JSON, using as raw string");
        // If parsing fails, return the raw string
        return data.Traduction;
      }
    }
    
    // If Traduction is already an object, stringify it
    if (typeof data.Traduction === 'object' && data.Traduction !== null) {
      console.log("Traduction is already an object:", data.Traduction);
      return JSON.stringify(data.Traduction, null, 2);
    }
    
    // For other types (like null, undefined, numbers)
    return String(data.Traduction);
  }
  
  // For direct JSON response, return stringified version
  console.log("No Traduction field found, using entire response");
  return JSON.stringify(data, null, 2);
};

/**
 * Extract the most appropriate translation result from API response
 */
export const extractTranslationFromResponse = (data: any): any => {
  console.log("Extracting translation from response:", data);
  
  // Check for Traduction field first
  if (data && data.Traduction !== undefined) {
    console.log("Found Traduction field:", data.Traduction);
    
    // If Traduction is a string that might be JSON, try to parse it
    if (typeof data.Traduction === 'string') {
      try {
        const parsedJson = JSON.parse(data.Traduction);
        console.log("Successfully parsed Traduction JSON:", parsedJson);
        return parsedJson;
      } catch (e) {
        console.log("Traduction is not valid JSON, using as raw string");
        // If it's not valid JSON, just return the string as is
        return data.Traduction;
      }
    }
    
    // Return Traduction field value (could be object, null, etc.)
    return data.Traduction;
  }
  
  // Return data directly if no Traduction field
  console.log("No Traduction field found, returning full response");
  return data;
};
