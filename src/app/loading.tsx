import { BrandLoader } from '@/components/ui/BrandLoader';

/**
 * Shown inside `main` while a route resolves. The header and chat button stay
 * put, so only the content area swaps.
 */
export default function Loading() {
  return <BrandLoader className="min-h-[60vh]" label="Loading dashboard" />;
}
