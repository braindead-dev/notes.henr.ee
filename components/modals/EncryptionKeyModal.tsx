// components/EncryptionKeyModal.tsx
import React, { useState } from 'react';
import styles from '../../styles/page.module.css';
import CopyButton from '../buttons/CopyButton';

interface EncryptionKeyModalProps {
  encryptionKey: string;
  onClose: () => void;
}

const EncryptionKeyModal: React.FC<EncryptionKeyModalProps> = ({ 
  encryptionKey, 
  onClose,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(encryptionKey);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Encryption Key</h2>
        <p>Save this key securely. Without it, you won't be able to access your encrypted paste.</p>
        <div className={styles.keyContainer}>
          <code>{encryptionKey}</code>
        </div>
        <div className={styles.modalActions}>
          <CopyButton handleCopy={handleCopy} isCopied={isCopied} />
          <button className={styles.toggleButton} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EncryptionKeyModal;
