
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft } from "lucide-react";

interface SNRTNewsFrameProps {
  className?: string;
  onClose?: () => void;
}

export function SNRTNewsFrame({ className, onClose }: SNRTNewsFrameProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative bg-white rounded-lg shadow-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between p-2 border-b border-purple-100">
        <h3 className="text-sm font-medium text-purple-700">SNRT News - Page d'accueil</h3>
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 rounded-full" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>
        )}
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      <iframe 
        src="https://snrtnews.com" 
        className="w-full border-0" 
        style={{ height: "500px" }}
        onLoad={() => setIsLoading(false)}
        title="SNRT News"
        sandbox="allow-same-origin allow-scripts"
      />
      
      {/* Large Exit Button - déplacé 2 cm vers le haut */}
      {onClose && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50" style={{ bottom: 'calc(1.5rem + 2cm)' }}>
          <Button 
            variant="default" 
            size="lg" 
            onClick={onClose}
            className="bg-snrt-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour au tableau de bord</span>
          </Button>
        </div>
      )}
    </div>
  );
}
