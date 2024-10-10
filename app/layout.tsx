import './globals.css';

export const metadata = {  
  title: "Henry's Notes",
  description: 'A simple markdown pastebin for notes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
