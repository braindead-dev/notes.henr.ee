import React, { useState } from 'react';
import styles from '@/styles/RefreshButton.module.css';

interface RefreshButtonProps {
  onClick: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    setIsSpinning(true);
    onClick();

    setTimeout(() => setIsSpinning(false), 250);
  };

  return (
    <button className={styles.iconButton} onClick={handleClick} title="Regenerate Key">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${styles.icon} ${isSpinning ? styles.spin : ''}`}
        width="24px"
        height="24px"
      >
        <path d="M12,4V1L8,5l4,4V6c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,4,12,4z" />
      </svg>
    </button>
  );
};

export default RefreshButton;
