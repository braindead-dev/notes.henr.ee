import React from 'react';
import styles from '../styles/page.module.css';
import PublishButton from './buttons/PublishButton';
import ToggleButton from './buttons/ToggleButton';
import CopyButton from './buttons/CopyButton';

interface PasteHeaderProps {
  handleSubmit?: (e: React.FormEvent) => void;
  viewMode?: boolean;
  setViewMode?: React.Dispatch<React.SetStateAction<boolean>>;
  isPastePage: boolean;
  handleCopy?: () => void;
  isCopied?: boolean;
}

const PasteHeader: React.FC<PasteHeaderProps> = ({
  handleSubmit,
  viewMode,
  setViewMode,
  isPastePage,
  handleCopy,
  isCopied,
}) => {
  return (
    <div className={styles.fixedHeader}>
      <div className={styles.headerButtons}>
        {isPastePage ? (
          <CopyButton handleCopy={handleCopy} isCopied={isCopied} />
        ) : (
          <>
            <PublishButton handleSubmit={handleSubmit} />
            <ToggleButton viewMode={viewMode} setViewMode={setViewMode} />
          </>
        )}
      </div>
    </div>
  );
};

export default PasteHeader;
