import './globals.css';

export const metadata = {
  title: 'Henry Wang',
  description: 'A simple markdown notes pastebin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
