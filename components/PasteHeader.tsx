// components/PasteHeader.tsx
import React from 'react';
import Header from './Header';
import CopyButton from './buttons/CopyButton';
import PublishButton from './buttons/PublishButton';
import ToggleButton from './buttons/ToggleButton';
import EncryptButton from './buttons/EncryptButton';

interface PasteHeaderProps {
  isPastePage: boolean;
  handleCopy?: () => void;
  isCopied?: boolean;
  handleSubmit?: (e: React.FormEvent) => void;
  viewMode?: boolean;
  setViewMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasteHeader: React.FC<PasteHeaderProps> = ({
  isPastePage,
  handleCopy,
  isCopied,
  handleSubmit,
  viewMode,
  setViewMode,
}) => {
  return (
    <Header>
      {isPastePage ? (
        <CopyButton handleCopy={handleCopy} isCopied={isCopied} />
      ) : (
        <>
          <PublishButton handleSubmit={handleSubmit} />
          <ToggleButton viewMode={viewMode} setViewMode={setViewMode} />
          <EncryptButton/>
        </>
      )}
    </Header>
  );
};

export default PasteHeader;
