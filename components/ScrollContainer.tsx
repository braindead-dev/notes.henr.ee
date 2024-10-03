import React from 'react';
import styles from '../styles/page.module.css';

interface ScrollContainerProps {
  children: React.ReactNode;
  handleScrollShadow?: (visible: boolean) => void; // To update the shadow visibility
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({
  children,
  handleScrollShadow,
}) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const shadowVisible = target.scrollTop > 0;
    if (handleScrollShadow) {
      handleScrollShadow(shadowVisible);
    }
  };

  const preventDefault = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={styles.editorContainer}
      onScroll={handleScroll}
      onDragOver={preventDefault}
      onDrop={preventDefault}
    >
      {children} {/* Render children inside the scrollable container */}
    </div>
  );
};

export default ScrollContainer;
