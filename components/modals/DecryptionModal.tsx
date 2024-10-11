import React from 'react';
import styles from '../../styles/page.module.css';
import ErrorMessage from '../ErrorMessage';  // Import ErrorMessage

interface DecryptionModalProps {
  encryptionKey: string;
  setEncryptionKey: (key: string) => void;
  onClose: () => void;
  handleDecryption: () => void;
  decryptionError: string;
}

const DecryptionModal: React.FC<DecryptionModalProps> = ({
  encryptionKey,
  setEncryptionKey,
  onClose,
  handleDecryption,
  decryptionError,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Enter Encryption Key</h2>
        <p>Please enter the encryption key to view the content of this paste.</p>
        <div className={styles.keyContainer}>
          <input
            type="password"
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
            className={styles.inputField}  // Add this class to style the input if needed
            placeholder="Encryption Key"
          />
        </div>
        {/* Render the ErrorMessage component if there's a decryption error */}
        {decryptionError && <ErrorMessage message={decryptionError} />}
        <div className={styles.modalActions}>
          <button className={styles.publishButton} onClick={handleDecryption}>
            Decrypt
          </button>
          <button className={styles.toggleButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecryptionModal;
