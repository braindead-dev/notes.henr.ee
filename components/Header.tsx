// components/HeaderShell.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/page.module.css';
import icon from '../app/assets/icon.png'; // Adjust the path if necessary

interface Header {
  children: React.ReactNode;
}

const Header: React.FC<Header> = ({ children }) => {
  return (
    <div className={styles.fixedHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <Link href="/"> 
            <Image
              src={icon}
              alt="Icon"
              className={styles.icon}
              height={26} 
            />
          </Link>
        </div>
        <div className={styles.headerRight}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Header;
