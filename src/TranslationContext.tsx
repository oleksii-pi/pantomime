import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import LanguageContext from './LanguageContext';

interface TranslationContextProps {
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextProps>({
  t: (key: string) => key,
});

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useContext(LanguageContext);
  const [translations, setTranslations] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`./translations/${language}.json`);
        setTranslations(translationModule.default || translationModule);
      } catch (error) {
        console.error(
          `Error loading translation file for language "${language}":`,
          error
        );
        setTranslations({});
      }
    };
    loadTranslations();
  }, [language]);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let result: any = translations;

      for (const k of keys) {
        if (result && result.hasOwnProperty(k)) {
          result = result[k];
        } else {
          return key;
        }
      }

      return typeof result === 'string' ? result : key;
    },
    [translations]
  );

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationContext;
