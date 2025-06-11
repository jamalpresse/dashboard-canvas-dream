import React, { createContext, useContext, useState, ReactNode } from "react";

interface LanguageContextProps {
  lang: string;
  setLang: (lang: string) => void;
  t: (namespace: string, key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations = {
  fr: {
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
  const [lang, setLang] = useState<string>('fr');

  const isRTL = lang === 'ar';

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
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
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
