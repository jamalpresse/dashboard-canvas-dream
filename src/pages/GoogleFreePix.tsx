
import React from "react";
import { GoogleFreePix as GoogleFreePixComponent } from "@/components/image-generation/GoogleFreePix";

const GoogleFreePix = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
        Google Free Pix
      </h1>
      <p className="text-gray-600 mb-8">
        Générez des images à partir d'une description textuelle. Saisissez votre prompt et cliquez sur le bouton pour générer une image.
      </p>
      <div className="max-w-3xl mx-auto">
        <GoogleFreePixComponent />
      </div>
    </div>
  );
};

export default GoogleFreePix;
