"use client";

import { useState, useRef } from 'react';
import styles from '../styles/page.module.css';
import Header from '../components/Header';
import TitleInput from '../components/TitleInput';
import ContentArea from '../components/ContentArea';
import { stripMarkdown, insertTextAtCursor } from '../utils';

export default function Home() {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const titleEditableRef = useRef<HTMLDivElement>(null);
  const [scrollShadowVisible, setScrollShadowVisible] = useState(false);

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
    window.location.href = `/pastes/${data.id}`;
  };

  // Handle content changes in the contentEditable div
  const handleContentChange = () => {
    if (contentEditableRef.current) {
      setContent(contentEditableRef.current.innerText);
    }
  };

  // Handle title changes
  const handleTitleChange = () => {
    if (titleEditableRef.current) {
      setTitle(titleEditableRef.current.innerText);
    }
  };

  // Handle scroll shadow
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollShadowVisible(target.scrollTop > 0);
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    insertTextAtCursor(text);
  };

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle tab in content area
    if (e.key === 'Tab') {
      e.preventDefault();
      insertTextAtCursor('    ');
    }

    // Prevent default formatting shortcuts
    if (
      (e.ctrlKey || e.metaKey) &&
      ['b', 'i', 'u'].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
    }
  };

  // Prevent drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
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
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={styles.contentWrapper}>
          {/* Title */}
          <TitleInput
            title={title}
            titleEditableRef={titleEditableRef}
            handleTitleChange={handleTitleChange}
            handlePaste={handlePaste}
          />

          {/* Content Area */}
          <ContentArea
            contentEditableRef={contentEditableRef}
            handleContentChange={handleContentChange}
            handlePaste={handlePaste}
            handleKeyDown={handleKeyDown}
            viewMode={viewMode}
            content={content}
          />
        </div>
      </div>
    </div>
  );
}