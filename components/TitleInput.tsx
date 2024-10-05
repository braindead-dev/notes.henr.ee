// components/TitleInput.tsx

import React, { useEffect, useRef } from 'react';
import styles from '../styles/page.module.css';

interface TitleInputProps {
  initialTitle: string;
  titleEditableRef: React.RefObject<HTMLDivElement>;
  handleTitleChange?: () => void; // Optional for paste pages
  isEditable: boolean; // Determines if the title is editable
}

const TitleInput: React.FC<TitleInputProps> = ({
  initialTitle,
  titleEditableRef,
  handleTitleChange,
  isEditable,
}) => {
  // Handle paste events to ensure only plain text is inserted
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!isEditable) return;
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text); // Insert text at cursor
  };

  // Ref to track if the initial content has been set
  const hasSetInitial = useRef(false);

  useEffect(() => {
    if (!hasSetInitial.current && titleEditableRef.current && isEditable) {
      titleEditableRef.current.innerText = initialTitle;
      hasSetInitial.current = true;
    }
  }, [initialTitle, isEditable, titleEditableRef]);

  if (isEditable) {
    return (
      <div
        ref={titleEditableRef}
        contentEditable
        className={styles.titleInput}
        onInput={handleTitleChange}
        onPaste={handlePaste}
        suppressContentEditableWarning={true}
        spellCheck={false} // Optional: Disable spellcheck for better UX
      ></div>
    );
  }

  // Render title as plain text for non-editable views
  return (
    <div className={styles.titleInput} ref={titleEditableRef}>
      {initialTitle}
    </div>
  );
};

export default TitleInput;
