import React from "react";
import styles from "@/styles/page.module.css";

interface ScrollContainerProps {
  children: React.ReactNode;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({ children }) => {
  const preventDefault = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={styles.editorContainer}
      onDragOver={preventDefault}
      onDrop={preventDefault}
    >
      {children}
    </div>
  );
};

export default ScrollContainer;
