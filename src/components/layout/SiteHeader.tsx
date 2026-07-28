import { Masthead } from './Masthead';
import { PrimaryNav } from './PrimaryNav';

/**
 * Sticky so the section tabs stay reachable on a long dashboard. At rest it is
 * pixel-identical to the design; it only differs once the page scrolls.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <Masthead />
      <PrimaryNav />
    </header>
  );
}
