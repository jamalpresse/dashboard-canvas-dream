
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages } from "lucide-react";
import DebugDialog from "@/components/translation/DebugDialog";
import TranslationForm from "@/components/translation/TranslationForm";

export default function Translation() {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  const updateDebugData = (data: any) => {
    setDebugData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 animate-fade-in">
      <Card className="w-full max-w-4xl mx-auto shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Languages className="h-6 w-6 text-purple-500" />
            Traduction Multilingue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TranslationForm 
            onDebugToggle={toggleDebugInfo} 
            setDebugData={updateDebugData}
          />
        </CardContent>
      </Card>

      {/* Debug Dialog Component */}
      <DebugDialog 
        open={showDebugInfo} 
        onOpenChange={setShowDebugInfo}
        debugData={debugData}
      />
    </div>
  );
}
