import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/page.module.css';

interface ContentAreaProps {
  contentEditableRef: React.RefObject<HTMLDivElement>;
  handleContentChange: () => void;
  handlePaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  viewMode: boolean;
  content: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({
  contentEditableRef,
  handleContentChange,
  handlePaste,
  handleKeyDown,
  viewMode,
  content,
}) => {
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
      suppressContentEditableWarning={true}
    />
  );
};

export default ContentArea;
