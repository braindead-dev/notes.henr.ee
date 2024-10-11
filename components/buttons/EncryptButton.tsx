// components/buttons/EncryptButton.tsx
import React from 'react';
import LockIcon from '../../app/assets/svg/lock.svg';
import styles from '../../styles/page.module.css';

interface EncryptButtonProps {
  isEncrypted: boolean;
  toggleEncryption: () => void;
}

const EncryptButton: React.FC<EncryptButtonProps> = ({ isEncrypted, toggleEncryption }) => {
  return (
    <button
      onClick={toggleEncryption}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <LockIcon className={isEncrypted ? styles.greenIcon : styles.greyIcon} />
    </button>
  );
};

export default EncryptButton;
