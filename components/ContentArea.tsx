import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/page.module.css';
import { insertTextAtCursor } from '../utils';

interface ContentAreaProps {
  contentEditableRef: React.RefObject<HTMLDivElement>;
  handleContentChange: () => void;
  viewMode: boolean;
  content: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  contentEditableRef,
  handleContentChange,
  viewMode,
  content,
}) => {
  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    insertTextAtCursor(text);
    handleContentChange(); // Update the content state
  };

  // Handle drop events
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text/plain');
    insertTextAtCursor(text);
    handleContentChange(); // Update the content state
  };

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle tab in content area
    if (e.key === 'Tab') {
      e.preventDefault();
      insertTextAtCursor('    ');
      handleContentChange(); // Update the content state
    }

    // Prevent default formatting shortcuts
    if (
      (e.ctrlKey || e.metaKey) &&
      ['b', 'i', 'u'].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
    }
  };

  return viewMode ? (
    <div className={styles.markdownView}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || ''}
      </ReactMarkdown>
    </div>
  ) : (
    <div
      ref={contentEditableRef}
      contentEditable
      className={styles.contentEditable}
      onInput={handleContentChange}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onDrop={handleDrop} // Add this line
      suppressContentEditableWarning={true}
    />
  );
};

export default ContentArea;
