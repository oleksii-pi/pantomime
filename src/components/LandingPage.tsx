import React, { useContext } from 'react';
import LanguageContext from '../LanguageContext';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { MdOutlineAutoDelete } from "react-icons/md";
import { GrLinkNext } from 'react-icons/gr';
import { FaGithub } from 'react-icons/fa';
import TranslationContext from '../TranslationContext';


interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { language, setLanguage, codeToName, languages } = useContext(LanguageContext);
  const { t } = useContext(TranslationContext);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleClearStorage = () => {
    const confirmReset = window.confirm('Are you sure you want to reset todays used words for selected language?');
    if (confirmReset) {
      const today = new Date().toLocaleDateString();
      localStorage.removeItem(`usedWords_${language}_${today}`);
      alert('Used words have been reset.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <a
        href="https://github.com/oleksii-pi/pantomime"
        target="_blank"
        style={{ position: 'absolute', top: 16, left: 16 }}
        rel="noopener noreferrer"
      >
        <FaGithub size={40} color='#000'/>
      </a>
      
      <IconButton
        onClick={handleClearStorage}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        <MdOutlineAutoDelete size={40} />
      </IconButton>
      <Box 
        sx={{ 
          mb: 2, 
          textAlign: 'center', 
          mx: { xs: 2, md: 20 } 
        }}
      >
        <p style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '30px', fontWeight: '300', margin: '0 0 16px 0' }}>
          {t('game.description')}
        </p>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2}>
          {languages.map((lang) => (
            <Button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              variant={language === lang ? 'contained' : 'outlined'}
              color="primary"
            >
              {codeToName(lang)}
            </Button>
          ))}
        </Stack>
      </Box>
      <Button
        onClick={onStart}
        variant="contained"
        color="success"
        sx={{ fontSize: '24px', padding: '20px 40px' }}
      >
        <GrLinkNext />
      </Button>
      
    </Box>
  );
};

export default LandingPage;
