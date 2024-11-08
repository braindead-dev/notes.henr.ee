// app/paste/layout.tsx (for server-side metadata)
import ContentLayout from '@/app/layouts/ContentLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Paste',
  description: 'Create and share markdown notes. Optimized for readability, simplicity, and security.',
  openGraph: {
    title: 'Create New Paste | Henry\'s Notes',
    description: 'Create and share markdown notes. Optimized for readability, simplicity, and security.',
  },
  alternates: {
    canonical: 'https://notes.henr.ee/paste'
  }
};

export default function PasteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ContentLayout>{children}</ContentLayout>;
}
  