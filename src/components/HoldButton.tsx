import React, { useState, useRef, useEffect } from 'react';

type HoldButtonProps = {
  onClick: () => void;
  holdTime?: number; // in milliseconds
  children?: React.ReactNode;
  disabled?: boolean;
};

const HoldButton: React.FC<HoldButtonProps> = ({ onClick, holdTime = 1000, children }) => {
  const [progress, setProgress] = useState<number>(0);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startProgress = () => {
    startTimeRef.current = Date.now();

    const tick = () => {
      if (startTimeRef.current !== null) {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min((elapsed / holdTime) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= holdTime) {
          setProgress(100);
          onClick();
          cancelProgress();
          return;
        }
        requestRef.current = requestAnimationFrame(tick);
      }
    };

    requestRef.current = requestAnimationFrame(tick);
  };

  const cancelProgress = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setProgress(0);
    startTimeRef.current = null;
  };

  const handleMouseDown = () => {
    startProgress();
  };

  const handleMouseUp = () => {
    cancelProgress();
  };

  const handleTouchStart = () => {
    startProgress();
  };

  const handleTouchEnd = () => {
    cancelProgress();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      startProgress();
    }
  };

  const handleKeyUp = () => {
    cancelProgress();
  };

  useEffect(() => {
    return () => {
      cancelProgress();
    };
  }, []);

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ position: 'relative', padding: '10px 20px', fontSize: '16px' }}
    >
      {children}
      {progress > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: `${progress}%`,
            height: '4px',
            backgroundColor: '#007BFF',
            transition: 'width 0.1s linear',
          }}
        />
      )}
    </button>
  );
};

export default HoldButton;
