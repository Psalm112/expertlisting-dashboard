import type { StaticImageData } from 'next/image';
import listingViews from '@/assets/listings/listing-views.webp';
import mostClicked2 from '@/assets/listings/most-clicked-2.webp';
import mostClicked from '@/assets/listings/most-clicked.webp';
import mostWatchlisted from '@/assets/listings/most-watchlisted.webp';
import siteVisits from '@/assets/listings/site-visits.webp';
import type { ListingImage } from '@/lib/types';

/**
 * Static imports so Next can emit width/height and a blur placeholder, which
 * keeps the photo cards from shifting layout as they load.
 */
export const LISTING_IMAGES: Record<ListingImage, StaticImageData> = {
  siteVisits,
  mostClicked,
  mostClicked2,
  mostWatchlisted,
  listingViews,
};
