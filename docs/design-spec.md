# Design spec

Working notes from translating the Figma file into code. Everything here was read
out of the file through the Figma REST API rather than measured by eye, so each
value traces back to a specific layer.

- **File:** `C8hFYZsdzyRwdhjzmFsgFH`, _ExpertListing Assessment_
- **Page:** `0:1`, _Feed_
- **Frame:** `717:1919`, _Dashboard_, 1440 by 1056
- **Last modified:** 2026-07-25

The file contains one frame at one width. There are no tablet or mobile boards,
so every breakpoint below 1440 is a judgement call. See
[Responsive behaviour](#responsive-behaviour).

## Layout geometry

At 1440 the design uses a 1284px content column with 78px gutters. `.shell` in
`globals.css` reproduces that:

```css
width: min(100% - (var(--shell-gutter) * 2), 1284px);
```

At 1440 this gives 1284px with 78px either side. Below about 1348 it falls back
to a fixed gutter.

| Region          | Figma                       | Notes                              |
| --------------- | --------------------------- | ---------------------------------- |
| Masthead        | `1440 x 82`, fill `#105b48` |                                    |
| Primary nav     | `1440 x 67`, fill `#ffffff` | 6 items, space-between across 1284 |
| Nav item        | `170 x 38`, radius 8        | active fill `#176d58` at 15%       |
| Page heading    | y 161                       | 12px below the nav                 |
| Sales card      | `(78, 202)` `857 x 377`     |                                    |
| Overview column | `(955, 202)` `407 x 377`    | 20px gap from the sales card       |
| Listings card   | `407 x 136`                 | 50px header strip                  |
| User card       | `407 x 221`                 | 50px header strip                  |
| Photo card row  | `(78, 609)` `1284 x 378`    | three at `418 x 378`               |
| Chat button     | `58 x 58`, fill `#242526`   |                                    |

The two overview cards plus their 20px gap add up to 377px, exactly the sales
card's height, so both columns bottom out together. The build keeps that
alignment even though the internal split is a few pixels different.

### Chart geometry

| Property           | Value                                     |
| ------------------ | ----------------------------------------- |
| Bar width          | 4px                                       |
| Gap within a group | 3px (group is 18px)                       |
| Gap between groups | 18px (36px pitch)                         |
| Series total width | 306px for 9 months                        |
| Axis span          | 0 to 50m over 130px, so 2.6px per million |
| Series colours     | `#4545fe`, `#12b76a`, `#f04438`           |

June's middle bar is 136px tall, deliberately overshooting the 50m axis label.
That's reproduced rather than clamped.

## Tokens

### Colour

| Token              | Value     | Used by                            |
| ------------------ | --------- | ---------------------------------- |
| `brand`            | `#105b48` | masthead, avatar glyph             |
| `brand-accent`     | `#176d58` | active nav label and its 15% tint  |
| `brand-deep`       | `#0c5d56` | Total Riders' Credit figure        |
| `data-blue`        | `#4545fe` | series 1, "View all", Total Inflow |
| `data-green`       | `#12b76a` | series 2, MRR, positive delta      |
| `data-red`         | `#f04438` | series 3                           |
| `data-orange`      | `#f97316` | Payout figure                      |
| `negative`         | `#dc2626` | falling delta label                |
| `highlight`        | `#ffff00` | figures over photography           |
| `canvas`           | `#fbfcfc` | page background                    |
| `surface`          | `#ffffff` | cards                              |
| `surface-muted`    | `#f9fafb` | card header strip                  |
| `surface-sunken`   | `#f5f5f5` | selected segment, disabled arrow   |
| `surface-invert`   | `#242526` | chat button, tooltip               |
| `line`             | `#e4e4e4` | card borders, enabled arrow        |
| `line-soft`        | `#f4f4f5` | masthead and nav hairlines         |
| `line-faint`       | `#e5e5e5` | carousel dot border                |
| `line-strong`      | `#d6d6d6` | View Transactions outline          |
| `ink`              | `#141414` | stat figures                       |
| `ink-strong`       | `#191919` | page and card headings             |
| `ink-title`        | `#292929` | overview card titles               |
| `ink-body`         | `#3d3d3d` | nav labels, tile labels            |
| `ink-muted`        | `#525252` | stat headings                      |
| `ink-subtle`       | `#606060` | chart subtitle                     |
| `ink-faint`        | `#919191` | chart axis labels                  |
| `ink-on-media`     | `#e4e4e7` | location line over photos          |
| `ink-on-media-dim` | `#d4d4d8` | inactive badge tab                 |

The photo cards carry two stacked gradients, not one:
`rgba(0,0,0,.05)` to `rgba(0,0,0,.6)`, underneath `rgba(0,0,0,.2)` to
`rgba(0,0,0,.8)`. That's the `media-scrim` utility.

### Type

The design is set in Open Runde, at weights 400, 500 and 600 only.

| Token  | Size / line height     | Example                          |
| ------ | ---------------------- | -------------------------------- |
| `2xs`  | 10 / 12                | axis labels, tile labels, deltas |
| `xs`   | 12 / 15                | chart subtitle, "View all"       |
| `sm`   | 13 / 20, 0.26 tracking | badge tabs, location line        |
| `base` | 14 / 17                | nav labels, stat headings        |
| `md`   | 16 / 19                |                                  |
| `lg`   | 18 / 22                | photo card titles and figures    |
| `xl`   | 19 / 25                | currency figures                 |
| `2xl`  | 20 / 24                | page heading, "Sales Overview"   |
| `3xl`  | 24 / 38                | overview stat figures            |

### Radii and effects

8px on controls, 12px on panels and photo cards, 16px on cards and the chart
arrow discs, fully round on the avatar and chat button.

There's exactly one shadow in the file, `-4px 0 12px rgba(0,0,0,0.04)`, on the
chart's scroll edge panel.

## Layers deliberately not built

The frame carries a number of hidden layers and leftovers. I found these by
walking the node tree for `visible: false` and cross checking against a render of
the frame.

Hidden in the source file, so not rendered and not built:

- A second row of three masthead icons
- A "Help Centre" link
- A "+ New Listing" button
- A seventh nav item, "Settings"
- The user's name and chevron beside the avatar (the avatar itself is visible)
- Two icons inside the "View Transactions" button, which is text only as drawn

Visible in the tree but invisible in the render, so treated as leftovers:

- A stray `204` text layer at `(348, 791)`, painted over by the photo card row
- A `1440 x 23` footer bar at the very bottom, white on near white, whose only
  text child ("Powered by Myxellia") is hidden

I confirmed both by cropping the rendered frame at those coordinates.

## Prototype behaviour

The frame is wired up as a prototype, which the static board does not show. These
came out of the `interactions` data on the nodes.

| Node                                         | Trigger            | Result                                               |
| -------------------------------------------- | ------------------ | ---------------------------------------------------- |
| `717:1985` site visits card                  | `AFTER_TIMEOUT` 1s | `CHANGE_TO 717:600`, SMART_ANIMATE, linear, 1s       |
| `717:1986` most clicked card, "All Listings" | `ON_CLICK`         | `CHANGE_TO 717:690`, no transition                   |
| 5 masthead icons                             | `ON_HOVER`         | variant swap, 300ms ease out (400ms for Marketplace) |
| Profile avatar                               | `ON_HOVER`         | `CHANGE_TO 717:1377`, SMART_ANIMATE 300ms            |
| Profile avatar                               | `ON_CLICK`         | opens an overlay                                     |
| "View all", "View Transactions", logo        | `ON_CLICK`         | navigate, no destination set                         |

So the photo cards are not carousels in the usual sense. Each is a two variant
component and the whole card swaps: photograph, caption and arrows together.

Reading the two destination variants gives their fills:

- `717:600` (site visits, second state) uses image `20f6149f6c`, which is not
  present anywhere in the visible frame. It is the only way to get that
  photograph out of the file.
- `717:690` (most clicked, All Listings) stacks `ece298d0` underneath
  `0e2748145f`. The one on top is the same photograph the site visits card uses,
  which is why selecting All Listings changes the picture. That variant also
  drops the prev/next arrows.

The masthead hover variants cannot be exported. They resolve as remote components
with no local geometry, so the API renders nothing for them. Their content was
read off the running prototype instead:

| Icon                | Tooltip         |
| ------------------- | --------------- |
| device-message      | Engagement      |
| search-status       | Search Activity |
| document with clock | Waitlist        |
| wallet              | Payoout Center  |
| shop                | Marketplace     |

These labels differ from the Figma layer names, which read "Comments", "Activity
Log", "Waitlist", "Payout Center" and "Marketplace". The tooltip text wins, since
that is what a user sees.

Each tooltip is a dark rounded panel below the icon with a caret pointing up at
it. The avatar is different: it opens a light panel showing "Dylan Frank" over
"dylanfran96@gmail.com", anchored to the avatar's right edge.

That resolves the hidden name layer sitting beside the avatar in the base frame.
It belongs to this hover card, not to the resting state.

### Stacked image fills

The file holds 44 image fills; 5 are reachable from the Dashboard frame. Two of
the card rectangles carry more than one image fill:

| Rectangle                   | Fills, bottom to top                        | Reading                                  |
| --------------------------- | ------------------------------------------- | ---------------------------------------- |
| Most clicked, Live Listings | `5cf13f962e` (FILL), `0a37afeb3f` (STRETCH) | two photographs of the same listing      |
| Most clicked, All Listings  | `ece298d0` (FILL), `0e2748145f` (STRETCH)   | one photograph over an empty placeholder |

Stacking fills on a single rectangle is how the second photograph is stored. Only
the top one is visible on the static board, but both are real images and the
prev/next arrows step between them. `5cf13f962e` is a 2500x1557 photograph and
ships as `most-clicked-2.webp`.

`ece298d0` is different. It is a 256x256 fully transparent PNG, so there is
nothing behind the All Listings photograph. That is why that view has a single
image and no arrows.

### Arrows against the badge

These are two separate controls and the design keeps them apart:

- The **badge**, and the dots beneath it, choose a view: Live Listings or All
  Listings. Each view has its own caption and its own photographs.
- The **arrows** step through the photographs inside the selected view. They
  appear only where a view holds more than one, which is why they are drawn on
  the most clicked card's Live Listings state and absent from its All Listings
  state.

The most watchlisted card has one photograph and nothing behind its other badge
option, so that option and its dot render disabled.

## Deviations from the source

All of these are deliberate.

1. **Currency figures aren't force wrapped.** Three of the four tiles wrap mid
   number in Figma (`₦50,000,000` then `.00`) because their text boxes are
   narrower than the tile. The build lets text flow naturally instead. At the
   design's 189px tile width the result is close, without hard coding a line
   break inside a number.
2. **The chat button is pinned to the viewport.** Figma parks it mid canvas at
   `(1312, 786)`, which is an artefact of a static board. Here it's
   `position: fixed`, bottom right.
3. **The chart's scroll edge is a gradient, not a solid panel.** Figma draws an
   opaque white rectangle because it sits past the final bar. As a live scroll
   affordance a gradient reads better and never hides a bar outright.
4. **Chart arrows reflect real scroll state.** In the design the left disc is
   `#f5f5f5` and the right is `#e4e4e4`, a disabled and enabled pair, consistent
   with a chart parked at its start. That's wired to actual overflow, so at 1440,
   where all nine months fit, both are disabled.
5. **The greeting and avatar disagree, and both are kept.** The heading reads
   "Welcome, Ahmed" while the avatar reads "D" and the hidden name layer says
   "Dylan Frank". Reproduced as drawn rather than quietly reconciled.
6. **Captions stagger instead of cross-dissolving.** The site visits card fades
   over a full second, per the prototype. Dissolving two different captions on
   top of each other for that long reads as doubled text, so the outgoing caption
   clears in the first 35% and the incoming one arrives at 40%. The photographs
   still cross-dissolve over the full duration.
7. **The All Listings swap gets a 220ms fade.** The prototype sets no transition
   on that click, so it would be instant. A short fade matches the 300ms the rest
   of the file uses and avoids a hard cut.
8. **The most watchlisted card's arrows are dropped.** The frame draws prev/next
   arrows, but that card holds a single photograph, so there is nothing to step
   between. Arrows appear only where a view has more than one image.
9. **The wallet tooltip's spelling is corrected.** The prototype reads "Payoout
   Center". Shipped as "Payout Center", since reproducing the typo would read as
   a mistake in the build rather than a faithful copy.
10. **The masthead wordmark collapses to its glyph below 640.** The design has no
    small viewport, and at 375 the full wordmark leaves no room for the five
    quick actions. Dropping to the glyph frees roughly 150px and keeps all five
    reachable at every width.

## Responsive behaviour

Derived, since the file only specifies 1440. Verified down to 320 with no
horizontal overflow at any width.

The chart tracks its container rather than being pinned to a fixed size. Bars stay
4px throughout and only the gap between groups flexes; once a band would fall
below 30px the arrows page through the months instead of letting the bars crowd.
At 1440 that lands on the design's 36px band exactly, and at 320 it shows five
months at a time.

| Breakpoint    | Layout                                                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| under 640     | Single column throughout. Masthead trims to 64px, the wordmark drops to its glyph so all five quick actions still fit, and their buttons grow to a 40px touch target. Stat tiles stack. |
| 640 to 959    | Photo cards go two up, stat tiles go two up. The chart sits above the tiles.                                                                                                            |
| 960 to 1023   | Chart and stat tiles move side by side inside the sales card.                                                                                                                           |
| 1024 to 1359  | Photo cards go three up.                                                                                                                                                                |
| 1360 and over | Sales card and overview column sit side by side, the sales card at its designed 857px.                                                                                                  |
| 1440          | Matches the Figma frame.                                                                                                                                                                |

The 1360 figure is not arbitrary. The design's content column is 1284 wide with
78px gutters, so 1360 is the first width where the two column split can give the
sales card its full 857px instead of squeezing it. Splitting earlier left the
chart too narrow and forced it to scroll; splitting later left a lot of empty
space beside the series. Between 960 and 1359 the card is full width but the
chart and tiles still sit side by side, so the space is used.

Where the chart is wider than the 306px the series needs, the series centres.
Auto margins resolve to zero once the content overflows, so nothing is pushed out
of reach when it does scroll.

Below 1280 the nav becomes a horizontally scrollable strip rather than collapsing
into a drawer. Six destinations stay one tap away, tab order doesn't change, and
there's no menu state to manage.

The chart scrolls horizontally whenever its container is narrower than the 306px
series, using the arrows that are already part of the design.
