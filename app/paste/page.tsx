"use client";

import { useState, useRef } from 'react';
import styles from '../../styles/page.module.css';
import PasteHeader from '../../components/PasteHeader';
import TitleInput from '../../components/TitleInput';
import ContentArea from '../../components/ContentArea';
import ScrollContainer from '../../components/ScrollContainer';
import { useRouter } from 'next/navigation';
import { generateEncryptionKey, encryptContent } from '../../utils/cryptoUtils';
import ErrorMessage from '../../components/ErrorMessage';
import EncryptionKeyModal from '../../components/modals/EncryptionKeyModal';  

export default function Home() {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [showEncryptionModal, setShowEncryptionModal] = useState(false);
  const [pasteId, setPasteId] = useState<string | null>(null); // Track the paste ID for redirection
  const titleEditableRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Toggle encryption
  const toggleEncryption = () => {
    const newIsEncrypted = !isEncrypted;
    setIsEncrypted(newIsEncrypted);

    if (newIsEncrypted) {
      const key = generateEncryptionKey();
      setEncryptionKey(key);
    } else {
      setEncryptionKey(null);
    }
  };

  // Handle paste submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (titleEditableRef.current) {
      setTitle(titleEditableRef.current.innerText);
    }

    let contentToSend = content;
    if (isEncrypted && encryptionKey) {
      contentToSend = await encryptContent(content, encryptionKey);
    }

    try {
      const response = await fetch('/api/paste', {
        method: 'POST',
        body: JSON.stringify({
          title: titleEditableRef.current?.innerText,
          content: contentToSend,
          isEncrypted,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store the paste ID but don't redirect yet
      setPasteId(data.id);

      // If encryption is enabled, show the modal before redirecting
      if (isEncrypted && encryptionKey) {
        setShowEncryptionModal(true);
      } else {
        // Redirect if not encrypted
        router.push(`/${data.id}`);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Close modal and redirect
  const handleCloseModal = () => {
    setShowEncryptionModal(false);
    if (pasteId) {
      router.push(`/${pasteId}`);
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
      {error && <ErrorMessage message={error} />}  {/* Display error message if any */}

      <PasteHeader
        handleSubmit={handleSubmit}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isPastePage={false}
        isEncrypted={isEncrypted}
        toggleEncryption={toggleEncryption}
      />

      <ScrollContainer>
        <div className={styles.contentWrapper}>
          <TitleInput
            initialTitle={title}
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

      {showEncryptionModal && encryptionKey && (
        <EncryptionKeyModal encryptionKey={encryptionKey} onClose={handleCloseModal} />
      )}
    </div>
  );
}
