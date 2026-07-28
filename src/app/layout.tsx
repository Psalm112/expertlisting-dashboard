import type { Metadata, Viewport } from 'next';
import { ChatButton } from '@/components/layout/ChatButton';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { openRunde } from './fonts';
import './globals.css';

const DESCRIPTION =
  'Sales, listing and user performance overview for the Expert Listing property marketplace.';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard | Expert Listing',
    template: '%s | Expert Listing',
  },
  description: DESCRIPTION,
  applicationName: 'Expert Listing',
  openGraph: {
    title: 'Dashboard | Expert Listing',
    description: DESCRIPTION,
    siteName: 'Expert Listing',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#105b48',
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${openRunde.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="focus:bg-surface sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-base focus:font-medium focus:shadow-lg"
        >
          Skip to content
        </a>

        <SiteHeader />

        <main id="main" className="shell flex-1 pt-3 pb-20">
          {children}
        </main>

        <ChatButton />
      </body>
    </html>
  );
}
