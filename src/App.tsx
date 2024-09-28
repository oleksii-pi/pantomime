import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import WordPage from './components/WordPage';
import { LanguageProvider } from './LanguageContext';
import { TranslationProvider } from './TranslationContext';
import RulesPage from './components/RulesPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'rules' | 'word'>('landing');

  return (
    <LanguageProvider>
      <TranslationProvider>
        <div className="App">
          {currentPage === 'landing' && (
            <LandingPage onNext={() => setCurrentPage('rules')} />
          )}
          {currentPage === 'rules' && (
            <RulesPage onNext={() => setCurrentPage('word')} />
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
