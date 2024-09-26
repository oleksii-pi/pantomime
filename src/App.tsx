import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import WordPage from './components/WordPage';
import { LanguageProvider } from './LanguageContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'word'>('landing');

  return (
    <LanguageProvider>
      <div className="App">
        {currentPage === 'landing' && (
          <LandingPage onStart={() => setCurrentPage('word')} />
        )}
        {currentPage === 'word' && (
          <WordPage />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
