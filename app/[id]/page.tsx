"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import PasteHeader from '../../components/PasteHeader';
import TitleInput from '../../components/TitleInput';
import ContentArea from '../../components/ContentArea';
import ScrollContainer from '../../components/ScrollContainer';
import styles from '../../styles/page.module.css';

// Helper function to sanitize the title for the browser tab
const sanitizeTitleForTab = (title: string) => {
  if (!title || typeof title !== 'string') {
    return "Untitled Note"; // Fallback if title is invalid
  }
  
  // Replace characters not allowed in the browser tab title, if any
  const sanitizedTitle = title.replace(/[^a-zA-Z0-9\s\-_\(\)]+/g, '');
  
  // Fallback if the sanitized title is empty
  return sanitizedTitle.trim() || 'Untitled Note';
};

export default function Paste() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const titleEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchContent() {
      if (id) {
        try {
          const response = await fetch(`/api/getPaste?id=${id}`);
          const data = await response.json();

          if (response.ok) {
            setTitle(data.title);
            setContent(data.content);
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

  return (
    <div className={styles.pageContainer}>
      <PasteHeader
        isPastePage={true}
        handleCopy={handleCopy}
        isCopied={isCopied}
      />
      <ScrollContainer>
        <div className={styles.contentWrapper}>
          <TitleInput
            initialTitle={loading ? "" : title}
            titleEditableRef={titleEditableRef}
            isEditable={false} // Non-editable in the paste page
          />
          <ContentArea
            content={loading ? "" : content}
            isEditable={false} // Paste page should not be editable
          />
        </div>
      </ScrollContainer>
    </div>
  );
}
