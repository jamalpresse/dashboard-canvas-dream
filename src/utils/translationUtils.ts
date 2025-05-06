
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
 * Extrait de manière intelligente le texte à partir de différents formats d'objets
 */
const extractTextFromObject = (obj: any): string | null => {
  if (!obj || typeof obj !== 'object') return null;
  
  // Propriétés communes contenant du texte
  const textProperties = [
    'text', 'content', 'body', 'message', 'translated_text', 
    'translation', 'output', 'result', 'value'
  ];
  
  // Essayer d'abord les propriétés de texte connues
  for (const prop of textProperties) {
    if (obj[prop] !== undefined) {
      if (typeof obj[prop] === 'string') {
        return obj[prop];
      } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        // Récursion pour les objets imbriqués
        const nestedText = extractTextFromObject(obj[prop]);
        if (nestedText) return nestedText;
      }
    }
  }
  
  // Si l'objet a une seule propriété qui est une chaîne
  const keys = Object.keys(obj);
  if (keys.length === 1 && typeof obj[keys[0]] === 'string') {
    return obj[keys[0]];
  }
  
  return null;
}

/**
 * Formats translation data into a readable structure
 * Prioritizes the "Traduction" field from the webhook response
 */
export const formatTranslationResult = (data: any): string => {
  console.log("Formatting translation data:", data);
  
  if (!data) {
    return "Aucune traduction disponible.";
  }
  
  // Vérifier en priorité absolue le champ "Traduction" du format standard de la réponse
  if (data && typeof data === 'object' && data.Traduction !== undefined) {
    console.log("Traduction field found:", data.Traduction);
    
    // Cas 1: Traduction est une chaîne directe
    if (typeof data.Traduction === 'string') {
      // Si c'est une chaîne qui ressemble à du JSON, essayer de la parser
      if (data.Traduction.trim().startsWith('{') || data.Traduction.trim().startsWith('[')) {
        try {
          const parsedJson = JSON.parse(data.Traduction);
          console.log("Successfully parsed JSON from Traduction string:", parsedJson);
          
          // Extraire le texte de l'objet JSON parsé
          const extractedText = extractTextFromObject(parsedJson);
          if (extractedText) {
            console.log("Extracted text from parsed JSON:", extractedText);
            return extractedText;
          }
          
          // Si on n'a pas pu extraire de texte, renvoyer le JSON formaté
          return JSON.stringify(parsedJson, null, 2);
        } catch (e) {
          // Si le parsing échoue, utiliser la chaîne telle quelle
          console.log("Failed to parse JSON, using string as is:", e);
        }
      }
      return data.Traduction;
    } 
    // Cas 2: Traduction est un objet
    else if (data.Traduction && typeof data.Traduction === 'object') {
      // Essayer d'extraire du texte de l'objet
      const extractedText = extractTextFromObject(data.Traduction);
      if (extractedText) {
        console.log("Extracted text from Traduction object:", extractedText);
        return extractedText;
      }
      
      // Si c'est un objet sans propriétés communes, le convertir en JSON formaté
      return JSON.stringify(data.Traduction, null, 2);
    }
  }
  
  // Filter out template variables
  const cleanedData = filterTemplateVariables(data);
  console.log("Cleaned data after filtering template variables:", cleanedData);
  
  // Essayer d'extraire du texte de l'objet complet
  const extractedText = extractTextFromObject(cleanedData);
  if (extractedText) {
    console.log("Extracted text from whole response:", extractedText);
    return extractedText;
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
