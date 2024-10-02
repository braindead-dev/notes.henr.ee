"use client";

import { useState, useRef } from 'react';
import styles from '../styles/page.module.css';
import Header from '../components/Header';
import TitleInput from '../components/TitleInput';
import ContentArea from '../components/ContentArea';
import { stripMarkdown } from '../utils';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);
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

  // Generalized function to handle changes in contentEditable elements
  const handleEditableChange = (
    ref: React.RefObject<HTMLDivElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (ref.current) {
      setState(ref.current.innerText);
    }
  };

  const handleContentChange = () => {
    handleEditableChange(contentEditableRef, setContent);
  };

  const handleTitleChange = () => {
    handleEditableChange(titleEditableRef, setTitle);
  };

  // Handle scroll shadow
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollShadowVisible(target.scrollTop > 0);
  };

  // General preventDefault function
  const preventDefault = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.pageContainer}>
      {/* Fixed Header */}
      <Header
        scrollShadowVisible={scrollShadowVisible}
        handleSubmit={handleSubmit}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Scrollable Editor Container */}
      <div
        className={styles.editorContainer}
        onScroll={handleScroll}
        onDragOver={preventDefault}
        onDrop={preventDefault}
      >
        <div className={styles.contentWrapper}>
          {/* Title */}
          <TitleInput
            title={title}
            titleEditableRef={titleEditableRef}
            handleTitleChange={handleTitleChange}
          />

          {/* Content Area */}
          <ContentArea
            contentEditableRef={contentEditableRef}
            handleContentChange={handleContentChange}
            viewMode={viewMode}
            content={content}
          />
        </div>
      </div>
    </div>
  );
}
