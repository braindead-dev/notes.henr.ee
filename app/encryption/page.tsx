"use client";

import { useRef } from 'react';
import PageHeader from '@/components/PageHeader';
import TitleInput from '@/components/TitleInput';
import ContentArea from '@/components/ContentArea';
import ScrollContainer from '@/components/ScrollContainer';
import styles from '@/styles/page.module.css';
import encryptStyles from '@/styles/EncryptButton.module.css';
import { pageTitle, pageContent } from '@/content/encryption'; 

export default function Paste() {
  const titleEditableRef = useRef<HTMLDivElement>(null);

  const title = pageTitle;
  const content = pageContent;


  const greenLock = 
  <label
    className={`${encryptStyles.btnLock} ${encryptStyles.locked}`}
    style={{ cursor: 'default', marginLeft: '0.3em'}}
  >
    <svg width="20" height="20" viewBox="0 0 36 40" style={{ verticalAlign: 'middle', marginTop: '-5px' }}>
      <path className="lockb" d="M27 27C27 34.1797 21.1797 40 14 40C6.8203 40 1 34.1797 1 27C1 19.8203 6.8203 14 14 14C21.1797 14 27 19.8203 27 27ZM15.6298 26.5191C16.4544 25.9845 17 25.056 17 24C17 22.3431 15.6569 21 14 21C12.3431 21 11 22.3431 11 24C11 25.056 11.5456 25.9845 12.3702 26.5191L11 32H17L15.6298 26.5191Z"></path>
      <path className="lock" d="M6 21V10C6 5.58172 9.58172 2 14 2V2C18.4183 2 22 5.58172 22 10V21"></path>
    </svg>
  </label>;

  return (
    <div className={styles.pageContainer}>
      <PageHeader />
      <ScrollContainer>
        <div className={styles.contentWrapper}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <TitleInput
              initialTitle={title}
              titleEditableRef={titleEditableRef}
              isEditable={false}
            />
            
            {greenLock}

          </span>

          <ContentArea
            content={content}
            isEditable={false}
            isInfoPage={true}
          />
        </div>
      </ScrollContainer>
    </div>
  );
}
