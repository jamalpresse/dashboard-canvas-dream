
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Pencil, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const ImageGenerationNavigationButtons = () => {
  return (
    <div className="mt-6">
      <div className="text-sm text-muted-foreground mb-2">Navigation rapide:</div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild className="flex-1">
          <Link to="/search">
            <Search className="mr-2 h-4 w-4" />
            Recherche (AR / FR)
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="flex-1">
          <Link to="/improve">
            <Pencil className="mr-2 h-4 w-4" />
            Améliorer texte & SEO
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="flex-1">
          <Link to="/translation">
            <Globe className="mr-2 h-4 w-4" />
            Traduction multilingue
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ImageGenerationNavigationButtons;
