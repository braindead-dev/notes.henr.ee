// paste/page.tsx

"use client";

import { useState, useRef } from 'react';
import styles from '../../styles/page.module.css';
import PasteHeader from '../../components/PasteHeader';
import TitleInput from '../../components/TitleInput';
import ContentArea from '../../components/ContentArea';
import ScrollContainer from '../../components/ScrollContainer';
import { useRouter } from 'next/navigation';
import {
  generateEncryptionKey,
  encryptContentWithKey,
  encryptContentWithPassword,
} from '../../utils/cryptoUtils';
import ErrorMessage from '../../components/ErrorMessage';
import EncryptionKeyModal from '../../components/modals/EncryptionKeyModal';

export default function Home() {
  const [title, setTitle] = useState("Untitled");
  const [content, setContent] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [error, setError] = useState<{ message: string; id: number } | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const [showEncryptionModal, setShowEncryptionModal] = useState(false);
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

    // Ensure the title is updated from the editable div
    if (titleEditableRef.current) {
      setTitle(titleEditableRef.current.innerText);
    }

    // Check if the content is empty
    if (content.trim() === '') {
      setError({ message: 'Invalid content. Content cannot be empty.', id: Date.now() });
      return;
    }

    if (isEncrypted) {
      // Show modal to choose encryption method
      setShowEncryptionModal(true);
    } else {
      // Proceed to publish without encryption
      await publishPaste();
    }
  };

  // Function to regenerate encryption key
  const regenerateKey = () => {
    const key = generateEncryptionKey();
    setEncryptionKey(key);
  };

  // Function to handle closing the modal and proceeding with publishing
  const handleCloseModal = async ({ method, key }: { method: 'key' | 'password'; key: string }) => {
    setShowEncryptionModal(false);
    await publishPaste(key, method);
  };

  // Function to publish the paste
  const publishPaste = async (key?: string, method?: 'key' | 'password') => {
    let contentToSend = content;

    try {
      if (isEncrypted) {
        if (method === 'password' && key) {
          // Encrypt with password-derived key
          contentToSend = await encryptContentWithPassword(content, key);
        } else if (key) {
          // Encrypt with generated key
          contentToSend = await encryptContentWithKey(content, key);
        } else {
          throw new Error('Encryption key is missing.');
        }
      }

      const response = await fetch('/api/paste', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
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

      // Redirect to the new paste page using the generated ID
      router.push(`/${data.id}`);
    } catch (err: any) {
      setError({ message: err.message, id: Date.now() });
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
      {error && <ErrorMessage key={error.id} message={error.message} />}

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
        <EncryptionKeyModal
          encryptionKey={encryptionKey}
          onClose={handleCloseModal}
          regenerateKey={regenerateKey}
        />
      )}
    </div>
  );
}