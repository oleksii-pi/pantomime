import React from 'react';
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";

interface ConfirmationPageProps {
  onConfirm: (confirmed: boolean) => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ onConfirm }) => {
  return (
    <div className="confirmation">
      <h2>Sure?</h2>
      <div className="controls">
        <button onClick={() => onConfirm(false)}>
          <GrLinkPrevious color='gray' />
        </button>
        <button onClick={() => onConfirm(true)}>
          <GrLinkNext color='green' />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
