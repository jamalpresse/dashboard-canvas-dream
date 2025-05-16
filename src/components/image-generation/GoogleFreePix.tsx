
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";
import ImageGenerationNavigationButtons from "./ImageGenerationNavigationButtons";

export const GoogleFreePix = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // Encode search term and add parameters for free to use images
    const encodedSearch = encodeURIComponent(searchTerm);
    const searchUrl = `https://www.google.com/search?q=${encodedSearch}&tbm=isch&tbs=il:cl`;
    
    // Open Google Images search in a new tab
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Google Free Pix</CardTitle>
        <CardDescription className="text-center">
          Recherchez des images libres de droits sur Google Images
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center gap-2">
            <Input 
              type="text"
              placeholder="Que cherchez-vous ?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
            <p className="flex items-center gap-1 text-gray-600">
              <ExternalLink className="h-4 w-4 text-gray-400" />
              Les résultats s'ouvriront dans Google Images avec un filtre pour les images libres de droits
            </p>
          </div>
          
          {/* Navigation buttons */}
          <ImageGenerationNavigationButtons />
        </form>
      </CardContent>
    </Card>
  );
};

export default GoogleFreePix;
