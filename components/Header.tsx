import React from 'react';
import styles from '../styles/page.module.css';
import PasteButton from './buttons/PasteButton';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className={styles.fixedHeader}>
      <div className={styles.headerButtons}>
        <PasteButton />
      </div>
    </div>
  );
};

export default Header;
