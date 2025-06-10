
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md bg-card p-6 rounded-lg border border-red-800 shadow-lg text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Erreur de chargement</h2>
        <p className="text-gray-300 mb-4">{message}</p>
        <Button variant="destructive" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    </div>
  );
};
