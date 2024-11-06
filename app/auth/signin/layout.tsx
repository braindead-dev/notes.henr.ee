// app/auth/signin/layout.tsx

import ContentLayout from '@/app/layouts/ContentLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to access the admin dashboard',
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentLayout>{children}</ContentLayout>;
}
