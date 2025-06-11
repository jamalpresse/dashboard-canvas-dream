// Service for automatic prompt translation before image generation

export interface TranslationResult {
  translatedPrompt: string;
  originalPrompt: string;
  detectedLanguage: 'fr' | 'ar' | 'en' | 'unknown';
  wasTranslated: boolean;
  error?: string;
}

// Detect if text contains Arabic characters
function containsArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
}

// Detect if text contains French words
function containsFrench(text: string): boolean {
  const frenchWords = [
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'avec', 'dans', 'sur', 'pour',
    'chat', 'chien', 'maison', 'voiture', 'rouge', 'bleu', 'vert', 'grand', 'petit', 'beau',
    'femme', 'homme', 'enfant', 'eau', 'feu', 'terre', 'air', 'soleil', 'lune', 'étoile'
  ];
  
  const lowerText = text.toLowerCase();
  return frenchWords.some(word => lowerText.includes(word));
}

// Detect the language of the prompt
function detectLanguage(prompt: string): 'fr' | 'ar' | 'en' | 'unknown' {
  const trimmedPrompt = prompt.trim();
  
  if (containsArabic(trimmedPrompt)) {
    return 'ar';
  }
  
  if (containsFrench(trimmedPrompt)) {
    return 'fr';
  }
  
  // If it doesn't contain Arabic or French indicators, assume it's English
  return 'en';
}

// Translate prompt using the existing n8n webhook
async function translateToEnglish(prompt: string, sourceLang: 'fr' | 'ar'): Promise<string> {
  const WEBHOOK_URL = 'https://n8n-jamal-u38598.vm.elestio.app/webhook/4732aeff-7544-4f0e-8554-ebd0f614947b';
  
  const langPair = sourceLang === 'fr' ? 'fr-en' : 'ar-en';
  
  const payload = {
    text: prompt.trim(),
    langPair,
    type: "translation",
    service: "translation",
    action: "translate",
    request_type: "translation"
  };
  
  console.log("Translating prompt for image generation:", payload);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Translation HTTP Error: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log("Translation response for prompt:", responseData);
    
    // Extract translation from the response
    if (responseData && responseData.Traduction !== undefined) {
      let translationText = responseData.Traduction;
      
      // If Traduction is a JSON string, try to parse it
      if (typeof translationText === 'string' && 
          (translationText.trim().startsWith('{') || translationText.trim().startsWith('['))) {
        try {
          const parsedTranslation = JSON.parse(translationText);
          translationText = typeof parsedTranslation === 'string' 
            ? parsedTranslation 
            : JSON.stringify(parsedTranslation);
        } catch (e) {
          // Keep the text as is if parsing fails
        }
      }
      
      return translationText;
    }
    
    // Fallback to original prompt if no translation found
    throw new Error("No translation field found in response");
    
  } catch (error) {
    console.error("Prompt translation error:", error);
    throw error;
  }
}

// Main function to handle automatic prompt translation
export async function translatePromptIfNeeded(originalPrompt: string): Promise<TranslationResult> {
  const detectedLanguage = detectLanguage(originalPrompt);
  
  console.log(`Detected language for prompt: ${detectedLanguage}`);
  
  // If already in English or unknown, no translation needed
  if (detectedLanguage === 'en' || detectedLanguage === 'unknown') {
    return {
      translatedPrompt: originalPrompt,
      originalPrompt,
      detectedLanguage,
      wasTranslated: false
    };
  }
  
  // Translate from French or Arabic to English
  try {
    const translatedPrompt = await translateToEnglish(originalPrompt, detectedLanguage);
    
    console.log(`Translated prompt from ${detectedLanguage} to English:`, {
      original: originalPrompt,
      translated: translatedPrompt
    });
    
    return {
      translatedPrompt: translatedPrompt || originalPrompt,
      originalPrompt,
      detectedLanguage,
      wasTranslated: true
    };
  } catch (error) {
    console.error(`Failed to translate prompt from ${detectedLanguage}:`, error);
    
    // Return original prompt if translation fails
    return {
      translatedPrompt: originalPrompt,
      originalPrompt,
      detectedLanguage,
      wasTranslated: false,
      error: error instanceof Error ? error.message : "Translation failed"
    };
  }
}
