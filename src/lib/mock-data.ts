import type {
  CurrentUser,
  MetricCard,
  NavItem,
  OverviewPanel,
  QuickAction,
  SalesMetric,
  SalesPoint,
  SalesRange,
  SalesSeries,
} from './types';

/**
 * Static fixtures standing in for the API. Figures, labels and copy are taken
 * verbatim from the Figma file; anything the design did not specify (second
 * carousel slides, alt text, hrefs) is invented and flagged in the README.
 */

export const CURRENT_USER: CurrentUser = {
  greetingName: 'Ahmed',
  name: 'Dylan Frank',
  email: 'dylanfran96@gmail.com',
  initial: 'D',
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: 'dashboard' },
  { id: 'listings', label: 'Listings', href: '/listings', icon: 'listings' },
  { id: 'users', label: 'Users', href: '/users', icon: 'users' },
  { id: 'request', label: 'Request', href: '/request', icon: 'request' },
  { id: 'applications', label: 'Applications', href: '/applications', icon: 'applications' },
  { id: 'tasks', label: 'Tasks', href: '/tasks', icon: 'tasks' },
];

/**
 * Labels are the ones the prototype shows in each icon's hover tooltip
 */
export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'engagement', label: 'Engagement', icon: 'messages' },
  { id: 'search-activity', label: 'Search Activity', icon: 'activity' },
  { id: 'waitlist', label: 'Waitlist', icon: 'waitlist' },
  { id: 'payout-center', label: 'Payout Center', icon: 'wallet' },
  { id: 'marketplace', label: 'Marketplace', icon: 'shop' },
];

/* -------------------------------------------------------------------------- */
/* Sales overview                                                             */
/* -------------------------------------------------------------------------- */

export const SALES_RANGES: SalesRange[] = [
  { id: 'week', label: '1 Week' },
  { id: 'month', label: '1 Month' },
  { id: 'year', label: '1 Year' },
];

export const DEFAULT_SALES_RANGE = 'year';

export const SALES_SERIES: SalesSeries[] = [
  { key: 'inflow', label: 'Total inflow', tone: 'blue' },
  { key: 'mrr', label: 'MRR', tone: 'green' },
  { key: 'payout', label: 'Payout', tone: 'red' },
];

/** Values in millions of naira, derived from the bar heights in the Figma file. */
export const SALES_DATA: Record<string, SalesPoint[]> = {
  year: [
    { month: 'Jan', values: { inflow: 38.1, mrr: 30.0, payout: 11.5 } },
    { month: 'Feb', values: { inflow: 6.9, mrr: 30.0, payout: 11.5 } },
    { month: 'Mar', values: { inflow: 16.2, mrr: 8.1, payout: 4.2 } },
    { month: 'Apr', values: { inflow: 16.2, mrr: 27.7, payout: 11.5 } },
    { month: 'May', values: { inflow: 11.5, mrr: 3.1, payout: 8.8 } },
    { month: 'Jun', values: { inflow: 39.2, mrr: 52.3, payout: 8.8 } },
    { month: 'Jul', values: { inflow: 26.5, mrr: 40.0, payout: 20.4 } },
    { month: 'Aug', values: { inflow: 26.5, mrr: 8.5, payout: 20.4 } },
    { month: 'Sep', values: { inflow: 40.0, mrr: 36.9, payout: 8.5 } },
  ],
  // Only the 1-Year view is specified in the design; these keep the range
  // control functional rather than decorative.
  month: [
    { month: 'Wk 1', values: { inflow: 12.4, mrr: 9.8, payout: 4.1 } },
    { month: 'Wk 2', values: { inflow: 22.7, mrr: 18.2, payout: 7.6 } },
    { month: 'Wk 3', values: { inflow: 9.3, mrr: 26.4, payout: 11.9 } },
    { month: 'Wk 4', values: { inflow: 31.8, mrr: 14.5, payout: 6.3 } },
  ],
  week: [
    { month: 'Mon', values: { inflow: 4.2, mrr: 6.1, payout: 1.8 } },
    { month: 'Tue', values: { inflow: 8.9, mrr: 3.4, payout: 5.2 } },
    { month: 'Wed', values: { inflow: 6.1, mrr: 11.7, payout: 2.9 } },
    { month: 'Thu', values: { inflow: 13.5, mrr: 8.8, payout: 6.7 } },
    { month: 'Fri', values: { inflow: 10.2, mrr: 15.3, payout: 4.4 } },
    { month: 'Sat', values: { inflow: 3.7, mrr: 5.9, payout: 2.1 } },
    { month: 'Sun', values: { inflow: 2.4, mrr: 3.2, payout: 1.3 } },
  ],
};

