import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our translation structure
interface TranslationItem {
  [key: string]: string;
}

interface LanguageSection {
  fr: TranslationItem;
  ar: TranslationItem;
}

// Define the structure of our translations
type TranslationLabels = {
  [key: string]: LanguageSection;
};

// All translations for the application
const translations: TranslationLabels = {
  // Dashboard/Index page translations
  dashboard: {
    fr: {
      title: "Dashboard Journalistes",
      subtitle: "Choisissez une fonctionnalité ci-dessous :",
      search: "Recherche (AR / FR)",
      improve: "Améliorer texte & SEO",
      translate: "Traduction multilingue",
      welcome: "Bienvenue au Dashboard Journalistes",
      greeting: "Bienvenue dans votre système d'information journalistique",
      stats: "Statistiques",
      activity: "Activités récentes",
      weather: "Météo",
      analyticsTitle: "Analyse de l'engagement",
      latestNews: "À LA UNE",
      news: "Actualités",
      flashNews: "Flash Info",
      imageGeneration: "Génération d'image"
    },
    ar: {
      title: "لوحة تحكم الصحفيين",
      subtitle: "اختر إحدى الوظائف التالية:",
      search: "البحث (بالعربية / الفرنسية)",
      improve: "تحسين النص وتهيئة محركات البحث",
      translate: "الترجمة التلقائية",
      welcome: "مرحباً بك في لوحة تحكم الصحفيين",
      greeting: "أهلاً بك في نظام المعلومات الصحفية",
      stats: "الإحصائيات",
      activity: "النشاطات الأخيرة",
      weather: "الطقس",
      analyticsTitle: "تحليلات المستخدم",
      latestNews: "آخر الأخبار",
      news: "الأخبار",
      flashNews: "أخبار عاجلة",
      imageGeneration: "توليد الصور"
    }
  },
  
  // Translation page translations
  translation: {
    fr: {
      title: "Traduction Multilingue",
      sourceText: "Texte source:",
      targetText: "Traduction:",
      paste: "COLLER",
      translate: "TRADUIRE",
      clear: "EFFACER",
      copy: "Copier",
      selectLanguagePair: "Sélectionner la paire de langues:",
      noTranslation: "Aucune traduction disponible.",
      loading: "Traduction en cours...",
      debug: "Déboguer"
    },
    ar: {
      title: "الترجمة متعددة اللغات",
      sourceText: "النص المصدر:",
      targetText: "الترجمة:",
      paste: "لصق",
      translate: "ترجمة",
      clear: "مسح",
      copy: "نسخ",
      selectLanguagePair: "اختر زوج اللغات:",
      noTranslation: "لا توجد ترجمة متاحة.",
      loading: "جاري الترجمة...",
      debug: "تصحيح الأخطاء"
    }
  },
  
  // Improve page translations
  improve: {
    fr: {
      title: "Améliorer Texte & SEO",
      inputText: "Texte à améliorer:",
      paste: "COLLER",
      improve: "AMÉLIORER",
      improveAndSeo: "AMÉLIORER & SEO",
      clear: "EFFACER",
      copy: "Copier",
      copyAll: "Copier tous",
      loading: "Amélioration en cours...",
      loadingMessage: "CHARGEMENT...",
      processingMessage: "Traitement en cours... Cela peut prendre jusqu'à une minute.",
      successMessage: "Requête envoyée avec succès, en attente de réponse...",
      results: "Résultats",
      resultsAvailable: "Résultats disponibles ✓",
      placeholder: "Collez ici votre article ou brouillon en arabe ou en français"
    },
    ar: {
      title: "تحسين النص وتهيئة محركات البحث",
      inputText: "النص المراد تحسينه:",
      paste: "لصق",
      improve: "تحسين",
      improveAndSeo: "تحسين وتهيئة محركات البحث",
      clear: "مسح",
      copy: "نسخ",
      copyAll: "نسخ الكل",
      loading: "جاري التحسين...",
      loadingMessage: "جاري التحميل...",
      processingMessage: "جاري المعالجة... قد يستغرق الأمر دقيقة واحدة.",
      successMessage: "تم إرسال الطلب بنجاح، في انتظار الرد...",
      results: "النتائج",
      resultsAvailable: "النتائج متاحة ✓",
      placeholder: "الصق هنا مقالك أو مسودتك باللغة العربية أو الفرنسية"
    }
  },
  
  // Search page translations
  search: {
    fr: {
      title: "Recherche d'information (FR/AR)",
      placeholder: "Entrez votre question ici en arabe ou en français",
      paste: "COLLER",
      search: "RECHERCHER",
      clear: "EFFACER",
      copy: "COPIER",
      loading: "Chargement...",
      noResult: "Aucun résultat trouvé.",
      error: "Erreur réseau, veuillez réessayer.",
      permissionError: "Impossible d'accéder au presse-papiers. Veuillez vérifier les permissions."
    },
    ar: {
      title: "البحث عن المعلومات (بالعربية / الفرنسية)",
      placeholder: "أدخل سؤالك هنا باللغة العربية أو الفرنسية",
      paste: "لصق",
      search: "بحث",
      clear: "مسح",
      copy: "نسخ",
      loading: "جاري التحميل...",
      noResult: "لم يتم العثور على نتائج.",
      error: "خطأ في الشبكة، يرجى المحاولة مرة أخرى.",
      permissionError: "لا يمكن الوصول إلى الحافظة. يرجى التحقق من الأذونات."
    }
  },
  
  // Navigation elements
  navigation: {
    fr: {
      dashboard: "Dashboard",
      news: "Actualités",
      users: "Utilisateurs",
      search: "Recherche",
      improveText: "Améliorer Texte",
      translation: "Traduction",
      imageGeneration: "Génération d'Images",
      settings: "Paramètres",
      mainMenu: "MENU PRINCIPAL",
      tools: "OUTILS"
    },
    ar: {
      dashboard: "لوحة التحكم",
      news: "الأخبار",
      users: "المستخدمون",
      search: "بحث",
      improveText: "تحسين النص",
      translation: "ترجمة",
      imageGeneration: "توليد الصور",
      settings: "الإعدادات",
      mainMenu: "القائمة الرئيسية",
      tools: "الأدوات"
    }
  },
  
  // News categories
  categories: {
    fr: {
      politique: "POLITIQUE",
      economie: "ECONOMIE",
      sport: "SPORT",
      culture: "CULTURE",
      international: "INTERNATIONAL",
      maroc: "Maroc",
      monde: "Monde",
      viewMore: "Voir plus"
    },
    ar: {
      politique: "سياسة",
      economie: "اقتصاد",
      sport: "رياضة",
      culture: "ثقافة",
      international: "دولي",
      maroc: "المغرب",
      monde: "العالم",
      viewMore: "عرض المزيد"
    }
  },
  
  // Common UI elements
  common: {
    fr: {
      loading: "Chargement...",
      tryAgain: "Réessayer",
      noResults: "Aucun résultat disponible pour le moment.",
      searchNoResults: "Aucun résultat ne correspond à votre recherche.",
      ltr: "LTR",
      rtl: "RTL",
      copy: "Copier",
      sources: "Sources",
      allSources: "Toutes les sources"
    },
    ar: {
      loading: "جاري التحميل...",
      tryAgain: "حاول مرة أخرى",
      noResults: "لا توجد نتائج متاحة حاليًا.",
      searchNoResults: "لا توجد نتائج تطابق بحثك.",
      ltr: "من اليسار إلى اليمين",
      rtl: "من اليمين إلى اليسار",
      copy: "نسخ",
      sources: "المصادر",
      allSources: "جميع المصادر"
    }
  },
};

// Context type definition
type LanguageContextType = {
  lang: "fr" | "ar";
  setLang: (lang: "fr" | "ar") => void;
  t: (section: string, key: string) => string;
  isRTL: boolean;
  dir: "ltr" | "rtl";
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: () => "",
  isRTL: false,
  dir: "ltr"
});

// Hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<"fr" | "ar">("fr");
  const isRTL = lang === "ar";
  const dir = isRTL ? "rtl" as const : "ltr" as const;

  // Function to get translation text
  const t = (section: string, key: string): string => {
    if (translations[section] && translations[section][lang] && translations[section][lang][key]) {
      return translations[section][lang][key];
    }
    console.warn(`Translation missing for ${section}.${lang}.${key}`);
    return key;
  };

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const value: LanguageContextType = {
    lang,
    setLang,
    t,
    isRTL,
    dir
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;

}
