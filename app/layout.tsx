import type { Metadata, Viewport } from 'next';
import { Anton, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import './globals.css';
import { HudProvider } from '@/lib/hud';
import HudFrame from '@/components/hud/HudFrame';
import Telemetry from '@/components/hud/Telemetry';
import ArcReactor from '@/components/hud/ArcReactor';
import ScanLine from '@/components/hud/ScanLine';
import ThemeToggle from '@/components/hud/ThemeToggle';
import BootSequence from '@/components/sections/BootSequence';

/* Self-hosted, subset latin, display:swap with automatic size-adjust
   fallbacks — zero layout shift on font load. */
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050810' },
    { media: '(prefers-color-scheme: light)', color: '#eef1f7' },
  ],
};

/* Runs before first paint:
   · applies the stored theme so there's no flash of the wrong palette
   · decides whether the boot sequence plays (once per session, and never
     under prefers-reduced-motion)
   With JS off neither attribute is set: the page renders dark and the
   boot overlay stays display:none. */
const PRE_PAINT = `(function(){try{
var t=localStorage.getItem('mxiv-theme');
if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);
if(sessionStorage.getItem('mxiv-boot'))return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
sessionStorage.setItem('mxiv-boot','1');
document.documentElement.setAttribute('data-boot','');
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
      </head>
      <body>
        <HudProvider>
          <BootSequence />

          {/* HUD chrome — fixed, sits over the scrolling content */}
          <HudFrame />
          <Telemetry />
          <ScanLine />
          <ThemeToggle />
          <ArcReactor />

          <main id="top">{children}</main>
        </HudProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
