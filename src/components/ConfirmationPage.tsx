import React from 'react';
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import Button from '@mui/material/Button';

interface ConfirmationPageProps {
  onConfirm: (confirmed: boolean) => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ onConfirm }) => {
  return (
    <div className="confirmation">
      <h2>Sure?</h2>
      <div className="controls">
        <Button variant='contained' color='inherit' onClick={() => onConfirm(false)}>
          <GrLinkPrevious />
        </Button>
        <Button variant="contained" color='success' onClick={() => onConfirm(true)}>
          <GrLinkNext />
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
