import React, { useContext } from 'react';
import LanguageContext from '../LanguageContext';
import { Box, Button, IconButton, Stack } from '@mui/material';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import { GrLinkNext } from 'react-icons/gr';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { language, setLanguage, codeToName, languages } = useContext(LanguageContext);

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
      <IconButton
        onClick={handleClearStorage}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        <AutoDeleteIcon />
      </IconButton>
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
        sx={{ fontSize: '24px', padding: '20px 40px', marginTop: 10 }}
      >
        <GrLinkNext />
      </Button>
    </Box>
  );
};

export default LandingPage;
