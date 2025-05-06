
import React from "react";

interface WelcomeSectionProps {
  welcomeTitle: string;
  welcomeMessage: string;
}

export function WelcomeSection({ welcomeTitle, welcomeMessage }: WelcomeSectionProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 shadow-lg text-white mb-8">
        <h1 className="text-3xl font-bold">{welcomeTitle}</h1>
        <p className="mt-2 opacity-90">{welcomeMessage}</p>
      </div>
    </div>
  );
}
