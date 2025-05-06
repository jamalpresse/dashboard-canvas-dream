
/**
 * Utility functions for handling translation data
 */

/**
 * Extracts text from an object based on common property names
 */
const extractTextFromObject = (obj: any): string | null => {
  if (!obj || typeof obj !== 'object') return null;
  
  // Propriétés communes contenant du texte
  const textProperties = [
    'translated_text', 'translation', 'text', 'content', 'message', 
    'output', 'result', 'value'
  ];
  
  // Essayer d'abord les propriétés de texte connues
  for (const prop of textProperties) {
    if (obj[prop] !== undefined) {
      if (typeof obj[prop] === 'string') {
        return obj[prop];
      } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
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
 * Formats translation data with a strong focus on the "Traduction" field
 */
export const formatTranslationResult = (data: any): string => {
  console.log("Formatage des données de traduction:", data);
  
  if (!data) {
    return "Aucune traduction disponible.";
  }
  
  // Priorité absolue au champ "Traduction"
  if (data && typeof data === 'object' && data.Traduction !== undefined) {
    console.log("Champ Traduction trouvé:", data.Traduction);
    
    // Cas 1: Traduction est une chaîne
    if (typeof data.Traduction === 'string') {
      // Essayer de parser si ça ressemble à du JSON
      if (data.Traduction.trim().startsWith('{') || data.Traduction.trim().startsWith('[')) {
        try {
          const parsedJson = JSON.parse(data.Traduction);
          console.log("JSON parsé depuis la chaîne Traduction:", parsedJson);
          
          // Extraire le texte de l'objet JSON
          const extractedText = extractTextFromObject(parsedJson);
          if (extractedText) {
            return extractedText;
          }
          
          // Si c'est juste une chaîne dans un format JSON
          if (typeof parsedJson === 'string') {
            return parsedJson;
          }
          
          // Sinon, retourner le JSON formaté
          return JSON.stringify(parsedJson, null, 2);
        } catch (e) {
          // Si échec du parsing, utiliser la chaîne telle quelle
          console.log("Échec du parsing JSON, utilisation de la chaîne brute");
          return data.Traduction;
        }
      }
      return data.Traduction;
    } 
    // Cas 2: Traduction est un objet
    else if (typeof data.Traduction === 'object' && data.Traduction !== null) {
      // Essayer d'extraire du texte
      const extractedText = extractTextFromObject(data.Traduction);
      if (extractedText) {
        return extractedText;
      }
      
      // Si non, retourner l'objet formaté
      return JSON.stringify(data.Traduction, null, 2);
    }
  }
  
  // Extraire du texte de l'objet complet
  const extractedText = extractTextFromObject(data);
  if (extractedText) {
    return extractedText;
  }
  
  // Fallback: retourner l'objet entier formaté
  if (typeof data === 'string') {
    return data;
  } else {
    return JSON.stringify(data, null, 2);
  }
};

/**
 * Détecte le type de résultat de traduction
 * On force direct-translation pour simplifier
 */
export const detectResultType = (data: any): 'direct-translation' | 'enhanced-content' | 'error' | 'unknown' => {
  if (!data) return 'error';
  
  // Vérifier s'il y a une erreur
  if (data.error || data.erreur) return 'error';
  
  // Forcer direct-translation pour toutes les réponses réussies
  return 'direct-translation';
};
