import React from 'react';
import styles from '../../styles/page.module.css';

interface CopyButtonProps {
  handleCopy?: () => void;
  isCopied?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({ handleCopy, isCopied }) => (
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
);

export default CopyButton;
