import React, { useState, useEffect, useContext } from 'react';
import { PiUserSoundBold } from "react-icons/pi";
import { GrLinkNext } from "react-icons/gr";
import LanguageContext from '../LanguageContext';
import ConfirmationPage from './ConfirmationPage';
import Button from '@mui/material/Button'; // Import MUI Button

interface WordData {
  [key: string]: string[];
}

const WordPage: React.FC = () => {
  const { language } = useContext(LanguageContext);
  const [words, setWords] = useState<WordData>({});
  const [currentWord, setCurrentWord] = useState<string>('');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Load words from text files
  useEffect(() => {
    const loadWords = async () => {
      const response = await fetch(`/data/${language}.txt`);
      const text = await response.text();
      setWords(prevWords => ({ ...prevWords, [language]: text.split(',') }));
    };
    loadWords();
  }, [language]);

  // Load used words from localStorage
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const storedData = localStorage.getItem(`usedWords_${language}_${today}`);
    if (storedData) {
      setUsedWords(JSON.parse(storedData));
    } else {
      setUsedWords([]);
    }
  }, [language]);

  // Store used words to localStorage
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem(`usedWords_${language}_${today}`, JSON.stringify(usedWords));
  }, [usedWords, language]);

  // Load available voices for speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  // Get a random word
  const getRandomWord = (): void => {
    if (words[language] && words[language].length > 0) {
      const availableWords = words[language].filter(w => !usedWords.includes(w));
      if (availableWords.length === 0) {
        // Reset used words if all words have been used
        setUsedWords([]);
        return getRandomWord();
      }
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const word = availableWords[randomIndex];
      setCurrentWord(word);
      setUsedWords([...usedWords, word]);
    } else {
      alert('Words not loaded yet, please try again later.');
    }
  };

  useEffect(() => {
    if (words[language] && words[language].length > 0) {
      getRandomWord();
    }
  }, [words, language]);

  // Play the word using Speech Synthesis API
  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord);
      let voice = voices.find(v => v.lang.startsWith(language));
      if (!voice) {
        voice = voices[0];
      }
      utterance.voice = voice;
      utterance.lang = voice.lang;
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 1000); // 1-second delay
    } else {
      alert('Speech Synthesis not supported in your browser.');
    }
  };

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
          <div className="controls">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNext}
            >
              <GrLinkNext size={40} />
            </Button>
          </div>
          <div className="word-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
            {currentWord ? <h2>{currentWord}</h2> : <p>Press "Next" to start</p>}
            <Button
              variant="contained"
              color="primary"
              onClick={speakWord}
              disabled={!currentWord}
            >
              <PiUserSoundBold size={40} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordPage;