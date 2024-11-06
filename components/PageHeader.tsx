// components/PageHeader.tsx
import React from 'react';
import Header from '@/components/Header';
import PasteButton from '@/components/buttons/PasteButton';

const PageHeader: React.FC = () => {
  return (
    <Header>
      <PasteButton />
    </Header>
  );
};

export default PageHeader;