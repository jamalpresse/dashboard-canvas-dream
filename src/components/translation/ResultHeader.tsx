
import React from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";

interface ResultHeaderProps {
  onCopy: () => void;
  result: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ onCopy, result }) => {
  return (
    <div className="mb-2 text-sm text-gray-500 flex justify-end">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
        onClick={onCopy}
        disabled={!result || result.includes('Aucune traduction disponible')}
      >
        <ClipboardCopy className="h-4 w-4 mr-1" /> 
        Copier
      </Button>
    </div>
  );
};

export default ResultHeader;
