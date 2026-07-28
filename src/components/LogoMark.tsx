import type { SVGProps } from 'react';

/**
 * Just the Expert Listing glyph, without the wordmark.
 *
 * Lifted from the same logo export: these are the paths that sit left of x=32,
 * where the lettering starts. Used on narrow viewports so all five quick actions
 * still fit in the masthead.
 */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" fill="none" role="img" aria-label="Expert Listing" {...props}>
      <path
        d="M5.18383 0.98438L2.71069 3.45752L17.4666 18.2134L19.9397 15.7403L5.18383 0.98438Z"
        fill="currentColor"
      />
      <path
        d="M10.5113 7.93818L1.68896 16.7606L4.1621 19.2337L12.9845 10.4113L10.5113 7.93818Z"
        fill="currentColor"
      />
      <path d="M11.1572 7.73471H0V11.2323H11.1572V7.73471Z" fill="currentColor" />
      <path d="M13.2117 9.78915H9.71414V20.9464H13.2117V9.78915Z" fill="currentColor" />
      <path
        d="M10.3912 3.77902H14.4188C15.7697 3.77902 17.0642 3.24273 18.0195 2.28742L18.6371 2.90501C17.6818 3.86032 17.1455 5.15491 17.1455 6.50578V10.5334L20.9105 14.2983V0.0125122H6.62466L10.3912 3.77902Z"
        fill="currentColor"
      />
    </svg>
  );
}
