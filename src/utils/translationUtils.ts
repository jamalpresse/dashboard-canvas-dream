
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
 * Extracts valid content from text containing template variables
 * If possible, returns the parts that don't contain variables
 */
const extractValidContent = (text: string): string | null => {
  if (!containsTemplateVariables(text)) return text;
  
  console.log("Extracting valid content from text with template variables:", text);
  
  // Try to extract JSON parts that might be valid
  try {
    // If it looks like a JSON object with some valid parts
    if (text.includes('{') && text.includes('}') && text.includes(':')) {
      // Simple attempt to clean and parse - this may need refinement based on actual data
      const cleanedText = text.replace(/\{\{\s*.*?\s*\}\}/g, '"[Template Variable]"');
      console.log("Cleaned text for parsing:", cleanedText);
      
      try {
        const parsed = JSON.parse(cleanedText);
        console.log("Successfully parsed cleaned JSON:", parsed);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        console.log("Failed to parse cleaned JSON, returning original text");
      }
    }
  } catch (e) {
    console.log("Error extracting valid content:", e);
  }
  
  // If we can't extract valid JSON, return a user-friendly message
  return null;
};

/**
 * Formats translation data into a readable structure
 */
export const formatTranslationResult = (data: any): string => {
  console.log("Formatting translation data:", data);
  
  // Check if the response has a Traduction field
  if (data && data.Traduction !== undefined) {
    console.log("Traduction field found:", data.Traduction);
    
    // If Traduction is a string that contains unresolved template variables
    if (typeof data.Traduction === 'string' && containsTemplateVariables(data.Traduction)) {
      console.log("Traduction contains template variables:", data.Traduction);
      
      // Try to extract valid content
      const validContent = extractValidContent(data.Traduction);
      if (validContent) {
        console.log("Valid content extracted:", validContent);
        return validContent;
      }
      
      // If we couldn't extract valid content, return a user-friendly message
      return "La réponse contient des variables non résolues. Veuillez réessayer ou contacter l'administrateur.";
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
    
    // Check if Traduction contains template variables
    if (typeof data.Traduction === 'string' && containsTemplateVariables(data.Traduction)) {
      console.log("Traduction contains template variables, attempting to extract valid parts");
      
      // Try to extract valid content
      const validContent = extractValidContent(data.Traduction);
      if (validContent) {
        try {
          const parsed = JSON.parse(validContent);
          console.log("Successfully parsed extracted valid content:", parsed);
          return parsed;
        } catch (e) {
          console.log("Extracted content is not valid JSON, using as string");
          return validContent;
        }
      }
      
      // If we couldn't extract valid content, return a simplified message
      return { error: "Variables non résolues dans la réponse du webhook" };
    }
    
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
