import React, { useState, useRef, useEffect } from 'react';

type HoldButtonProps = {
  onClick: () => void;
  holdTime?: number; // in milliseconds
  children?: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
};

const HoldButton: React.FC<HoldButtonProps> = ({ onClick, holdTime = 1000, children, style, disabled }) => {
  const [progress, setProgress] = useState<number>(0);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);
  const isHoldingRef = useRef<boolean>(false);

  const startProgress = () => {
    if (isHoldingRef.current) return; // Prevent multiple starts
    isHoldingRef.current = true;
    startTimeRef.current = Date.now();

    const tick = () => {
      if (!isHoldingRef.current || startTimeRef.current === null) return;

      const now = Date.now();
      const elapsed = elapsedRef.current + (now - (startTimeRef.current || now));
      const newProgress = Math.min((elapsed / holdTime) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= holdTime) {
        setProgress(100);
        onClick();
        cancelProgress();
        return;
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
  };

  const cancelProgress = () => {
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
    }
    isHoldingRef.current = false;
    elapsedRef.current = 0;
    setProgress(0);
    startTimeRef.current = null;
  };

  const pauseProgress = () => {
    if (isHoldingRef.current && startTimeRef.current !== null) {
      const now = Date.now();
      elapsedRef.current += now - startTimeRef.current;
      cancelAnimationFrame(requestRef.current!);
      startTimeRef.current = null;
    }
  };

  const resumeProgress = () => {
    if (isHoldingRef.current && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(() => startProgress());
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      pauseProgress();
    } else {
      resumeProgress();
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelProgress();
    };
  }, []);

  const handleMouseDown = () => {
    startProgress();
  };

  const handleMouseUp = () => {
    cancelProgress();
  };

  const handleMouseLeave = () => {
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

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      disabled={disabled}
      style={{position: 'relative', padding: '10px 20px', ...style}}
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
