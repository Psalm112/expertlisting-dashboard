import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // The photography is shipped as WebP already; AVIF buys a little more on
    // browsers that take it.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
