import React from 'react';
import styles from '../styles/page.module.css';
import { insertTextAtCursor } from '../utils';

interface TitleInputProps {
  title: string;
  titleEditableRef: React.RefObject<HTMLDivElement>;
  handleTitleChange: () => void;
}

const TitleInput: React.FC<TitleInputProps> = ({
  title,
  titleEditableRef,
  handleTitleChange,
}) => {
  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    insertTextAtCursor(text);
  };

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
};

export default TitleInput;
