
import React from "react";

interface StylesProps {
  isArabic: boolean;
}

export function DashboardStyles({ isArabic }: StylesProps) {
  return (
    <style>
      {`
        .marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(${isArabic ? '-100%' : '100%'}); }
          100% { transform: translateX(${isArabic ? '100%' : '-100%'}); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}
    </style>
  );
}
