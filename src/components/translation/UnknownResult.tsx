
import React from 'react';

interface UnknownResultProps {
  content: string;
}

const UnknownResult: React.FC<UnknownResultProps> = ({ content }) => {
  return (
    <pre className="whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-md text-sm overflow-auto">
      {content}
    </pre>
  );
};

export default UnknownResult;
