# Expert Listing Dashboard

The Expert Listing dashboard built from the supplied Figma design, using Next.js,
TypeScript and Tailwind CSS.

**Live:** _(deployment URL)_

## Running it

Needs Node 20 or newer. I used pnpm but npm is fine.

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm images` | Regenerate the WebP assets from the raw Figma exports |
| `pnpm fonts` | Re-subset the Open Runde web fonts |

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

### What I left out

The brief said keep it lightweight, so I made each dependency argue for itself.
Runtime dependencies ended up being React, React DOM and Next. Nothing else.

No charting library. The design needs one chart type with fixed geometry (4px
bars, 3px apart, 18px between groups), no axes, no grid, no legend. Recharts
would have added something like 90 KB to render what turned out to be a few dozen
lines of flexbox, and I'd have spent the time fighting its spacing instead of
matching the design.

No icon package either. All 21 icons come out of the Figma file itself, exported
through the REST API and generated into inline components in
`src/components/icons/index.tsx`. That's more accurate than eyeballing the
closest Lucide equivalent, and nothing ships to the browser.

I also skipped clsx and tailwind-merge. Nothing in this UI overrides a utility
that a variant already set, so conflict resolution would be roughly 7 KB doing
nothing. `src/lib/cn.ts` is a ten line join instead.

Transitions are plain CSS.

`sharp` and `subset-font` are devDependencies for the asset scripts. Neither one
reaches the browser.

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
│  ├─ icons/               generated from Figma, plus a key to component registry
│  ├─ layout/              Masthead, PrimaryNav, SiteHeader, ChatButton
│  ├─ ui/                  Card, StatBlock, SegmentedControl, PillButton,
│  │                       DeltaBadge, CarouselArrow, ProgressDots, FilterBadge
│  └─ dashboard/           SalesOverviewCard, SalesChart, SalesMetricTile,
│                          OverviewPanelCard, MetricPhotoCard
├─ lib/
│  ├─ types.ts             data contracts
│  ├─ mock-data.ts         fixtures
│  └─ cn.ts
└─ assets/                 subset fonts and optimised photography
```

`ui/` holds primitives that know nothing about this dashboard. `dashboard/`
composes them with data. `layout/` is the application chrome. The data layer
never imports React, since icons are referenced by string key and resolved
through a registry, which means the fixtures could be swapped for an API response
without touching a component.

## Design fidelity

Instead of measuring by eye I pulled the file through the Figma REST API and
walked the node tree, so the colours, type, spacing, radii and layout geometry
are read values rather than estimates. Full mapping is in
[docs/design-spec.md](docs/design-spec.md).

A few things only showed up because of that:

* The frame has six hidden layers that look like real UI. There's a seventh
  "Settings" nav item, a "+ New Listing" button, a "Help Centre" link, the user's
  name next to the avatar, and two icons inside the "View Transactions" button,
  which is text only as drawn. None of them are built.
* Two more layers are technically visible but render invisibly: a stray `204`
  text layer sitting behind the photo cards, and a white on white footer bar at
  the very bottom whose only text child is hidden. I cropped the rendered frame
  at those coordinates to check before dropping them.
* The chart's two arrow discs are different greys, `#f5f5f5` and `#e4e4e4`, which
  reads as a disabled and enabled pair. They're wired to real scroll state.
* Each photo card carries two stacked gradient overlays, not one.
* The typeface is Open Runde, which isn't on Google Fonts, so it's self-hosted
  and subset rather than swapped out for Inter.
* The frame is wired as a prototype, which a static board doesn't show. Reading
  the `interactions` data gave the real behaviour of the photo cards, plus hover
  states on the masthead icons and the avatar. It also pointed at a photograph
  used by one card's second variant that appears nowhere in the visible frame and
  would otherwise have been impossible to find.
* Two card rectangles carry more than one image fill stacked on top of each
  other. That is how the second photograph of a listing is stored, and only the
  top one shows on a static board. One of those hidden fills is a real 2500x1557
  photograph that the arrows step to; the other is a 256x256 fully transparent
  placeholder, which is why that view has a single image and no arrows.

Measured against the frame at 1440, the built page puts the sales card at 857px
wide starting at y=202, the overview column at 407px, and the photo cards at 417
by 377. The design specifies 857, 407 and 418 by 378.

## Assumptions and trade-offs

The design is desktop only. One frame at 1440, no tablet or mobile board, so
everything below that width is my call. The full breakpoint ladder is in the
design spec, but two decisions are worth calling out here.

Below 1280 the nav becomes a horizontally scrollable strip rather than collapsing
into a hamburger. All six destinations stay one tap away, tab order doesn't
change, and there's no menu state to manage. A drawer would look more
conventional but it's the wrong pattern for a six item tab bar.

The masthead also drops from 82px to 64px on phones, because at the design height
the sticky chrome was eating about 18% of an iPhone viewport.

Beyond that:

* **The greeting and the avatar disagree.** The heading says "Welcome, Ahmed",
  the avatar says "D", and the hidden name layer says "Dylan Frank". I built what
  was drawn rather than quietly picking one, since I can't tell which is meant.
* **The three bar series aren't labelled anywhere.** Two of the three colours
  match the Total Inflow (blue) and MRR (green) figures exactly, so I read them as
  inflow, MRR and payout and labelled them that way in the accessible table.
* **Only the 1 Year range is specified.** I invented plausible 1 Week and 1 Month
  data so the range control does something instead of being decorative.
* **The photo cards follow the prototype, not a generic carousel.** The badge and
  the dots choose a view, Live Listings or All Listings, and each view has its own
  caption and its own photographs. The arrows step through the photographs inside
  the selected view, so they only appear where a view holds more than one. The
  most watchlisted card has a single photograph and nothing behind its other badge
  option, so that option renders disabled rather than switching to invented
  content.
* **The site visits card cycles every two seconds.** That's the prototype's own
  timing, a 1s hold plus a 1s transition. It is faster than I would normally pick
  for a dashboard, so it pauses on hover and on focus, and it does not run at all
  under `prefers-reduced-motion`.
* **Currency figures aren't force wrapped.** Three of the four tiles wrap mid
  number in Figma (`₦50,000,000` then `.00`) because their text boxes are
  narrower than the tiles. I let text flow naturally rather than hard coding a
  break inside a number.
* **Five routes are stubs.** Only the dashboard is designed, but five dead links
  in the nav felt worse than an honest empty state, and it shows the shell works
  across routes.

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

Every route is statically prerendered. Seven components opt into the client, and
each of those holds real state.

Open Runde subsets from 471 KB down to 67 KB across the three weights, self-hosted
with `display: swap` and a metric adjusted fallback so layout shift stays near
zero.

The three photographs went from 6.0 MB of PNG to 243 KB of WebP, sized to twice
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
