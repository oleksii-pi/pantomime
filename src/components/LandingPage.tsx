import React, { useContext } from 'react';
import LanguageContext from '../LanguageContext';
import { Box, Button, IconButton, Stack } from '@mui/material';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { language, setLanguage, codeToName, languages } = useContext(LanguageContext);

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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box sx={{ position: 'relative', mb: 2 }}>
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
      <IconButton
        onClick={handleClearStorage}
        sx={{ position: 'absolute', right: -50, top: '50%', transform: 'translateY(-50%)' }}
      >
        <AutoDeleteIcon />
      </IconButton>
      </Box>
      <Button
      onClick={onStart}
      variant="contained"
      color="success"
      sx={{ fontSize: '24px', padding: '10px 20px' }}
      >
      Start
      </Button>
    </Box>
  );
};

export default LandingPage;