export const SALES_SUBTITLE: Record<string, string> = {
  year: 'Showing overview Jan 2022 - Sep 2022',
  month: 'Showing overview Sep 2022',
  week: 'Showing overview 19 - 25 Sep 2022',
};

export const SALES_METRICS: SalesMetric[] = [
  {
    id: 'inflow',
    label: 'Total Inflow',
    value: '₦120,000,000.00',
    tone: 'blue',
    delta: { value: '2.5%', trend: 'up' },
  },
  {
    id: 'mrr',
    label: 'MRR',
    value: '₦50,000,000.00',
    tone: 'green',
    delta: { value: '2.5%', trend: 'up' },
  },
  {
    id: 'payout',
    label: 'Payout',
    value: '₦200,000,000.00',
    tone: 'orange',
    delta: { value: '0.5%', trend: 'down' },
  },
  {
    id: 'riders-credit',
    label: 'Total Riders’ Credit',
    value: '₦100,000,000.00',
    tone: 'deep',
    delta: { value: '0.5%', trend: 'up' },
  },
];

/* -------------------------------------------------------------------------- */
/* Overview panels                                                            */
/* -------------------------------------------------------------------------- */

export const OVERVIEW_PANELS: OverviewPanel[] = [
  {
    id: 'listings',
    title: 'Listings Overview',
    icon: 'listings',
    href: '/listings',
    stats: [
      { id: 'total', label: 'Total', value: '2.2k' },
      { id: 'published', label: 'Published', value: '1.2k' },
      { id: 'unpublished', label: 'Unpublished', value: '1k' },
    ],
  },
  {
    id: 'users',
    title: 'User Overview',
    icon: 'users',
    href: '/users',
    stats: [
      { id: 'total', label: 'Total', value: '20.7k' },
      { id: 'riders', label: 'Riders', value: '8.5k' },
      { id: 'subscribers', label: 'Subscribers', value: '7.5k' },
      { id: 'free', label: 'Free Users', value: '3.3k' },
      { id: 'agent', label: 'Agent', value: '8.1k' },
      { id: 'developers', label: 'Developers', value: '1.5k' },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Photo metric cards                                                         */
/* -------------------------------------------------------------------------- */

export const METRIC_CARDS: MetricCard[] = [
  {
    id: 'site-visits',
    mode: 'auto',
    autoplay: { dwellMs: 1000, crossfadeMs: 1000 },
    views: [
      {
        id: 'visits',
        eyebrow: 'Total site visits',
        figure: '11k',
        photos: [
          {
            key: 'siteVisits',
            alt: 'Glass office towers seen from street level on an overcast morning',
          },
        ],
      },
      {
        id: 'listing-views',
        eyebrow: 'Total listing views',
        figure: '20k',
        photos: [
          {
            key: 'listingViews',
            alt: 'Dark clad apartment block with amber window reveals against a clear sky',
          },
        ],
      },
    ],
  },
  {
    id: 'most-clicked',
    mode: 'filter',
    defaultView: 0,
    views: [
      {
        id: 'live',
        label: 'Live Listings',
        eyebrow: 'Most clicked',
        title: 'Urban Prime Plaza Premiere',
        location: 'Ikoyi, Lagos',
        figure: '40k',
        photos: [
          { key: 'mostClicked', alt: 'White high-rise apartment tower with red accent panels' },
          {
            key: 'mostClicked2',
            alt: 'Low-rise villas with palm trees along a landscaped waterfront path',
          },
        ],
      },
      {
        id: 'all',
        label: 'All Listings',
        eyebrow: 'Most clicked',
        title: 'Grey Abode',
        location: 'Ajah, Lagos',
        figure: '40k',
        photos: [
          {
            key: 'siteVisits',
            alt: 'Glass office towers seen from street level on an overcast morning',
          },
        ],
      },
    ],
  },
  {
    id: 'most-watchlisted',
    mode: 'filter',
    defaultView: 1,
    views: [
      // Nothing sits behind this option in the file, so it renders disabled.
      { id: 'live', label: 'Live Listings', eyebrow: 'Most watchlisted', photos: [] },
      {
        id: 'all',
        label: 'All Listings',
        eyebrow: 'Most watchlisted',
        title: 'Urban Prime Plaza Premiere',
        location: 'Ikoyi, Lagos',
        figure: '20k',
        photos: [
          { key: 'mostWatchlisted', alt: 'Brick apartment building with balconies on each floor' },
        ],
      },
    ],
  },
];
