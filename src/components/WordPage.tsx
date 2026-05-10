import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { GrLinkNext } from "react-icons/gr";
import LanguageContext from '../LanguageContext';
import ConfirmationPage from './ConfirmationPage';
import Button from '@mui/material/Button';
import TranslationContext from '../TranslationContext';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Box } from '@mui/material';
import { analytics } from '../firebaseConfig'; 
import { logEvent } from 'firebase/analytics';

interface WordData {
  [key: string]: string[];
}

const zeroLevelWordsCount = 44;

const getUsedWordsStorageKey = (language: string, level: number): string => {
  const today = new Date().toLocaleDateString();
  return `usedWords_${language}_${level}_${today}`;
};

const WordPage: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useContext(TranslationContext);
  const [words, setWords] = useState<WordData>({});
  const [currentWord, setCurrentWord] = useState<string>('');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [usedWordsStorageKey, setUsedWordsStorageKey] = useState<string>(() =>
    getUsedWordsStorageKey(language, 1)
  );
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(1);
  const usedWordsRef = useRef<string[]>([]);
  const currentWordRef = useRef<string>('');
  const wordDisplayTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    logEvent(analytics, 'page_view_WordPage'); 
  }, []);

  // Load words from text files
  useEffect(() => {
    const loadWords = async () => {
      if (level === 0) {
        const zeroLevelWords = Array.from({ length: zeroLevelWordsCount }, (_, i) => (i + 1).toString());
        setWords({ [language]: zeroLevelWords });
        return;
      }
      try {
        const response = await fetch(`/data/${language}.${level}.txt`);
        if (!response.ok) {
          throw new Error(`Could not load words for ${language}.${level}`);
        }
        const text = await response.text();
        const loadedWords = text
          .split(',')
          .map(w => w.trim())
          .filter(Boolean);
        setWords(prevWords => ({ ...prevWords, [language]: loadedWords }));
      } catch (error) {
        console.error(error);
        setWords(prevWords => ({ ...prevWords, [language]: [] }));
      }
    };
    loadWords();
  }, [language, level]);

  // Load used words from localStorage
  useEffect(() => {
    const storageKey = getUsedWordsStorageKey(language, level);
    const storedData = localStorage.getItem(storageKey);
    try {
      const parsedUsedWords = storedData ? JSON.parse(storedData) : [];
      usedWordsRef.current = parsedUsedWords;
      setUsedWords(parsedUsedWords);
    } catch (error) {
      console.error(error);
      usedWordsRef.current = [];
      setUsedWords([]);
    }
    setUsedWordsStorageKey(storageKey);
  }, [language, level]);

  // Store used words to localStorage
  useEffect(() => {
    usedWordsRef.current = usedWords;
    if (usedWordsStorageKey === getUsedWordsStorageKey(language, level)) {
      localStorage.setItem(usedWordsStorageKey, JSON.stringify(usedWords));
    }
  }, [usedWords, usedWordsStorageKey, language, level]);

  // Get a random word
  const getRandomWord = useCallback((): void => {
    const wordList = words[language];
    if (wordList && wordList.length > 0) {
      
      logEvent(analytics, 'get_random_word', { 
        language, 
        level, 
        currentWord: currentWordRef.current, 
        timeSpent: Date.now() - wordDisplayTimeRef.current 
      });

      wordDisplayTimeRef.current = Date.now();

      const previousUsedWords = usedWordsRef.current;
      const availableWords = wordList.filter(w => !previousUsedWords.includes(w));
      const wordsToPickFrom = availableWords.length === 0 ? wordList : availableWords;
      const randomIndex = Math.floor(Math.random() * wordsToPickFrom.length);
      const word = wordsToPickFrom[randomIndex];
      const nextUsedWords = availableWords.length === 0 ? [word] : [...previousUsedWords, word];

      usedWordsRef.current = nextUsedWords;
      currentWordRef.current = word;
      setCurrentWord(word);
      setUsedWords(nextUsedWords);
    } else {
      alert(t("notification.no-words-found"));
    }
  }, [language, level, t, words]);

  useEffect(() => {
    if (words[language] && words[language].length > 0) {
      getRandomWord();
    }
  }, [getRandomWord, language, words]);

  // Handle the Next button click
  const handleNext = () => {
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed: boolean) => {
    setShowConfirmation(false);
    if (confirmed) {
      getRandomWord();
    }
  };

  return (
    <div>
      {showConfirmation ? (
        <ConfirmationPage onConfirm={handleConfirmation} />
      ) : (
        <div className="content">
          <Box >
            <span style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '20px', fontWeight: '300', marginRight: '16px' }}>{t('title.level')}</span>
            <Select
              size='small'
              value={level}
              onChange={(e) => {
                setLevel(Number(e.target.value));
                logEvent(analytics, 'set_level', { level: e.target.value });
              }}
            >
              <MenuItem value={0}>5+</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </Box>
          <div className="controls">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNext}
            >
              {t('button.next-word')}
              <GrLinkNext size={40} />
            </Button>
          </div>
          <div className="word-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
            {level === 0 && (
              <img 
              src={`./data/level0/${currentWord}.webp`} 
              alt={currentWord} 
              width="300" 
              height="300" 
              />
            )}
            {level !== 0 && (<h2>{currentWord}</h2>)} 
          </div>
        </div>
      )}
    </div>
  );
};

export default WordPage;
