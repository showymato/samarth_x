import type { Metadata, Viewport } from 'next';
import './globals.css';
import { brand } from '@/lib/content';
import { seo } from '@/lib/seo';

export const metadata: Metadata = {
  // {{DOMAIN}} is a placeholder: until it's a real domain, fall back to localhost so the build works
  metadataBase: new URL(brand.domain.startsWith('{{') ? 'http://localhost:3000' : brand.url),
  title: seo.title,
  description: seo.description,
  applicationName: brand.name,
  icons: { icon: '/icon.svg' },
  alternates: { canonical: brand.url },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: brand.url,
    siteName: brand.name,
    title: seo.title,
    description: seo.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${brand.name}: one app, one mentor, one rank to chase.` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fbf5f6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preload" href="/fonts/Geist-500.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Geist-400.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/GeistMono-400.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
