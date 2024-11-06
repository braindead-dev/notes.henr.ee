// app/encryption/layout.tsx (for server-side metadata)
import ContentLayout from '@/app/layouts/ContentLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paste',
  description: 'Create a markdown-based paste.',
};

export default function PasteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ContentLayout>{children}</ContentLayout>;
}
  