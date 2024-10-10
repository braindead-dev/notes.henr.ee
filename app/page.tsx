"use client";

import { useRef } from 'react';
import TitleInput from '../components/TitleInput';
import ContentArea from '../components/ContentArea';
import PageHeader from '../components/PageHeader';
import ScrollContainer from '../components/ScrollContainer';
import styles from '../styles/page.module.css';
import { pageTitle, pageContent } from './pageContent'; 


export default function Paste() {
  const titleEditableRef = useRef<HTMLDivElement>(null);
  const title = pageTitle;
  const content = pageContent;

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
