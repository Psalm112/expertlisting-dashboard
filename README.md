# Expert Listing Dashboard

The Expert Listing dashboard built from the supplied Figma design, using Next.js,
TypeScript and Tailwind CSS.

**Live:** https://expertlisting-indol.vercel.app

## Running it

Needs Node 20 or newer. I used pnpm but npm is fine.

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

| Script           | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `pnpm dev`       | Development server                                    |
| `pnpm build`     | Production build                                      |
| `pnpm start`     | Serve the production build                            |
| `pnpm lint`      | ESLint                                                |
| `pnpm typecheck` | `tsc --noEmit`                                        |
| `pnpm format`    | Prettier, with the Tailwind class-order plugin        |
| `pnpm images`    | Regenerate the WebP assets from the raw Figma exports |
| `pnpm fonts`     | Re-subset the Open Runde web fonts                    |

You only need those last two if you re-export from Figma. Their inputs sit in
`design-source/`, which isn't committed. More on that under
[Asset pipeline](#asset-pipeline).

## Technology choices

Next.js 16 with the App Router, since it was one of the preferred options and it
handles static prerendering, images and font self-hosting without me configuring
anything. Every route here comes out static.

TypeScript throughout. The data shapes live in `src/lib/types.ts`, apart from the
fixtures in `src/lib/mock-data.ts`, so replacing the mock layer with a real fetch
touches one file.

Tailwind v4, with the design's values defined as tokens in an `@theme` block
instead of scattered around as arbitrary values. So `text-ink-muted` and
`rounded-card` mean something specific, and there's one place to change them.

**Recharts** for the sales chart, on a `ResponsiveContainer` so it tracks its card
at any width. It is the heaviest dependency here, so it loads through
`next/dynamic` behind a skeleton with the same footprint. That keeps it out of the
initial bundle and stops the card resizing when it arrives.

Bars stay 4px at every width. Only the gap between groups flexes, and it flexes
between bounds. Below a 30px band the arrows start paging through the months
rather than letting the bars crowd, and above the design's 36px band the chart
stops growing and centres instead, since 4px bars spread 60px apart stop reading
as the same chart. That lower bound is also what makes the arrows mean something:
the design draws them as a disabled and enabled pair, and here they genuinely are.

Measured at 1440: 4px bars, 36px pitch, 130px between the 0 and 50m ticks, tallest
bar 136px, all matching the frame. At 320 it shows five months at a time with the
bars still 4px.

**Framer Motion** for the interaction layer, wrapped once in
`MotionConfig reducedMotion="user"` so every animation honours the OS setting from
a single place. It earns its keep on the shared-element transitions: the active
pill slides between nav tabs and between the 1 Week / 1 Month / 1 Year options via
`layoutId`, and the yellow dot slides between Live and All Listings. Those are
genuinely awkward in CSS. It also runs the hover panels and the caption swaps.

It is loaded through `LazyMotion` with `strict`, so components use the light `m.*`
namespace and the feature bundle arrives in a second wave rather than blocking
first paint. Nothing on the page needs Framer in order to become visible, which is
what makes that safe: the section entrances are plain CSS precisely so a slow
connection never leaves content sitting at `opacity: 0` waiting for hydration.

### What I left out

The brief said keep it lightweight.

No icon package. All 21 icons come out of the Figma file itself and generated into
inline components in `src/components/icons/index.tsx`.

I also skipped clsx and tailwind-merge. Nothing in this UI overrides a utility
that a variant already set, so conflict resolution would be roughly 7 KB doing
nothing. `src/lib/cn.ts`.

Anything that is only a hover or a colour change stays in CSS. Framer is reserved
for what it is actually better at: shared-element pills, presence transitions and
gesture states.

`sharp` and `subset-font` are devDependencies for the asset scripts, and Prettier
runs with the Tailwind plugin so class order stays canonical. None of them reach
the browser.

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx           shell: header, main, chat button, skip link
│  ├─ page.tsx             the dashboard
│  ├─ fonts.ts             self-hosted Open Runde
│  ├─ globals.css          design tokens and page shell
│  └─ listings/ users/ etc  stub routes so no nav item 404s
├─ components/
│  ├─ icons/               downloaded from Figma, plus a key to component registry
│  ├─ layout/              Masthead, PrimaryNav, SiteHeader, ChatButton
│  ├─ ui/                  Card, StatBlock, SegmentedControl, PillButton,
│  │                       IconButton, CarouselArrow, DeltaBadge, ProgressDots,
│  │                       FilterBadge, Tooltip, Reveal
│  └─ dashboard/           SalesOverviewCard, SalesChart, ChartSkeleton,
│                          SalesMetricTile, OverviewPanelCard, MetricPhotoCard
├─ lib/
│  ├─ types.ts             data contracts
│  ├─ mock-data.ts         fixtures
│  ├─ motion.ts            shared easing, springs and variants
│  ├─ use-element-width.ts
│  ├─ use-hover-open.ts
│  ├─ use-prefers-reduced-motion.ts
│  └─ cn.ts
└─ assets/                 subset fonts and optimised photography
```

`ui/` holds primitives that know nothing about this dashboard. `dashboard/`
composes them with data. `layout/` is the application chrome. The data layer
never imports React, since icons are referenced by string key and resolved
through a registry, which means the fixtures could be swapped for an API response
without touching a component.

## Design fidelity

Colours, type, spacing, radii and layout geometry are taken from the values in the
file rather than estimated off a screenshot, so the build lands on the design's
numbers instead of near them. Measured against the frame at 1440: the sales card
is 857px wide starting at y=202, the overview column is 407px, and the photo cards
are 417 by 377, against a specified 857, 407 and 418 by 378. The chart holds 4px
bars on a 36px pitch with 130px between the 0 and 50m ticks.

Going through the file carefully also turned up a few things a visual copy would
get wrong:

- Several layers that look like real UI are switched off, including a seventh
  "Settings" nav item, a "+ New Listing" button, a "Help Centre" link and the
  user's name beside the avatar. None of them are built.
- Two layers are technically visible but render invisibly: a stray `204` text
  layer sitting behind the photo cards, and a white on white footer bar.
- The Live/All badge has a 1px hairline between its two options at 16% white.
- Each photo card carries two stacked gradient overlays, not one.
- The chart's two arrow discs are deliberately different greys, which reads as a
  disabled and enabled pair, so I wired them to real paging state.
- Some card rectangles hold more than one image fill stacked together. That is
  how the second photograph of a listing is stored, and only the top one shows on
  a static board.
- The typeface is Open Runde, which is not on Google Fonts, so it is self-hosted
  and subset rather than substituted with Inter.

The file also carries a prototype, which is where the behaviour came from: the
site visits card swapping on a timer, the Live/All badge changing the photograph
and dropping the arrows, and the hover labels on the masthead icons and avatar.

## Accessibility

Semantic landmarks, a skip link, and `aria-current="page"` on the active tab.

The segmented control and the Live/All filter use radio semantics with roving
focus, so each is a single tab stop and moves with arrow keys.

The chart is mirrored by a visually hidden data table, and every bar group is
focusable with a full label, so the numbers aren't trapped inside a picture. The
delta indicators say "Up" or "Down" in hidden text so direction isn't carried by
colour and arrow shape alone.

Icon only buttons have accessible names, decorative SVG is `aria-hidden`, focus
rings are visible, and `prefers-reduced-motion` is respected.

## Performance

Every route is statically prerendered. Seven components opt into the client, plus
two hooks, and each of them holds real state or reads a media query.

Recharts is the largest dependency, so it is dynamically imported and lands in its
own chunk rather than the initial bundle, 88 KB gzipped that never blocks first
paint. The skeleton behind it occupies the same box, so the card does not resize
when the chart arrives. Framer's feature bundle is deferred the same way; in the
network waterfall the core chunks start at 185ms and Framer follows at 387ms.

Worth being straight about the trade: `LazyMotion` adds module boundaries, so the
total JS is slightly larger than importing Framer directly. What it buys is a
smaller blocking payload, which is the number that matters on a slow connection.

Open Runde subsets from 471 KB down to 67 KB across the three weights, self-hosted
with `display: swap` and a metric adjusted fallback so layout shift stays near
zero.

The four photographs went from 7.4 MB of PNG to 393 KB of WebP, sized to twice
their render box and served through `next/image` with blur placeholders, with
`priority` on the one above the fold.

Icons are inline SVG, so there's no icon font or sprite request.

## Asset pipeline

The raw Figma exports live in `design-source/` and aren't committed, since
they're large and reproducible from the file. Two scripts turn them into what
ships:

```bash
pnpm images   # scripts/optimize-images.mjs  -> src/assets/listings/*.webp
pnpm fonts    # scripts/subset-fonts.mjs     -> src/assets/fonts/*.subset.woff2
```

Open Runde is under the SIL Open Font License 1.1
([source](https://github.com/lauridskern/open-runde)).

## Given more time

Component tests around the carousel and the range switching. A real loading state,
which is cheap now that the data layer sits behind a typed contract. And container
queries for the chart so it responds to its card instead of the viewport.
