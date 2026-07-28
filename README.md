# Expert Listing Dashboard

Implementation of the Expert Listing dashboard from the supplied Figma design,
built with Next.js, TypeScript and Tailwind CSS.

**Live:** _(deployment URL)_

## Running it

Needs Node 20 or newer. I used pnpm, but npm works fine too.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm images` | Regenerate the WebP assets from raw Figma exports |
| `pnpm fonts` | Re-subset the Open Runde web fonts |

The last two are only needed if you re-export from Figma. Their inputs live in
`design-source/`, which isn't committed. See [Asset pipeline](#asset-pipeline).

## Technology choices

**Next.js 16 (App Router).** One of the preferred options in the brief, and it
gives static prerendering, the image pipeline and font self-hosting without any
setup. Every route here is statically prerendered.

**TypeScript.** Data shapes live in `src/lib/types.ts`, separate from the
fixtures in `src/lib/mock-data.ts`. Swapping the mock layer for a real fetch is a
one file change.

**Tailwind CSS v4.** The design's values are defined as tokens in an `@theme`
block rather than sprinkled around as arbitrary values, so `text-ink-muted` and
`rounded-card` refer to something specific.

### What I chose not to install

The brief asked to keep things lightweight, so I made each dependency justify
itself. The runtime dependencies are React, React DOM and Next, and nothing else.

* **No charting library.** The design needs a single chart type with fixed
  geometry (4px bars, 3px apart, 18px between groups) and no axes, grid or
  legend. Recharts would add roughly 90 KB to produce something that's a few
  dozen lines of flexbox, and I'd have spent the time fighting its spacing rather
  than matching the design.
* **No icon package.** All 21 icons come from the Figma file itself, exported
  through the REST API and generated into inline React components in
  `src/components/icons/index.tsx`. More accurate than approximating with Lucide,
  and there's no icon library in the bundle.
* **No clsx or tailwind-merge.** Nothing in this UI overrides a utility that a
  variant already sets, so class conflict resolution would be about 7 KB doing
  nothing. `src/lib/cn.ts` is a ten line join.
* **No animation library.** The transitions are all CSS.

`sharp` and `subset-font` are devDependencies used by the asset scripts. Neither
reaches the browser.

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx           shell: header, main, chat button, skip link
│  ├─ page.tsx             the dashboard
│  ├─ fonts.ts             self-hosted Open Runde
│  ├─ globals.css          design tokens and page shell
│  └─ (listings|users|…)/  stub routes so no nav item 404s
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

`ui/` holds primitives that know nothing about this dashboard, `dashboard/`
composes them with data, and `layout/` is the application chrome. The data layer
never imports React: icons are referenced by string key and resolved through a
registry, so the fixtures could be replaced by an API response without touching
a component.

## Design fidelity

Rather than measuring things by eye, I pulled the file through the Figma REST API
and walked the node tree, so colours, type, spacing, radii and layout geometry
are read values rather than estimates. The full mapping is in
[docs/design-spec.md](docs/design-spec.md).

Some things that only turned up by reading the file rather than looking at it:

* The frame has six hidden layers that a visual copy would probably include by
  mistake: a seventh "Settings" nav item, a "+ New Listing" button, a "Help
  Centre" link, the user's name next to the avatar, and two icons inside the
  "View Transactions" button, which is text only as drawn. None of them are
  built.
* Two more layers are technically visible but render invisibly. There's a stray
  `204` text layer sitting behind the photo cards, and a white on white footer
  bar at the very bottom whose only text child is hidden. I confirmed both by
  cropping the rendered frame at those coordinates before dropping them.
* The chart's two arrow discs are different greys (`#f5f5f5` and `#e4e4e4`),
  which reads as a disabled and enabled pair. I wired them to real scroll state.
* Each photo card has two stacked gradient overlays, not one.
* The typeface is Open Runde, which isn't on Google Fonts. It's self-hosted and
  subset rather than swapped for Inter.

Measured against the Figma frame at 1440, the built page puts the sales card at
857px wide starting at y=202, the overview column at 407px wide, and the photo
cards at 417 by 377. The design specifies 857, 407 and 418 by 378.

## Assumptions and trade-offs

**The design is desktop only.** There's one frame at 1440 and no tablet or mobile
board, so everything below that width is my interpretation. The full breakpoint
ladder is in the design spec. Two calls worth flagging:

* Below 1280 the nav becomes a horizontally scrollable strip instead of
  collapsing into a hamburger drawer. All six destinations stay one tap away, tab
  order doesn't change, and there's no menu state to manage. A drawer would look
  more conventional but it's the wrong pattern for a six item tab bar.
* The masthead drops from 82px to 64px on phones. At the design height the sticky
  chrome was taking about 18% of an iPhone viewport.

**The greeting and the avatar disagree.** The heading says "Welcome, Ahmed", the
avatar says "D", and the hidden name layer says "Dylan Frank". I built what's
drawn instead of quietly picking one, since I can't tell which is intended.

**The three bar series aren't labelled.** Two of the three colours match the
Total Inflow (blue) and MRR (green) figures exactly, so I read them as inflow,
MRR and payout, and labelled them that way in the accessible table.

**Only the 1 Year range is specified.** I made up plausible 1 Week and 1 Month
datasets so the range control actually does something instead of being
decorative.

**Carousel slides change the caption, not the photo.** The design gives one image
per card. The second slide on each is mock data, and swapping the photo as well
would have meant inventing imagery that isn't in the file.

**Currency figures aren't force wrapped.** Three of the four tiles wrap mid
number in Figma (`₦50,000,000` then `.00`) because their text boxes are narrower
than the tiles they sit in. I let the text flow naturally rather than hard coding
a line break inside a number.

**Five routes are stubs.** Only the dashboard is designed, but leaving five dead
links in the primary nav seemed worse than an honest empty state, and it shows
the shell works across routes.

## Accessibility

* Semantic landmarks, a skip link, and `aria-current="page"` on the active tab.
* The segmented control and the Live/All filter use radio semantics with roving
  focus, so they're one tab stop and move with arrow keys.
* The chart is mirrored by a visually hidden data table, and each bar group is
  focusable with a full label, so the numbers aren't locked inside a picture.
* The delta indicators say "Up" or "Down" in hidden text, so direction isn't
  carried by colour and arrow shape alone.
* Icon only buttons have accessible names, decorative SVG is `aria-hidden`.
* Visible focus rings throughout, and `prefers-reduced-motion` is respected.

## Performance

* Every route is statically prerendered. Only four components are client
  components, and each of those holds real state.
* **Fonts:** Open Runde subset from 471 KB down to 67 KB across three weights,
  self-hosted with `display: swap` and a metric adjusted fallback to keep layout
  shift close to zero.
* **Images:** the three photographs went from 6.0 MB of PNG to 243 KB of WebP,
  sized to twice their render box, served through `next/image` with blur
  placeholders and `priority` on the one above the fold.
* **Icons:** inline SVG, so there's no icon font or sprite request.

## Asset pipeline

Raw exports from Figma live in `design-source/` and aren't committed, since
they're large and reproducible from the file. Two scripts turn them into what
ships:

```bash
pnpm images   # scripts/optimize-images.mjs  -> src/assets/listings/*.webp
pnpm fonts    # scripts/subset-fonts.mjs     -> src/assets/fonts/*.subset.woff2
```

Open Runde is licensed under the SIL Open Font License 1.1
([source](https://github.com/lauridskern/open-runde)).

## Given more time

Component tests around the carousel and the range switching, a real loading state
now that the data layer sits behind a typed contract, and container queries for
the chart so it responds to its card rather than the viewport.
