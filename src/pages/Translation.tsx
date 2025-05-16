
import React, { useState } from 'react';
import TranslationForm from '@/components/translation/TranslationForm';
import DebugDialog from '@/components/translation/DebugDialog';
import NavigationButtons from '@/components/translation/NavigationButtons';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreadcrumbNav from '@/components/common/BreadcrumbNav';

export default function Translation() {
  const [debugDialogOpen, setDebugDialogOpen] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  const handleDebugToggle = () => {
    setDebugDialogOpen(!debugDialogOpen);
  };

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <Card className="w-full max-w-4xl mx-auto shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-2xl font-semibold font-playfair text-foreground">
            Traduction Multilingue
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
