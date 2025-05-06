
import React from 'react';
import { AlertCircle } from "lucide-react";

interface ErrorResultProps {
  message: string;
}

const ErrorResult: React.FC<ErrorResultProps> = ({ message }) => {
  return (
    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
      <div className="flex items-center mb-2">
        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
        <h3 className="font-medium text-yellow-700">Problème de traduction</h3>
      </div>
      <p className="text-yellow-600">
        {message || "La traduction n'a pas pu être complétée. Veuillez réessayer ou contacter l'administrateur."}
      </p>
    </div>
  );
};

export default ErrorResult;
