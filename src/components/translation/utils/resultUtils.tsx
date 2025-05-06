
import React from 'react';

/**
 * Utility functions for TranslationResult components
 */

// Function to check if string is JSON
export const isJsonString = (str: string): boolean => {
  if (!str) return false;
  try {
    const json = JSON.parse(str);
    return typeof json === 'object' && json !== null;
  } catch (e) {
    return false;
  }
};

// Function to create React elements for text response
export const createTextResponseElements = (text: string): React.ReactNode => {
  if (!text) return <span className="text-gray-400">Le résultat apparaîtra ici</span>;
  
  return text.split('\n').map((line, index) => {
    if (line.trim()) {
      return <p key={index} className="my-2">{line}</p>;
    }
    return <br key={index} />;
  });
};

// Function to create a placeholder element
export const createPlaceholder = (): React.ReactNode => {
  return <span className="text-gray-400">Le résultat apparaîtra ici</span>;
};
