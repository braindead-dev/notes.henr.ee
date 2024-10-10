"use client";

import { useEffect, useRef } from 'react';
import PageHeader from '../../components/PageHeader';
import TitleInput from '../../components/TitleInput';
import ContentArea from '../../components/ContentArea';
import ScrollContainer from '../../components/ScrollContainer';
import styles from '../../styles/page.module.css';
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
      <PageHeader/>
      <ScrollContainer>
        <div className={styles.contentWrapper}>
          <TitleInput
            initialTitle={title}
            titleEditableRef={titleEditableRef}
            isEditable={false} 
          />
          <ContentArea
            content={content}
            isEditable={false} 
          />
        </div>
      </ScrollContainer>
    </div>
  );
}