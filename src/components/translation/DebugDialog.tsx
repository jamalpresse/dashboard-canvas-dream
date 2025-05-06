
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debugData: any;
}

const DebugDialog: React.FC<DebugDialogProps> = ({ 
  open, 
  onOpenChange, 
  debugData
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Informations de débogage</DialogTitle>
          <DialogDescription>Détails de la dernière traduction</DialogDescription>
        </DialogHeader>
        <div className="bg-gray-100 p-4 rounded-md overflow-auto">          
          <h3 className="font-bold mt-4 mb-2">Réponse brute:</h3>
          <pre className="text-xs">
            {debugData ? JSON.stringify(debugData, null, 2) : "Aucune donnée disponible"}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DebugDialog;
