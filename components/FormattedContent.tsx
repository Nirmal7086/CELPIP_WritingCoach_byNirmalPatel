
import React from 'react';

const parseLineForFormatting = (line: string): React.ReactNode => {
  const parts = line.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-100">{part}</strong> : part
      )}
    </>
  );
};

export const FormattedContent = ({ content }: { content: string }) => {
  const lines = content.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.trim().startsWith('•')) {
          const formattedLine = parseLineForFormatting(line.replace(/^[•*]\s*/, ''));
          return (
            <div key={index} className="flex items-start text-left">
              <span className="mr-3 text-sky-400">•</span>
              <span className="flex-1">{formattedLine}</span>
            </div>
          );
        }
        return <p key={index}>{parseLineForFormatting(line)}</p>;
      })}
    </div>
  );
};
