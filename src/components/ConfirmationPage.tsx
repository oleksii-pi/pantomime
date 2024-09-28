import React, { useContext } from 'react';
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import Button from '@mui/material/Button';
import TranslationContext from '../TranslationContext';

interface ConfirmationPageProps {
  onConfirm: (confirmed: boolean) => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ onConfirm }) => {
  const { t } = useContext(TranslationContext);
  return (
    <div className="confirmation">
      <h2>{t("confirmation.sure")}</h2>
      <div className="controls">
        <Button variant='contained' color='inherit' onClick={() => onConfirm(false)}>
          <GrLinkPrevious />
          {t('button.back')}
        </Button>
        <Button variant="contained" color="secondary" onClick={() => onConfirm(true)}>
          {t('button.yes')}
          <GrLinkNext />
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
