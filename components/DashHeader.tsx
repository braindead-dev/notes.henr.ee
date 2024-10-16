// components/DashHeader.tsx

import React from "react";
import Header from "./Header";
import SignOutButton from "./buttons/SignOutButton";

interface DashHeaderProps {
  isAuthenticated: boolean;
}

const DashHeader: React.FC<DashHeaderProps> = ({ isAuthenticated }) => {
  return (
    <Header>
      {isAuthenticated && <SignOutButton />}
    </Header>
  );
};

export default DashHeader;
