/**
 * Shapes the dashboard renders. Kept separate from the fixture data in
 * `mock-data.ts` so swapping the static import for a real fetch is a one-file
 * change - nothing in the component tree knows where the data comes from.
 */

/** Keys into the generated icon set */
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
  label: string;
  icon: IconKey;
}

export interface CurrentUser {
  greetingName: string;
  name: string;
  email: string;
  initial: string;
}

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
  value: string;
  tone: 'blue' | 'green' | 'orange' | 'deep';
  delta: { value: string; trend: Trend };
}

export interface SalesSeries {
  key: string;
  label: string;
  tone: 'blue' | 'green' | 'red';
}

export interface SalesPoint {
  month: string;
  values: Record<string, number>;
}

export interface SalesRange {
  id: string;
  label: string;
}

export type ListingImage =
  'siteVisits' | 'mostClicked' | 'mostClicked2' | 'mostWatchlisted' | 'listingViews';

export interface CardPhoto {
  key: ListingImage;
  alt: string;
}

/** One view of a photo card, i.e. what sits behind a single badge option */
export interface CardView {
  id: string;
  label?: string;
  photos: CardPhoto[];
  eyebrow: string;
  title?: string;
  location?: string;
  figure?: string;
}

export interface MetricCard {
  id: string;
  /**
   * How the card moves between views.
   * `auto` cycles on a timer, `filter` switches from the Live/All badge.
   */
  mode: 'auto' | 'filter';
  views: CardView[];
  /** Index into `views` that starts selected. */
  defaultView?: number;
  autoplay?: { dwellMs: number; crossfadeMs: number };
}
