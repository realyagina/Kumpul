import React from 'react';
import { Language } from '../translations';

interface LanguageToggleProps {
  language: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onToggle }) => {
  return (
    <div className="inline-flex items-center bg-[#F3F4F0] p-1 rounded-xl border border-gray-200/80 text-xs font-semibold">
      <button
        type="button"
        onClick={() => onToggle('id')}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
          language === 'id'
            ? 'bg-white text-[#0F9D8A] shadow-xs font-bold'
            : 'text-gray-500 hover:text-gray-800'
        }`}
        title="Bahasa Indonesia"
      >
        <span className="text-sm">🇮🇩</span>
        <span>ID</span>
      </button>
      <button
        type="button"
        onClick={() => onToggle('en')}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
          language === 'en'
            ? 'bg-white text-[#0F9D8A] shadow-xs font-bold'
            : 'text-gray-500 hover:text-gray-800'
        }`}
        title="English"
      >
        <span className="text-sm">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};
