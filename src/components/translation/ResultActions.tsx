import React from 'react';
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
interface ResultActionsProps {
  result: string;
  handleCopy: () => void;
  handleClear: () => void;
  onDebugToggle: () => void;
}
const ResultActions: React.FC<ResultActionsProps> = ({
  result,
  handleCopy,
  handleClear,
  onDebugToggle
}) => {
  return <div className="mt-2 flex flex-wrap gap-2">
      <Button onClick={handleCopy} disabled={!result} className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors shadow-sm ${!result ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <Clipboard className="mr-1 h-4 w-4" />
        COPIER
      </Button>
      <Button onClick={handleClear} variant="outline" className="bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors shadow-sm">
        EFFACER
      </Button>
      
    </div>;
};
export default ResultActions;