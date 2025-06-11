// components/modals/DecryptionModal.tsx

import React from "react";
import styles from "@/styles/page.module.css";
import ErrorMessage from "@/components/ErrorMessage";

interface DecryptionModalProps {
  encryptionKey: string;
  setEncryptionKey: (key: string) => void;
  onClose: () => void;
  handleDecryption: () => void;
  decryptionError: { message: string; id: number } | null;
  encryptionMethod: "key" | "password" | null;
}

const DecryptionModal: React.FC<DecryptionModalProps> = ({
  encryptionKey,
  setEncryptionKey,
  onClose,
  handleDecryption,
  decryptionError,
  encryptionMethod,
}) => {
  const isPasswordBased = encryptionMethod === "password";

  const handleOverlayClick = () => {
    onClose(); // Close the modal without proceeding
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        <h2 className={styles.modalTitle}>
          {isPasswordBased ? "Enter Password" : "Enter Encryption Key"}
        </h2>
        <p>
          {isPasswordBased
            ? "A password is required to decrypt this paste."
            : "An encryption key is required to decrypt this paste."}
        </p>
        <input
          type="password"
          value={encryptionKey}
          onChange={(e) => setEncryptionKey(e.target.value)}
          className={styles.modalInput}
          style={{ border: 0 }}
          placeholder={
            isPasswordBased ? "Enter password..." : "Enter encryption key..."
          }
        />
        {decryptionError && (
          <ErrorMessage
            key={decryptionError.id}
            message={decryptionError.message}
          />
        )}
        <div className={styles.modalActionsRight}>
          <button className={styles.toggleButton} onClick={onClose}>
            Close
          </button>
          <button className={styles.publishButton} onClick={handleDecryption}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecryptionModal;
