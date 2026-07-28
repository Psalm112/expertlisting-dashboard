import type { SVGProps } from 'react';
import { BRAND_MARK_PATHS, BRAND_MARK_VIEWBOX } from './brand-mark';

export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={BRAND_MARK_VIEWBOX} fill="none" role="img" aria-label="Expert Listing" {...props}>
      {BRAND_MARK_PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}
