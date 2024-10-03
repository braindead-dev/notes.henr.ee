import React from 'react';
import styles from '../styles/page.module.css';

interface HeaderProps {
  handleSubmit?: (e: React.FormEvent) => void;
  viewMode?: boolean;
  setViewMode?: React.Dispatch<React.SetStateAction<boolean>>;
  isPastePage: boolean;
  handleCopy?: () => void;
  isCopied?: boolean;
  scrollShadowVisible: boolean; // Add scrollShadowVisible to the props
}

const Header: React.FC<HeaderProps> = ({
  handleSubmit,
  viewMode,
  setViewMode,
  isPastePage,
  handleCopy,
  isCopied,
  scrollShadowVisible,
}) => {
  if (isPastePage) {
    // Paste page header (copy button)
    return (
      <div
        className={`${styles.fixedHeader} ${
          scrollShadowVisible ? styles.fixedHeaderShadow : ''
        }`}
      >
        <div className={styles.headerButtons}>
          <button
            className={styles.publishButton}
            style={{
              backgroundColor: isCopied ? '#008001' : '#222222',
              border: isCopied ? '2px solid #439443' : '2px solid #545454',
            }}
            onClick={handleCopy}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    );
  }

  // Main/editing page header (publish and view/edit toggle buttons)
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
          onClick={() => setViewMode && setViewMode(!viewMode)}
        >
          {viewMode ? 'Edit' : 'View'}
        </button>
      </div>
    </div>
  );
};

export default Header;
