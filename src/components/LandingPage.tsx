import React, { useContext } from 'react';
import LanguageContext from '../LanguageContext';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { MdOutlineAutoDelete } from "react-icons/md";
import { GrLinkNext } from 'react-icons/gr';
import { FaGithub } from 'react-icons/fa';
import TranslationContext from '../TranslationContext';


interface LandingPageProps {
  onNext: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNext }) => {
  const { language, setLanguage, codeToName, languages } = useContext(LanguageContext);
  const { t } = useContext(TranslationContext);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleClearStorage = () => {
    const confirmReset = window.confirm(t("confirmation.sure-cleanup-history"));
    if (confirmReset) {
      const today = new Date().toLocaleDateString();
      localStorage.removeItem(`usedWords_${language}_${today}`);
      alert(t("notification.words-have-been-reset"));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      <Box 
        component="img"
        src="/images/landing-page-image.webp"
        alt="Children playing Pantomime game"
        sx={{ width: '100%', maxWidth: '300px', mb: 2 }}
      />
      <Box 
        sx={{ 
          mb: 2, 
          textAlign: 'center', 
          mx: { xs: 2, md: 20 } 
        }}
      >
        <p style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '20px', fontWeight: '300', margin: '0 0 16px 0' }}>
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
        onClick={onNext}
        variant="contained"
        color="success"
        sx={{ fontSize: '24px', padding: '20px 40px' }}
      >
        {t('button.rules')}
        <GrLinkNext />
      </Button>
      <Stack direction="row" spacing={2} marginTop={10}>
        <IconButton
          href="https://github.com/oleksii-pi/pantomime/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={40} color='#000'/>
        </IconButton>
        
        <IconButton
          onClick={handleClearStorage}
        >
          <MdOutlineAutoDelete size={40} />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default LandingPage;
