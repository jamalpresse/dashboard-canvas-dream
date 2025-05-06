
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface SourceTextInputProps {
  text: string;
  setText: (text: string) => void;
  isRTL: boolean;
}

const SourceTextInput: React.FC<SourceTextInputProps> = ({
  text,
  setText,
  isRTL
}) => {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">Texte source:</span>
        <span className="text-sm text-gray-500">
          {isRTL ? 'RTL' : 'LTR'}
        </span>
      </div>
      <Textarea
        placeholder="Collez ici votre texte à traduire"
        value={text}
        onChange={e => setText(e.target.value)}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
          isRTL ? 'text-right' : 'text-left'
        }`}
      />
    </section>
  );
};

export default SourceTextInput;
