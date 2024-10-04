"use client";

import { useState, useRef } from 'react';
import styles from '../styles/page.module.css';
import Header from '../components/Header';
import TitleInput from '../components/TitleInput';
import ContentArea from '../components/ContentArea';
import ScrollContainer from '../components/ScrollContainer';
import { stripMarkdown } from '../utils';
import { useRouter } from 'next/navigation';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to track error
  const titleEditableRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before submitting

    try {
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

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Redirect to the new paste page using the slug-based ID
      router.push(`/${data.id}`);
    } catch (err: any) {
      setError(err.message); // Set the error message to be displayed
    }
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
      {error && <ErrorMessage message={error} />}

      <Header
        handleSubmit={handleSubmit}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isPastePage={false}
      />

      <ScrollContainer>
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
