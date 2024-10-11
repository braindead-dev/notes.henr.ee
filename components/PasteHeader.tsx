// components/PasteHeader.tsx
import React from 'react';
import Header from './Header';
import CopyButton from './buttons/CopyButton';
import PublishButton from './buttons/PublishButton';
import ToggleButton from './buttons/ToggleButton';
import EncryptButton from './buttons/EncryptButton';

// components/PasteHeader.tsx
interface PasteHeaderProps {
  isPastePage: boolean;
  handleCopy?: () => void;
  isCopied?: boolean;
  handleSubmit?: (e: React.FormEvent) => void;
  viewMode?: boolean;
  setViewMode?: React.Dispatch<React.SetStateAction<boolean>>;
  isEncrypted: boolean; // Remove the "?" to make this required
  toggleEncryption: () => void; // Remove the "?" to make this required
}


const PasteHeader: React.FC<PasteHeaderProps> = ({
  isPastePage,
  handleCopy,
  isCopied,
  handleSubmit,
  viewMode,
  setViewMode,
  isEncrypted,
  toggleEncryption,
}) => {
  return (
    <Header>
      {isPastePage ? (
        <CopyButton handleCopy={handleCopy} isCopied={isCopied} />
      ) : (
        <>
          <PublishButton handleSubmit={handleSubmit} />
          <ToggleButton viewMode={viewMode} setViewMode={setViewMode} />
          <EncryptButton isEncrypted={isEncrypted} toggleEncryption={toggleEncryption} />
        </>
      )}
    </Header>
  );
};

export default PasteHeader;
