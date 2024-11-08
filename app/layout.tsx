import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://notes.henr.ee'),
  title: {
    template: '%s | Henry\'s Notes',
    default: 'Henry\'s Notes - Secure Markdown Pastebin'
  },
  description: 'A free, simple, and secure markdown pastebin for sharing notes and documentation.',
  keywords: ['markdown', 'pastebin', 'encryption', 'notes', 'secure', 'sharing'],
  authors: [{ name: 'Henry', url: 'https://henrywa.ng' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://notes.henr.ee',
    siteName: 'Henry\'s Notes',
    title: 'Henry\'s Notes - Secure Markdown Pastebin',
    description: 'A free, simple, and secure markdown pastebin.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Henry\'s Notes - A secure markdown pastebin with encryption'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Henry\'s Notes - Secure Markdown Pastebin',
    description: 'A free, simple, and secure markdown pastebin.',
    images: ['/og-image.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://notes.henr.ee" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#222222" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="preload" href="/styles/page.module.css" as="style" />
        <link rel="preload" href="/styles/markdownStyles.css" as="style" />
                
        <link rel="prefetch" href="/paste" />
        <link rel="prefetch" href="/encryption" />
        
        <link rel="modulepreload" href="/@codemirror/lang-markdown" />
        <link rel="modulepreload" href="/react-markdown" />
        <link rel="modulepreload" href="/remark-gfm" />
        
        <link rel="preload" href="/katex/katex.min.css" as="style" />
      </head>
      <body>{children}</body>
    </html>
  );
}
