// app/admin/layout.tsx

import Providers from "../../components/Providers";

export const metadata = {
    title: "Admin Dashboard",
    description: "A basic admin dashboard for notes.henr.ee",
  };
  
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
    );
  }
