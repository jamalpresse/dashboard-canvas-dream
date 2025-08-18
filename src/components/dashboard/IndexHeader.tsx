
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const IndexHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold font-playfair text-white">
          SIRAJ
        </h1>
        <p className="text-lg text-white/80 font-light">
          L'IA au service de votre plume
        </p>
      </div>
    </div>
  );
};
