// components/DecryptionKeyModal.tsx

import React from 'react';
import styles from '../../styles/page.module.css';
import ErrorMessage from '../ErrorMessage';

interface DecryptionModalProps {
  encryptionKey: string;
  setEncryptionKey: (key: string) => void;
  onClose: () => void;
  handleDecryption: () => void;
  decryptionError: string;
  encryptionMethod: 'key' | 'password' | null;
}

const DecryptionModal: React.FC<DecryptionModalProps> = ({
  encryptionKey,
  setEncryptionKey,
  onClose,
  handleDecryption,
  decryptionError,
  encryptionMethod,
}) => {
  const isPasswordBased = encryptionMethod === 'password';

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{isPasswordBased ? 'Enter Password' : 'Enter Encryption Key'}</h2>
        <p>{isPasswordBased ? 'A password is required to decrypt this paste.' : 'An encryption key is required to decrypt this paste.'}</p>
        <input
          type="password"
          value={encryptionKey}
          onChange={(e) => setEncryptionKey(e.target.value)}
          className={styles.modalInput}
          style={{ border: 0 }}
          placeholder={isPasswordBased ? 'Enter password...' : 'Enter encryption key...'}
        />
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
