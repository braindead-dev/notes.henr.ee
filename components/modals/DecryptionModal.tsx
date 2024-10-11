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
        <p>An encryption key is required to decrypt this paste.</p>
        <input
            type="password"
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
            className={styles.modalInput}  // Add this class to style the input if needed
            style={{border: 0}}
            placeholder="Paste here..."
        />
        {/* Render the ErrorMessage component if there's a decryption error */}
        {decryptionError && <ErrorMessage message={decryptionError} />}
        <div className={styles.modalActions}>
          <button className={styles.publishButton} onClick={handleDecryption}>
            Submit
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
