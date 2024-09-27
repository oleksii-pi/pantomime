import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  codeToName: (code: string) => string;
  languages: string[];
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'uk',
  setLanguage: () => {},
  codeToName: () => '',
  languages: ['uk', 'de', 'en'],
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const languages = ['uk', 'de', 'en'];
  const [language, setLanguage] = useState<string>(() => {
    const storedLanguage = localStorage.getItem('language');
    return storedLanguage ? storedLanguage : 'uk';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const codeToName = useCallback((code: string) => {
    switch (code) {
      case 'uk':
        return 'UA';
      default:
        return code.toUpperCase();
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, codeToName, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
