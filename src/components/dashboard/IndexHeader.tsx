
import React from "react";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

export const IndexHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold font-playfair text-white">
        {t('dashboard', 'welcome')}
      </h1>
      <LanguageSelector />
    </div>
  );
};
