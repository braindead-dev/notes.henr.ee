// app/admin/layout.tsx

import Providers from "@/components/Providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "A basic admin dashboard for notes.henr.ee",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
