import React, { createContext, useState, ReactNode } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  languages: string[];
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'uk',
  setLanguage: () => {},
  languages: ['de', 'uk'],
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const languages = ['de', 'uk'];
  const [language, setLanguage] = useState<string>('uk');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
