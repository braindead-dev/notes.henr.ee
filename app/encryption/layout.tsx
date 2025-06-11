// app/encryption/layout.tsx (for server-side metadata)
import ContentLayout from "@/app/layouts/ContentLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encryption Details",
  description: "Military-grade encryption protecting your pastes.",
};

export default function EncryptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentLayout>{children}</ContentLayout>;
}
