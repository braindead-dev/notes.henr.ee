import React from 'react';
import styles from '../styles/page.module.css';

interface TitleInputProps {
  title: string;
  titleEditableRef: React.RefObject<HTMLDivElement>;
  handleTitleChange?: () => void; // Make it optional for paste pages
  isEditable: boolean; // New prop to determine if the title is editable
}

const TitleInput: React.FC<TitleInputProps> = ({
  title,
  titleEditableRef,
  handleTitleChange,
  isEditable,
}) => {
  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!isEditable) return;
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text); // Insert the text at the cursor
  };

  if (isEditable) {
    return (
      <div
        ref={titleEditableRef}
        contentEditable
        className={styles.titleInput}
        onInput={handleTitleChange}
        onPaste={handlePaste}
        suppressContentEditableWarning={true}
      >
        {title}
      </div>
    );
  }

  // Render title as plain text for paste pages
  return (
    <div className={styles.titleInput} ref={titleEditableRef}>
      {title}
    </div>
  );
};

export default TitleInput;
