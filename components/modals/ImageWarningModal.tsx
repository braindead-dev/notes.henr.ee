import React from 'react';
import styles from '@/styles/page.module.css';

interface ImageWarningModalProps {
  onClose: () => void;
  onAccept: () => void;
}

const ImageWarningModal: React.FC<ImageWarningModalProps> = ({
  onClose,
  onAccept,
}) => {
  const handleOverlayClick = () => {
    onClose(); // Close the modal without proceeding
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        <h2 className={styles.modalTitle}>Warning: External Images</h2>
        <p>This paste contains external images. Opening these images may expose your IP address to the paste uploader.</p>
        <p>Would you like to proceed?</p>
        <div className={styles.modalActionsRight}>
          <button className={styles.toggleButton} onClick={onClose} style={{ width: '70px' }}>
            Cancel
          </button>
          <button className={styles.publishButton} onClick={onAccept}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageWarningModal; 