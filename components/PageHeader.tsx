// components/PageHeader.tsx
import React from 'react';
import Header from './Header';
import PasteButton from './buttons/PasteButton';

const PageHeader: React.FC = () => {
  return (
    <Header>
      <PasteButton />
    </Header>
  );
};

export default PageHeader;