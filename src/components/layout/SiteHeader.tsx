import { Masthead } from './Masthead';
import { PrimaryNav } from './PrimaryNav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <Masthead />
      <PrimaryNav />
    </header>
  );
}
