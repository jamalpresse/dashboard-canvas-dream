
/**
 * Utility functions for handling translation data
 */

/**
 * Formats translation data into a readable structure
 */
export const formatTranslationResult = (data: any): string => {
  console.log("Formatting translation data:", data);
  
  // For direct JSON response, return stringified version
  return JSON.stringify(data, null, 2);
};

/**
 * Extract the most appropriate translation result from API response
 */
export const extractTranslationFromResponse = (data: any): any => {
  console.log("Extracting translation from response:", data);
  
  // Return data directly without transformation
  return data;
};
