import React from 'react';
import styles from '../styles/page.module.css';

interface TitleInputProps {
  title: string;
  titleEditableRef: React.RefObject<HTMLDivElement>;
  handleTitleChange: () => void;
  handlePaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({
  title,
  titleEditableRef,
  handleTitleChange,
  handlePaste,
}) => {
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
