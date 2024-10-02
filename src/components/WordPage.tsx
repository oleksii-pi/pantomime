import React, { useState, useEffect, useContext } from 'react';
import { GrLinkNext } from "react-icons/gr";
import LanguageContext from '../LanguageContext';
import ConfirmationPage from './ConfirmationPage';
import Button from '@mui/material/Button'; // Import MUI Button
import TranslationContext from '../TranslationContext';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Box } from '@mui/material';

interface WordData {
  [key: string]: string[];
}

const zeroLevelWordsCount = 44;

const WordPage: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const { t } = useContext(TranslationContext);
  const [words, setWords] = useState<WordData>({});
  const [currentWord, setCurrentWord] = useState<string>('');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(1);

  // Load words from text files
  useEffect(() => {
    const loadWords = async () => {
      if (level === 0) {
        const zeroLevelWords = Array.from({ length: zeroLevelWordsCount }, (_, i) => (i + 1).toString());
        setWords({ [language]: zeroLevelWords });
        return;
      }
      const response = await fetch(`/data/${language}.${level}.txt`);
      const text = await response.text();
      setWords(prevWords => ({ ...prevWords, [language]: text.split(',').map(w => w.trim()) }));
    };
    loadWords();
  }, [language, level]);

  // Load used words from localStorage
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const storedData = localStorage.getItem(`usedWords_${language}_${level}_${today}`);
    if (storedData) {
      setUsedWords(JSON.parse(storedData));
    } else {
      setUsedWords([]);
    }
  }, [language, level]);

  // Store used words to localStorage
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem(`usedWords_${language}_${level}_${today}`, JSON.stringify(usedWords));
  }, [usedWords, language, level]);

  // Get a random word
  const getRandomWord = (): void => {
    if (words[language] && words[language].length > 0) {
      const availableWords = words[language].filter(w => !usedWords.includes(w));
      if (availableWords.length === 0) {
        // Reset used words if all words have been used
        const randomIndex = Math.floor(Math.random() * words[language].length);
        const word =  words[language][randomIndex];
        setCurrentWord(word);
        setUsedWords([word]);
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const word = availableWords[randomIndex];
      setCurrentWord(word);
      setUsedWords([...usedWords, word]);
    } else {
      alert(t("notification.no-words-found"));
    }
  };

  useEffect(() => {
    if (words[language] && words[language].length > 0) {
      getRandomWord();
    }
  }, [words, language]);

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
              onChange={(e) => setLevel(Number(e.target.value))}
            >
              <MenuItem value={0}>5+</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
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