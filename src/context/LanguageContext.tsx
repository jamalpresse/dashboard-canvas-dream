
import React, { createContext, useContext, useState, ReactNode } from "react";

interface LanguageContextProps {
  lang: "fr" | "ar";
  setLang: (lang: "fr" | "ar") => void;
  t: (namespace: string, key: string) => string;
  isRTL: boolean;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations = {
  fr: {
    dashboard: {
      welcome: "Bienvenue sur SNRT Intelligence",
      search: "Recherche intelligente",
      improve: "Améliorer le texte",
      translate: "Traduction",
      imageGeneration: "Génération d'images",
      latestNews: "Dernières actualités",
      viewMore: "Voir plus",
      statistics: "Statistiques",
      activities: "Activités récentes"
    },
    translation: {
      title: "Traduction intelligente",
      sourceText: "Texte source",
      targetText: "Texte traduit",
      translate: "Traduire",
      translating: "Traduction en cours...",
      loading: "Traduction en cours...",
      success: "Traduction réussie",
      error: "Erreur de traduction",
      copy: "Copier",
      copied: "Copié !",
      clear: "Effacer",
      paste: "Coller",
      placeholder: "Entrez votre texte à traduire...",
      selectLanguage: "Sélectionner la langue",
      from: "De",
      to: "Vers",
      autoDetect: "Détection automatique"
    },
    improve: {
      title: "Amélioration de texte",
      inputPlaceholder: "Entrez votre texte à améliorer...",
      placeholder: "Entrez votre texte à améliorer...",
      improve: "Améliorer",
      improving: "Amélioration en cours...",
      improveAndSeo: "Améliorer + SEO",
      loadingMessage: "Amélioration en cours...",
      processingMessage: "Traitement en cours...",
      successMessage: "Demande envoyée",
      paste: "Coller",
      copy: "Copier",
      copyAll: "Tout copier",
      result: "Texte amélioré",
      suggestions: "Suggestions d'amélioration",
      grammar: "Grammaire",
      style: "Style",
      clarity: "Clarté"
    },
    search: {
      title: "Recherche intelligente",
      placeholder: "Rechercher dans les actualités...",
      search: "Rechercher",
      searching: "Recherche en cours...",
      loading: "Chargement...",
      paste: "Coller",
      clear: "Effacer",
      copy: "Copier",
      results: "Résultats",
      noResults: "Aucun résultat trouvé",
      filters: "Filtres",
      sortBy: "Trier par",
      date: "Date",
      relevance: "Pertinence"
    },
    briefing: {
      title: "IHATA",
      subjectLabel: "Sujet de l'article",
      placeholder: "Écrivez le sujet de l'article...",
      go: "Go"
    },
    navigation: {
      home: "Accueil",
      news: "Actualités",
      search: "Recherche",
      translation: "Traduction",
      improve: "Améliorer",
      improveText: "Améliorer le texte",
      briefing: "IHATA",
      imageGeneration: "Images",
      settings: "Paramètres",
      logout: "Déconnexion",
      profile: "Profil"
    },
    categories: {
      maroc: "Maroc",
      monde: "Monde",
      politique: "Politique",
      economie: "Économie",
      sport: "Sport",
      culture: "Culture",
      technologie: "Technologie",
      sante: "Santé",
      viewMore: "Voir plus"
    },
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      confirm: "Confirmer",
      save: "Enregistrer",
      delete: "Supprimer",
      edit: "Modifier",
      view: "Voir",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      close: "Fermer",
      open: "Ouvrir",
      retry: "Réessayer",
      debug: "Débogage",
      noResults: "Aucun résultat",
      loadingError: "Erreur de chargement"
    },
    imageGeneration: {
      title: "Génération d'Images",
      description: "Créez des images uniques à partir de vos descriptions textuelles",
      imageDescription: "Description de l'image",
      placeholder: "Décrivez l'image que vous souhaitez générer...",
      generateButton: "Générer l'image",
      generating: "Génération en cours...",
      success: "Succès",
      successMessage: "Image générée avec succès !",
      error: "Erreur",
      errorMessage: "Une erreur s'est produite lors de la génération",
      enterDescription: "Veuillez entrer une description",
      downloadImage: "Télécharger l'image",
      downloadStarted: "Téléchargement commencé",
      downloadError: "Erreur lors du téléchargement",
      restart: "Recommencer",
      download: "Télécharger",
      newImage: "Nouvelle image",
      reset: "Réinitialiser",
      noImageGenerated: "Aucune image générée",
      useFormAbove: "Utilisez le formulaire ci-dessus pour générer une image",
      loadingError: "Erreur de chargement de l'image",
      details: "Détails",
      detectedPath: "Chemin détecté",
      templateError: "Erreur de modèle",
      templateErrorDescription: "Le modèle n8n contient une expression non évaluée",
      templateErrorSolution: "Ajoutez un nœud 'Set' dans n8n pour évaluer cette expression avant le nœud 'Répondre Webhook'",
      debugInfo: "Informations de débogage",
      errorDetected: "Erreur détectée",
      information: "Information",
      hideTechnicalDetails: "Masquer les détails techniques",
      showTechnicalDetails: "Afficher les détails techniques",
      fullWebhookResponse: "Réponse complète du webhook",
      n8nTitle: "Génération avec N8n",
      n8nDescription: "Génération d'images via le workflow N8n",
      webhookGeneration: "Génération via webhook",
      translationInProgress: "Traduction en cours...",
      promptTranslated: "Prompt traduit automatiquement",
      originalPrompt: "Prompt original",
      translatedPrompt: "Prompt traduit",
      detectedLanguage: "Langue détectée",
      translationFailed: "Échec de la traduction, utilisation du prompt original"
    }
  },
  ar: {
    dashboard: {
      welcome: "مرحباً بكم في SNRT الذكي",
      search: "البحث الذكي",
      improve: "تحسين النص",
      translate: "الترجمة",
      imageGeneration: "توليد الصور",
      latestNews: "آخر الأخبار",
      viewMore: "عرض المزيد",
      statistics: "الإحصائيات",
      activities: "الأنشطة الحديثة"
    },
    translation: {
      title: "الترجمة الذكية",
      sourceText: "النص المصدر",
      targetText: "النص المترجم",
      translate: "ترجمة",
      translating: "جاري الترجمة...",
      loading: "جاري الترجمة...",
      success: "نجحت الترجمة",
      error: "خطأ في الترجمة",
      copy: "نسخ",
      copied: "تم النسخ!",
      clear: "مسح",
      paste: "لصق",
      placeholder: "أدخل النص المراد ترجمته...",
      selectLanguage: "اختر اللغة",
      from: "من",
      to: "إلى",
      autoDetect: "كشف تلقائي"
    },
    improve: {
      title: "تحسين النص",
      inputPlaceholder: "أدخل النص المراد تحسينه...",
      placeholder: "أدخل النص المراد تحسينه...",
      improve: "تحسين",
      improving: "جاري التحسين...",
      improveAndSeo: "تحسين + سيو",
      loadingMessage: "جاري التحسين...",
      processingMessage: "جاري المعالجة...",
      successMessage: "تم إرسال الطلب",
      paste: "لصق",
      copy: "نسخ",
      copyAll: "نسخ الكل",
      result: "النص المحسن",
      suggestions: "اقتراحات التحسين",
      grammar: "القواعد",
      style: "الأسلوب",
      clarity: "الوضوح"
    },
    search: {
      title: "البحث الذكي",
      placeholder: "البحث في الأخبار...",
      search: "بحث",
      searching: "جاري البحث...",
      loading: "جاري التحميل...",
      paste: "لصق",
      clear: "مسح",
      copy: "نسخ",
      results: "النتائج",
      noResults: "لا توجد نتائج",
      filters: "المرشحات",
      sortBy: "ترتيب حسب",
      date: "التاريخ",
      relevance: "الصلة"
    },
    briefing: {
      title: "إحاطة",
      subjectLabel: "موضوع المقال",
      placeholder: "اكتب موضوع المقال..."
    },
    navigation: {
      home: "الرئيسية",
      news: "الأخبار",
      search: "البحث",
      translation: "الترجمة",
      improve: "التحسين",
      improveText: "تحسين النص",
      briefing: "إحاطة",
      imageGeneration: "الصور",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      profile: "الملف الشخصي"
    },
    categories: {
      maroc: "المغرب",
      monde: "العالم",
      politique: "السياسة",
      economie: "الاقتصاد",
      sport: "الرياضة",
      culture: "الثقافة",
      technologie: "التكنولوجيا",
      sante: "الصحة",
      viewMore: "عرض المزيد"
    },
    common: {
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
      cancel: "إلغاء",
      confirm: "تأكيد",
      save: "حفظ",
      delete: "حذف",
      edit: "تعديل",
      view: "عرض",
      back: "رجوع",
      next: "التالي",
      previous: "السابق",
      close: "إغلاق",
      open: "فتح",
      retry: "إعادة المحاولة",
      debug: "تصحيح",
      noResults: "لا توجد نتائج",
      loadingError: "خطأ في التحميل"
    },
    imageGeneration: {
      title: "توليد الصور",
      description: "أنشئ صوراً فريدة من أوصافك النصية",
      imageDescription: "وصف الصورة",
      placeholder: "صف الصورة التي تريد إنشاءها...",
      generateButton: "توليد الصورة",
      generating: "جاري التوليد...",
      success: "نجح",
      successMessage: "تم توليد الصورة بنجاح!",
      error: "خطأ",
      errorMessage: "حدث خطأ أثناء التوليد",
      enterDescription: "يرجى إدخال وصف",
      downloadImage: "تحميل الصورة",
      downloadStarted: "بدأ التحميل",
      downloadError: "خطأ في التحميل",
      restart: "إعادة البدء",
      download: "تحميل",
      newImage: "صورة جديدة",
      reset: "إعادة تعيين",
      noImageGenerated: "لم يتم توليد أي صورة",
      useFormAbove: "استخدم النموذج أعلاه لتوليد صورة",
      loadingError: "خطأ في تحميل الصورة",
      details: "التفاصيل",
      detectedPath: "المسار المكتشف",
      templateError: "خطأ في القالب",
      templateErrorDescription: "يحتوي قالب n8n على تعبير غير مُقيَّم",
      templateErrorSolution: "أضف عقدة 'Set' في n8n لتقييم هذا التعبير قبل عقدة 'Respond to Webhook'",
      debugInfo: "معلومات التصحيح",
      errorDetected: "تم اكتشاف خطأ",
      information: "معلومات",
      hideTechnicalDetails: "إخفاء التفاصيل التقنية",
      showTechnicalDetails: "إظهار التفاصيل التقنية",
      fullWebhookResponse: "الرد الكامل للـ webhook",
      n8nTitle: "التوليد باستخدام N8n",
      n8nDescription: "توليد الصور عبر سير عمل N8n",
      webhookGeneration: "التوليد عبر webhook",
      translationInProgress: "جاري الترجمة...",
      promptTranslated: "تمت ترجمة الطلب تلقائياً",
      originalPrompt: "الطلب الأصلي",
      translatedPrompt: "الطلب المترجم",
      detectedLanguage: "اللغة المكتشفة",
      translationFailed: "فشلت الترجمة، استخدام الطلب الأصلي"
    }
  }
};

const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<"fr" | "ar">('fr');

  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const t = (namespace: string, key: string): string => {
    if (translations[lang] && translations[lang][namespace] && translations[lang][namespace][key]) {
      return translations[lang][namespace][key];
    }
    // Fallback to French if translation missing
    if (translations['fr'] && translations['fr'][namespace] && translations['fr'][namespace][key]) {
      return translations['fr'][namespace][key];
    }
    // Fallback to key if nothing found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { LanguageProvider, useLanguage };
