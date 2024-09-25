import React, { useEffect, useState } from 'react';
import './App.css';
import { PiUserSoundBold } from "react-icons/pi";
import { GrLinkNext } from "react-icons/gr";
import HoldButton from './components/HoldButton'; 
import { MdAutoDelete } from "react-icons/md";


const languages = ['de', 'uk'];

interface WordData {
  [key: string]: string[];
}

function App() {
  const [language, setLanguage] = useState<string>('uk');
  const [words, setWords] = useState<WordData>({});
  const [currentWord, setCurrentWord] = useState<string>('');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load words from text files
  useEffect(() => {
    const loadWords = async () => {
      const wordData: WordData = {};
      for (const lang of languages) {
        const response = await fetch(`/data/${lang}.txt`);
        const text = await response.text();
        wordData[lang] = text.split(',');
      }
      setWords(wordData);
    };
    loadWords();
  }, []);

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
    getRandomWord();
};

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCurrentWord('');
    setUsedWords([]);
  };

  // Handle clearing local storage
  const handleClearStorage = () => {
    const confirmReset = window.confirm('Are you sure you want to reset used words?');
    if (confirmReset) {
      const today = new Date().toLocaleDateString();
      localStorage.removeItem(`usedWords_${language}_${today}`);
      setUsedWords([]);
      alert('Used words have been reset.');
    }
  };

  return (
      <div className="App">
        <div>
          {languages.map(lang => (
            <button key={lang} onClick={() => handleLanguageChange(lang)} disabled={language === lang}>
              {lang.toUpperCase()}
            </button>
          ))}
              <HoldButton onClick={handleClearStorage} style={{ padding: "10px", position: 'absolute', right: '10px', top: '10px' }} holdTime={1000}>
                <MdAutoDelete />
              </HoldButton>
        </div>
        <div className="content">
          <div className="word-display">
            {currentWord ? <h2>{currentWord}</h2> : <p>Press "Next" to start</p>}
          </div>
          <div className="controls">
            <HoldButton onClick={speakWord} holdTime={0} disabled={!currentWord}>
              <PiUserSoundBold />
            </HoldButton>
            <HoldButton onClick={handleNext} holdTime={1000}>
              <GrLinkNext />
            </HoldButton>
            
          </div>
        </div>
      </div>
  );
}

export default App;
