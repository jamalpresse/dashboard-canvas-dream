
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

// Function to render a non-JSON text response
export const renderTextResponse = (text: string) => {
  if (!text) return <span className="text-gray-400">Le résultat apparaîtra ici</span>;
  
  return text.split('\n').map((line, index) => {
    if (line.trim()) {
      return <p key={index} className="my-2">{line}</p>;
    }
    return <br key={index} />;
  });
};
