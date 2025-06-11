import { ReactNode } from "react";

interface ContentLayoutProps {
  children: ReactNode;
  metadata?: {
    title: string;
    description: string;
  };
}

export default function ContentLayout({
  children,
  metadata,
}: ContentLayoutProps) {
  return <>{children}</>;
}
