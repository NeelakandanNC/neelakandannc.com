import type { Metadata, Viewport } from 'next';
import { Michroma, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';
import { HudProvider } from '@/lib/hud';
import HudFrame from '@/components/hud/HudFrame';
import Telemetry from '@/components/hud/Telemetry';
import ArcReactor from '@/components/hud/ArcReactor';
import ScanLine from '@/components/hud/ScanLine';
import BootSequence from '@/components/sections/BootSequence';

/* Self-hosted, subset latin, display:swap with automatic size-adjust
   fallbacks — zero layout shift on font load. */
const michroma = Michroma({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-michroma',
});

const plexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-sans',
});

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  title: 'Neelakandan N C — Mark XIV',
  description:
    'Final-year ECE at NIT Agartala who stopped doing ECE. AI agents, trading systems, research pipelines. Fourteen builds in three years.',
  metadataBase: new URL('https://neelakandannc.com'),
  openGraph: {
    title: 'Neelakandan N C — Mark XIV',
    description:
      'Fourteen builds in three years. AI agents, trading systems, research pipelines.',
    url: 'https://neelakandannc.com',
    siteName: 'Neelakandan N C',
    images: ['/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@NeelakandanNC',
    images: ['/og.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#050810',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${michroma.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <head>
        {/* Decides BEFORE first paint whether the boot sequence plays, so
            repeat visitors never see it flash. Skipped on repeat visits
            (sessionStorage) and on prefers-reduced-motion. With JS off the
            attribute is never set and the overlay stays display:none. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
if(sessionStorage.getItem('mxiv-boot'))return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
sessionStorage.setItem('mxiv-boot','1');
document.documentElement.setAttribute('data-boot','');
}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <HudProvider>
          <BootSequence />

          {/* HUD chrome — fixed, sits over the scrolling content */}
          <HudFrame />
          <Telemetry />
          <ScanLine />
          <ArcReactor />

          <main id="top">{children}</main>
        </HudProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
