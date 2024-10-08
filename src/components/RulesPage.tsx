import React, { useContext, useEffect } from 'react';
import TranslationContext from '../TranslationContext';
import { Box, Button } from '@mui/material';
import { GrLinkNext } from 'react-icons/gr';
import { analytics } from '../firebaseConfig'; 
import { logEvent } from 'firebase/analytics';

interface RulesPageProps {
  onNext: () => void;
}

const RulesPage: React.FC<RulesPageProps> = ({ onNext }) => {
  const { t } = useContext(TranslationContext);

  useEffect(() => {
    logEvent(analytics, 'page_view_RulesPage'); 
  }, []);

  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };


  return (
      <Box sx={{ 
          mb: 2, 
          textAlign: 'center', 
          mx: { xs: 2, md: 40 } 
        }}>
          <h1>{t('title.rules')}</h1>
        <p style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '20px', fontWeight: '300', margin: '0 0 16px 0' }}>
          {t('game.rules').split('\n').map((line, index) => (
            <span key={index}>
              {renderTextWithBold(line)}
              <br />
            </span>
          ))}
        </p>
        
        <Button
          onClick={onNext}
          variant="contained"
          color="success"
          sx={{ fontSize: '24px', padding: '20px 40px' }}
        >
          {t('button.play')}
          <GrLinkNext />
        </Button>
      </Box>
  );
};

export default RulesPage;