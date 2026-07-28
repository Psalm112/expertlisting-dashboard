/**
 * Shapes the dashboard renders. Kept separate from the fixture data in
 * `mock-data.ts` so swapping the static import for a real fetch is a one-file
 * change - nothing in the component tree knows where the data comes from.
 */

/** Keys into the generated icon set, so data never imports React components. */
export type IconKey =
  | 'dashboard'
  | 'listings'
  | 'users'
  | 'request'
  | 'applications'
  | 'tasks'
  | 'messages'
  | 'activity'
  | 'waitlist'
  | 'wallet'
  | 'shop';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: IconKey;
}

export interface QuickAction {
  id: string;
  /** Accessible name - these render as icon-only buttons in the masthead. */
  label: string;
  icon: IconKey;
}

export interface CurrentUser {
  /** Name used in the page greeting. */
  greetingName: string;
  /** Letter shown in the masthead avatar. */
  initial: string;
}

/** A labelled figure such as "Published / 1.2k". */
export interface Stat {
  id: string;
  label: string;
  value: string;
}

export interface OverviewPanel {
  id: string;
  title: string;
  icon: 'listings' | 'users';
  href: string;
  stats: Stat[];
}

export type Trend = 'up' | 'down';

export interface SalesMetric {
  id: string;
  label: string;
  /** Pre-formatted so the design's exact "₦120,000,000.00" is preserved. */
  value: string;
  /** Token name driving the figure colour. */
  tone: 'blue' | 'green' | 'orange' | 'deep';
  delta: { value: string; trend: Trend };
}

export interface SalesSeries {
  key: string;
  label: string;
  tone: 'blue' | 'green' | 'red';
}

/** One month of the grouped bar chart; values are in millions of naira. */
export interface SalesPoint {
  month: string;
  values: Record<string, number>;
}

export interface SalesRange {
  id: string;
  label: string;
}

export type ListingImage = 'siteVisits' | 'mostClicked' | 'mostWatchlisted' | 'listingViews';

/**
 * One state of a photo card. In the Figma file these are component variants, and
 * the whole card swaps between them: photograph, caption and arrows all change
 * together.
 */
export interface CardState {
  id: string;
  image: ListingImage;
  imageAlt: string;
  /** Small caps label above the title, e.g. "MOST CLICKED". */
  eyebrow: string;
  title?: string;
  location?: string;
  /** Headline figure, rendered in the design's yellow. */
  figure: string;
  /** Prev/next arrows are only drawn on some states. */
  showArrows: boolean;
}

export interface MetricCard {
  id: string;
  /**
   * How the card moves between states.
   * `auto` cycles on a timer, `filter` switches from the Live/All badge.
   */
  mode: 'auto' | 'filter';
  /** Live/All filter shown on cards that have one. */
  filters?: string[];
  /** Index into `states` that starts visible. */
  defaultState?: number;
  states: CardState[];
  /** Only meaningful for `auto`. Timings come from the Figma prototype. */
  autoplay?: { dwellMs: number; crossfadeMs: number };
}
