import type { StaticImageData } from 'next/image';
import mostClicked from '@/assets/listings/most-clicked.webp';
import mostWatchlisted from '@/assets/listings/most-watchlisted.webp';
import siteVisits from '@/assets/listings/site-visits.webp';
import type { MetricCard } from '@/lib/types';

/**
 * Static imports so Next can emit width/height and a blur placeholder, which
 * keeps the photo cards from shifting layout as they load.
 */
export const LISTING_IMAGES: Record<MetricCard['image'], StaticImageData> = {
  siteVisits,
  mostClicked,
  mostWatchlisted,
};
