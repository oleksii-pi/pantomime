import React, { createContext, useState, ReactNode, useCallback } from 'react';

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
  languages: ['de', 'uk'],
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const languages = ['de', 'uk'];
  const [language, setLanguage] = useState<string>('uk');

  const codeToName = useCallback((code: string) => {
    switch (code) {
      case 'de':
        return 'DE';
      case 'uk':
        return 'UA';
      default:
        return '';
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, codeToName, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
