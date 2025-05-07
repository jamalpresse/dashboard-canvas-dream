
import React, { useState } from 'react';
import TranslationForm from '@/components/translation/TranslationForm';
import DebugDialog from '@/components/translation/DebugDialog';
import NavigationButtons from '@/components/translation/NavigationButtons';

export default function Translation() {
  const [debugDialogOpen, setDebugDialogOpen] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  const handleDebugToggle = () => {
    setDebugDialogOpen(!debugDialogOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <header className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-black">Traduction Multilingue</h1>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <TranslationForm 
          onDebugToggle={handleDebugToggle} 
          setDebugData={setDebugData} 
        />

        <DebugDialog 
          open={debugDialogOpen} 
          onOpenChange={setDebugDialogOpen} 
          debugData={debugData} 
        />
        
        <NavigationButtons />
      </div>
    </div>
  );
}
