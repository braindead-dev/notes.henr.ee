import React, { useState } from 'react';
import LockIcon from '../../app/assets/svg/lock.svg';
import styles from '../../styles/page.module.css';

const EncryptButton: React.FC = () => {
  const [isEncrypted, setIsEncrypted] = useState(false);

  const toggleEncryption = () => {
    setIsEncrypted(!isEncrypted);
  };

  return (
    <button 
      onClick={toggleEncryption}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <LockIcon className={isEncrypted ? styles.greenIcon : styles.greyIcon}/>
    </button>
  );
};

export default EncryptButton;