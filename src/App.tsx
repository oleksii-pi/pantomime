import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import WordPage from './components/WordPage';
import { LanguageProvider } from './LanguageContext';
import { TranslationProvider } from './TranslationContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'word'>('landing');

  return (
    <LanguageProvider>
      <TranslationProvider>
        <div className="App">
          {currentPage === 'landing' && (
            <LandingPage onStart={() => setCurrentPage('word')} />
          )}
          {currentPage === 'word' && (
            <WordPage />
          )}
        </div>
      </TranslationProvider>
    </LanguageProvider>
  );
}

export default App;
