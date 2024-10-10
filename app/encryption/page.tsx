"use client";

import { useEffect, useRef } from 'react';
import TitleInput from '../../components/TitleInput';
import ContentArea from '../../components/ContentArea';
import ScrollContainer from '../../components/ScrollContainer';
import styles from '../../styles/page.module.css';
import '../../styles/markdownStyles.css';
import { pageTitle, pageContent } from './pageContent'; 


export default function Paste() {
  const titleEditableRef = useRef<HTMLDivElement>(null);

  const title = pageTitle;
  const content = pageContent;

  useEffect(() => {
    document.title = title;
  });

  return (
    <div className={styles.pageContainer}>
      <ScrollContainer>
        <div className={styles.contentWrapper}>
          <TitleInput
            initialTitle={title}
            titleEditableRef={titleEditableRef}
            isEditable={false} // Non-editable in the paste page
          />
          <ContentArea
            content={content}
            isEditable={false} // Paste page should not be editable
          />
        </div>
      </ScrollContainer>
    </div>
  );
}
