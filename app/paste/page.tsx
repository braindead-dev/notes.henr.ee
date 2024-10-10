// app/page.tsx

"use client";

import { useState, useRef } from 'react';
import styles from '../../styles/page.module.css';
import PasteHeader from '../../components/PasteHeader';
import TitleInput from '../../components/TitleInput';
import ContentArea from '../../components/ContentArea';
import ScrollContainer from '../../components/ScrollContainer';
import { useRouter } from 'next/navigation';
import ErrorMessage from '../../components/ErrorMessage';

export default function Home() {
  const [title, setTitle] = useState("Untitled"); // Initial title
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to track error
  const titleEditableRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before submitting

    // Update title state from the contentEditable div
    if (titleEditableRef.current) {
      setTitle(titleEditableRef.current.innerText);
    }

    try {
      const response = await fetch('/api/paste', {
        method: 'POST',
        body: JSON.stringify({
          title: titleEditableRef.current?.innerText,
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

  const handleTitleChange = () => {
    if (titleEditableRef.current) {
      setTitle(titleEditableRef.current.innerText);
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  return (
    <div className={styles.pageContainer}>
      {error && <ErrorMessage message={error} />}

      <PasteHeader
        handleSubmit={handleSubmit}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isPastePage={false}
      />

      <ScrollContainer>
        <div className={styles.contentWrapper}>
          <TitleInput
            initialTitle="Untitled" // Pass the initial title
            titleEditableRef={titleEditableRef}
            handleTitleChange={handleTitleChange} // Update title state on input
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
