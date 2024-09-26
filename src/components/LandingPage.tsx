import React, { useContext } from 'react';
import LanguageContext from '../LanguageContext';
import { MdAutoDelete } from "react-icons/md";

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { language, setLanguage, languages } = useContext(LanguageContext);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleClearStorage = () => {
    const confirmReset = window.confirm('Are you sure you want to reset used words?');
    if (confirmReset) {
      const today = new Date().toLocaleDateString();
      localStorage.removeItem(`usedWords_${language}_${today}`);
      alert('Used words have been reset.');
    }
  };

  return (
    <div>
      <div>
        {languages.map(lang => (
          <button key={lang} onClick={() => handleLanguageChange(lang)} disabled={language === lang}>
            {lang.toUpperCase()}
          </button>
        ))}
        <button onClick={handleClearStorage} style={{ padding: "10px", position: 'absolute', right: '10px', top: '10px' }}>
          <MdAutoDelete />
        </button>
      </div>
      <button onClick={onStart} style={{ backgroundColor: 'green', color: 'white', fontSize: '24px', padding: '10px 20px' }}>
        Start
      </button>
    </div>
  );
};

export default LandingPage;
