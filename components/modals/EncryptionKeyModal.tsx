// components/modals/EncryptionKeyModal.tsx

import React, { useState } from 'react';
import styles from '@/styles/page.module.css';
import CopyButton from '@/components/buttons/CopyButton';
import RefreshButton from '@/components/buttons/RefreshButton';
import ErrorMessage from '@/components/ErrorMessage';

interface EncryptionKeyModalProps {
  encryptionKey: string;
  onClose: (options: { method: 'key' | 'password'; key: string }) => void;
  regenerateKey: () => void;
  onCancel: () => void; // Add this prop
}

const EncryptionKeyModal: React.FC<EncryptionKeyModalProps> = ({
  encryptionKey,
  onClose,
  regenerateKey,
  onCancel, // Add this
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<{ message: string; id: number } | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(encryptionKey);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleUsePassword = () => {
    setUsePassword(true);
  };

  const handleSubmitPassword = () => {
    if (password !== confirmPassword) {
      setPasswordError({ message: 'Passwords do not match.', id: Date.now() });
      return;
    }
    if (password.length === 0) {
      setPasswordError({ message: 'Password cannot be empty.', id: Date.now() });
      return;
    }
    setPasswordError(null);
    onClose({ method: 'password', key: password });
  };

  // Remove handleClose function if it directly calls onClose

  const handleOverlayClick = () => {
    onCancel(); // Close the modal without proceeding
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        {!usePassword ? (
          <>
            <h2 className={styles.modalTitle}>Encryption Key</h2>
            <p>
              Save this key securely. Without it, you won't be able to access your encrypted paste.
            </p>
            <div className={styles.keyContainer}>
              <code>{encryptionKey}</code>
              <RefreshButton onClick={regenerateKey} />
            </div>
            <div className={styles.modalActions}>
              <div className={styles.leftActions}>
                <button className={styles.publishButton} onClick={handleUsePassword}>
                  Set Password
                </button>
              </div>
              <div className={styles.rightActions}>
                <CopyButton handleCopy={handleCopy} isCopied={isCopied} />
                <button
                  className={styles.publishButton}
                  onClick={() => onClose({ method: 'key', key: encryptionKey })}
                >
                  Done
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.modalTitle}>Set Encryption Password</h2>
            <p>Enter a password to encrypt your paste.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.modalInput}
              placeholder="Enter Password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.modalInput}
              placeholder="Confirm Password"
            />
            {passwordError && <ErrorMessage key={passwordError.id} message={passwordError.message} />}
            <div className={styles.modalActionsRight}>
              <button className={styles.toggleButton} onClick={() => setUsePassword(false)}>
                Back
              </button>
              <button className={styles.publishButton} onClick={handleSubmitPassword}>
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EncryptionKeyModal;
