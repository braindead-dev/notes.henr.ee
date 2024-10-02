import React from 'react';
import styles from '../styles/page.module.css';

interface HeaderProps {
  scrollShadowVisible: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  viewMode: boolean;
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  scrollShadowVisible,
  handleSubmit,
  viewMode,
  setViewMode,
}) => {
  return (
    <div
      className={`${styles.fixedHeader} ${
        scrollShadowVisible ? styles.fixedHeaderShadow : ''
      }`}
    >
      <div className={styles.headerButtons}>
        <button className={styles.publishButton} onClick={handleSubmit}>
          Publish
        </button>
        <button
          className={styles.toggleButton}
          onClick={() => setViewMode(!viewMode)}
        >
          {viewMode ? 'Edit' : 'View'}
        </button>
      </div>
    </div>
  );
};

export default Header;
