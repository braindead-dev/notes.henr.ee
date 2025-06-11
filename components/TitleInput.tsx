// components/TitleInput.tsx

import React, { useEffect, useRef } from "react";
import styles from "@/styles/page.module.css";

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
    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(text));
    }
  };

  // Prevent entering newlines in the title
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent newline insertion
    }
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
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        suppressContentEditableWarning={true}
        spellCheck={false}
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
