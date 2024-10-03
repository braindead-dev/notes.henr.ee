"use client"; // Marks the file as a Client Component

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // useParams to get the dynamic ID
import { CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Paste() {
  const { id } = useParams(); // Get the dynamic ID from the route
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true); // Loading state to help debug
  const [isCopied, setIsCopied] = useState(false); // Track copy status

  useEffect(() => {
    async function fetchContent() {
      if (id) {
        try {
          const response = await fetch(`/api/getPaste?id=${id}`);
          const data = await response.json();

          if (response.ok) {
            setTitle(data.title); // Set the title
            setContent(data.content); // Set content to the state
          } else {
            setContent("Error: Paste not found.");
          }
        } catch {
          setContent("Error: Unable to fetch paste.");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchContent();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`# ${title}\n\n${content}`);
    setIsCopied(true);

    // Reset the button after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  if (loading) {
    return <div>Loading...</div>; // Simple loading message
  }

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerButtons}>
          <button
            style={{
              ...styles.copyButton,
              backgroundColor: isCopied ? '#008001' : '#222222',
              border: isCopied ? "2px solid #439443" : '2px solid #545454',
            }}
            onClick={handleCopy}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        readOnly
        style={styles.titleInput}
      />

      {/* Content Area */}
      <div style={styles.markdownView}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// Styles
const maxTextWidth = 800;
const columnDirection = "column";
const boldFontWeight = "bold";
const preWrapStyle = "pre-wrap";

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column" as CSSProperties["flexDirection"], // Casting flexDirection
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#fff",
    padding: "0 20px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "flex-end", // Keep button on the right
    width: "100%",
    maxWidth: `${maxTextWidth}px`, // Max width for the header area
    padding: "10px 0 8px 0", // Reduced vertical space between the header and title
  },
  headerButtons: {
    display: "flex",
    gap: "10px",
  },
  copyButton: {
    backgroundColor: "#222222",
    color: "#fff",
    borderRadius: "6px", // Less rounded
    border: "2px solid #545454",
    padding: "5px 10px", // Smaller padding to reduce negative space
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s", // Smooth transition for color change
  },
  titleInput: {
    fontSize: "32px",
    fontWeight: boldFontWeight,
    margin: "10px 0", // Reduced space between title and body text
    padding: "0", 
    border: "none",
    outline: "none",
    width: "100%",
    maxWidth: `${maxTextWidth}px`,
  },
  markdownView: {
    flex: 1,
    fontSize: "18px",
    padding: "5px 0", 
    transform: "translateY(-18px)",
    whiteSpace: preWrapStyle, 
    width: "100%",
    maxWidth: `${maxTextWidth}px`,
  },
};
