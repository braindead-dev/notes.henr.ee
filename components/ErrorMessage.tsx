import React, { useState, useEffect } from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Reset the fadeIn state whenever a new message appears
    setFadeIn(false);
    
    // Ensure the fade-in starts after the reset
    const fadeInStart = setTimeout(() => {
      setFadeIn(true);
    }, 10); // Short delay to ensure state resets and triggers the fade-in animation

    // Show the message
    setVisible(true);

    // Hide the message after 1.5 seconds
    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
      setFadeIn(false); // Reset for future messages
    }, 2000);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(fadeInStart);
      clearTimeout(fadeOutTimer);
    };
  }, [message]);

  return (
    <div
      style={{
        position: 'fixed',
        top: visible ? '10px' : '0px', // Slight movement on fade-in and fade-out
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff1f0CC',
        color: '#ED4337',
        zIndex: 1000,
        padding: '8px 12px',
        border: '1.5px solid #ED4337',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        opacity: fadeIn ? 1 : 0, // Control fade-in and fade-out with the state
        transition: 'opacity 0.4s ease, top 0.4s ease', // Smooth transition for both opacity and position
      }}
      role="alert"
    >
      {/* SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '24px', height: '24px', marginRight: '10px' }}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M2.20164 18.4695L10.1643 4.00506C10.9021 2.66498 13.0979 2.66498 13.8357 4.00506L21.7984 18.4695C22.4443 19.6428 21.4598 21 19.9627 21H4.0373C2.54022 21 1.55571 19.6428 2.20164 18.4695Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
        />
        <path
          d="M12 9V13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 17.0195V17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {message}
    </div>
  );
};

export default ErrorMessage;
