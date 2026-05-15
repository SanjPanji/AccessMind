import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ru', label: 'Русский', short: 'RU' },
    { code: 'kk', label: 'Қазақша', short: 'KK' },
    { code: 'en', label: 'English', short: 'EN' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-6 md:bottom-8 md:right-8 z-50">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden w-36">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  i18n.language === lang.code
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center gap-2 w-14 h-14 bg-white rounded-full shadow-lg border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          title="Change Language"
        >
          <Globe className="w-5 h-5" />
          <span className="text-sm font-bold">{currentLang.short}</span>
        </button>
      </div>
    </div>
  );
}
