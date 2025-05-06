
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
  // Fonction améliorée pour afficher le champ Traduction séparément
  const getTraductionField = () => {
    if (!debugData || !debugData.Traduction) return null;
    
    let traductionContent = debugData.Traduction;
    let isParsed = false;
    
    // Si Traduction est une chaîne JSON, essayer de la parser pour un affichage plus lisible
    if (typeof traductionContent === 'string' && 
        (traductionContent.trim().startsWith('{') || traductionContent.trim().startsWith('['))) {
      try {
        traductionContent = JSON.parse(traductionContent);
        isParsed = true;
        console.log("Champ Traduction parsé dans DebugDialog:", traductionContent);
      } catch (e) {
        console.log("Échec du parsing du champ Traduction dans le dialog de debug");
      }
    }
    
    return (
      <div className="mb-4">
        <h3 className="font-bold mb-2">Champ Traduction:</h3>
        <div className="bg-gray-800 text-green-400 p-3 rounded-md overflow-auto">
          <pre className="text-xs">
            {isParsed 
              ? JSON.stringify(traductionContent, null, 2)
              : traductionContent
            }
          </pre>
        </div>
      </div>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Informations de débogage</DialogTitle>
          <DialogDescription>Détails de la dernière traduction</DialogDescription>
        </DialogHeader>
        <div className="bg-gray-100 p-4 rounded-md overflow-auto space-y-4">
          {getTraductionField()}
          
          <h3 className="font-bold">Réponse complète:</h3>
          <pre className="text-xs bg-gray-800 text-white p-3 rounded-md overflow-auto">
            {debugData ? JSON.stringify(debugData, null, 2) : "Aucune donnée disponible"}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DebugDialog;
