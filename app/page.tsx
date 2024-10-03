// page.tsx
"use client";

import { useState, useRef } from 'react';
import styles from '../styles/page.module.css';
import Header from '../components/Header';
import TitleInput from '../components/TitleInput';
import ContentArea from '../components/ContentArea';
import ScrollContainer from '../components/ScrollContainer';
import { stripMarkdown } from '../utils';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const titleEditableRef = useRef<HTMLDivElement>(null);
  const [scrollShadowVisible, setScrollShadowVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/paste', {
      method: 'POST',
      body: JSON.stringify({
        title: stripMarkdown(title),
        content,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    router.push(`/pastes/${data.id}`);
  };

  const handleEditableChange = (
    ref: React.RefObject<HTMLDivElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (ref.current) {
      setState(ref.current.innerText);
    }
  };

  const handleTitleChange = () => {
    handleEditableChange(titleEditableRef, setTitle);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  return (
    <div className={styles.pageContainer}>
      <Header
        handleSubmit={handleSubmit}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isPastePage={false} 
        scrollShadowVisible={scrollShadowVisible} // Pass shadow visibility
      />
      <ScrollContainer handleScrollShadow={setScrollShadowVisible}>
        <div className={styles.contentWrapper}>
          <TitleInput
            title={title}
            titleEditableRef={titleEditableRef}
            handleTitleChange={handleTitleChange}
            isEditable={true}
          />
          <ContentArea
            handleContentChange={handleContentChange}
            viewMode={viewMode}
            content={content}
            isEditable={true}
          />
        </div>
      </ScrollContainer>
    </div>
  );
}
