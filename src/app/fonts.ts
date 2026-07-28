import localFont from 'next/font/local';

/**
 * The design is set in Open Runde (SIL OFL 1.1, github.com/lauridskern/open-runde).
 * It is not on Google Fonts, so it is self-hosted and subset - see scripts/subset-fonts.mjs.
 *
 * Only 400/500/600 are shipped because those are the only weights the design uses.
 */
export const openRunde = localFont({
  src: [
    { path: '../assets/fonts/OpenRunde-Regular.subset.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/OpenRunde-Medium.subset.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/OpenRunde-Semibold.subset.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-open-runde',
  display: 'swap',
  // Open Runde is an Inter derivative; Arial's metrics give the closest fallback
  // and let Next generate an adjusted @font-face to keep layout shift near zero.
  adjustFontFallback: 'Arial',
});
