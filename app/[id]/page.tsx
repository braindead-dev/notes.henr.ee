// [id]/page.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { decryptContent } from '../../utils/cryptoUtils';
import DecryptionModal from '../../components/modals/DecryptionModal';
import PasteHeader from '../../components/PasteHeader';
import TitleInput from '../../components/TitleInput';
import ContentArea from '../../components/ContentArea';
import ScrollContainer from '../../components/ScrollContainer';
import styles from '../../styles/page.module.css';

// Helper function to sanitize the title for the browser tab
const sanitizeTitleForTab = (title: string) => {
  if (!title || typeof title !== 'string') {
    return "Henry's Notes"; // Fallback if title is invalid
  }

  // Replace characters not allowed in the browser tab title, if any
  const sanitizedTitle = title.replace(/[^a-zA-Z0-9\s\-_\(\)]+/g, '');

  // Fallback if the sanitized title is empty
  return sanitizedTitle.trim() || "Henry's Notes";
};

export default function Paste() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('```\nLoading...\n```');
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [encryptionMethod, setEncryptionMethod] = useState<'key' | 'password' | null>(null);
  const [needsDecryption, setNeedsDecryption] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [decryptionError, setDecryptionError] = useState('');
  const [showDecryptionModal, setShowDecryptionModal] = useState(false);
  const titleEditableRef = useRef<HTMLDivElement>(null);

  const toggleEncryption = () => {
    // No action needed here
  };

  useEffect(() => {
    async function fetchContent() {
      if (id) {
        try {
          const response = await fetch(`/api/getPaste?id=${id}`);
          const data = await response.json();

          if (response.ok) {
            setTitle(data.title);
            setIsEncrypted(data.isEncrypted);
            setEncryptionMethod(data.encryptionMethod);
            if (data.isEncrypted) {
              setNeedsDecryption(true);
              setShowDecryptionModal(true);
              setContent(data.content);
            } else {
              setContent(data.content);
            }
          } else {
            // Handle error based on the response status and message
            setTitle("Error");
            setContent(`\`\`\`\n${response.status}: ${data.error || "```\n500: We were unable to fetch this paste.\n```"}\n\`\`\``);
          }
        } catch (error) {
          // Catch any network or unexpected errors
          setTitle("Error");
          setContent("```\n500: We were unable to fetch this paste.\n```");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchContent();
  }, [id]);

  useEffect(() => {
    // Update the document title whenever the title state changes
    const sanitizedTitle = sanitizeTitleForTab(title);
    document.title = sanitizedTitle;
  }, [title]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`# ${title}\n\n${content}`);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleDecryption = async () => {
    setDecryptionError('');

    try {
      const decryptedContent = await decryptContent(content, encryptionKey);
      setContent(decryptedContent);
      setNeedsDecryption(false);
      setShowDecryptionModal(false);
      setDecryptionError('');
    } catch (error) {
      setDecryptionError('Invalid encryption key/password or corrupted data.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PasteHeader
        isPastePage={true}
        handleCopy={handleCopy}
        isCopied={isCopied}
        isEncrypted={isEncrypted}  // REMOVE LATER: ASAP
        toggleEncryption={toggleEncryption}  // REMOVE LATER: ASAP, FIX FIX FIX
      />
      <ScrollContainer>
        <div className={styles.contentWrapper}>
          <TitleInput
            initialTitle={loading ? "" : title}
            titleEditableRef={titleEditableRef}
            isEditable={false} // Non-editable in the paste page
          />

          <ContentArea
            content={
              !needsDecryption
                ? loading
                  ? ''
                  : content
                : encryptionMethod === 'password'
                ? `\`\`\`\nThis paste is AES-256 encrypted with PBKDF2. \n\nTo re-prompt password input, refresh this page.\n\nEncrypted Content:\n${content}\n\`\`\``
                : `\`\`\`\nThis paste is AES-256 encrypted. \n\nTo re-prompt decryption key input, refresh this page.\n\nEncrypted Content:\n${content}\n\`\`\``
            }
            isEditable={false}
          />

        </div>
      </ScrollContainer>

      {showDecryptionModal && (
        <DecryptionModal
          encryptionKey={encryptionKey}
          setEncryptionKey={setEncryptionKey}
          onClose={() => setShowDecryptionModal(false)}
          handleDecryption={handleDecryption}
          decryptionError={decryptionError}
          encryptionMethod={encryptionMethod}
        />
      )}
    </div>
  );
}