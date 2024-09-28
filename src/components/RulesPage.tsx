import React, { useContext } from 'react';
import TranslationContext from '../TranslationContext';
import { Button } from '@mui/material';
import { GrLinkNext } from 'react-icons/gr';

interface RulesPageProps {
  onNext: () => void;
}

const RulesPage: React.FC<RulesPageProps> = ({ onNext }) => {
  const { t } = useContext(TranslationContext);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: '20px', fontWeight: '300', margin: '0 0 16px 0' }}>
        {t('game.rules').split('\n').map((line, index) => (
          <span key={index}>
            {line}
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
        {t('button.start')}
        <GrLinkNext />
      </Button>
    </div>
  );
};

export default RulesPage;