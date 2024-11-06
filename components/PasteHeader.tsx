// components/PasteHeader.tsx
import React from 'react';
import Header from '@/components/Header';
import CopyButton from '@/components/buttons/CopyButton';
import PublishButton from '@/components/buttons/PublishButton';
import ToggleButton from '@/components/buttons/ToggleButton';
import EncryptButton from '@/components/buttons/EncryptButton';

// components/PasteHeader.tsx
interface PasteHeaderProps {
  isPastePage: boolean;
  handleCopy?: () => void;
  isCopied?: boolean;
  handleSubmit?: (e: React.FormEvent) => void;
  viewMode?: boolean;
  setViewMode?: React.Dispatch<React.SetStateAction<boolean>>;
  encryptionMethod:  'key' | 'password' | null; // Remove the "?" to make this required
  toggleEncryption: () => void; // Remove the "?" to make this required
}


const PasteHeader: React.FC<PasteHeaderProps> = ({
  isPastePage,
  handleCopy,
  isCopied,
  handleSubmit,
  viewMode,
  setViewMode,
  encryptionMethod,
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
          <EncryptButton encryptionMethod={encryptionMethod} toggleEncryption={toggleEncryption} />
        </>
      )}
    </Header>
  );
};

export default PasteHeader;
