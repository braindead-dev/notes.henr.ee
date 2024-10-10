import React from 'react';
import styles from '../../styles/page.module.css';

const PasteButton: React.FC = () => {
  const handleRedirect = () => {
    window.location.href = '/paste'; 
  };

  return (
    <button className={styles.publishButton} onClick={handleRedirect}>
      Paste
    </button>
  );
};

export default PasteButton;
