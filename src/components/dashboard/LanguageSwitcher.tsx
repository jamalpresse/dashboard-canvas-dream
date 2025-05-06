
import React from "react";

interface LanguageSwitcherProps {
  isArabic: boolean;
  switchLabel: string;
  onSwitch: () => void;
}

export function LanguageSwitcher({ isArabic, switchLabel, onSwitch }: LanguageSwitcherProps) {
  return (
    <div className="w-full max-w-5xl mx-auto flex justify-end pt-4">
      <button
        onClick={onSwitch}
        className="text-sm bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm hover:bg-white transition-all duration-300 text-purple-700"
      >
        {switchLabel}
      </button>
    </div>
  );
}
