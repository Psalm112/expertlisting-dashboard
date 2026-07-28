import { BRAND_MARK_PATHS, BRAND_MARK_VIEWBOX } from '@/components/brand-mark';
import { cn } from '@/lib/cn';

/**
 * Loading state built out of the brand mark rather than a generic spinner.
 *
 * The glyph is used as an SVG mask, and a pale band is animated across behind it,
 * so the shimmer is shaped like the logo instead of sitting in a rounded box. It
 * is the same skeleton language as the chart placeholder, just cut to the brand.
 *
 * Underneath, three bars echo the sales chart's three series at its exact 4px
 * width, so the wait reads as this dashboard loading rather than any page.
 */
export function BrandLoader({
  label = 'Loading',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-5', className)}
    >
      <svg viewBox={BRAND_MARK_VIEWBOX} className="size-14" aria-hidden>
        <defs>
          <mask id="brand-loader-mask">
            {BRAND_MARK_PATHS.map((d) => (
              <path key={d} d={d} fill="white" />
            ))}
          </mask>

          {/* Transparent at the edges so the band reads as a highlight passing
              over the base fill rather than a block sliding across it. */}
          <linearGradient id="brand-loader-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-surface)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-surface)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g mask="url(#brand-loader-mask)">
          <rect width="21" height="21" fill="var(--color-line-strong)" />
          <rect className="brand-sweep" width="21" height="21" fill="url(#brand-loader-sweep)" />
        </g>
      </svg>

      <div aria-hidden className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="brand-bar bg-line-strong w-1 origin-bottom rounded-[1px]"
            style={{ height: '100%', animationDelay: `${index * 0.14}s` }}
          />
        ))}
      </div>

      <span className="sr-only">{label}</span>
    </div>
  );
}
