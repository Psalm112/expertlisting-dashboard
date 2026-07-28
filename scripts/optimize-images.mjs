/**
 * Turns the raw photography exported from the Figma source file into the
 * sized WebP assets the dashboard actually ships.
 *
 * The originals are 0.4-5.5 MB PNGs (up to 4096px wide) which is far more than
 * a 418x378 card needs. Each is resized to 2x the card's CSS box and re-encoded
 * as WebP, which takes the three images from ~6 MB to well under 200 KB total.
 *
 * Raw exports live in `design-source/` and are intentionally NOT committed -
 * they are large, and they are reproducible from the Figma file. Run:
 *   pnpm images
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'design-source');
const OUT = path.join(root, 'src', 'assets', 'listings');

// The metric cards render at 418x378 CSS px; 2x covers high-density displays.
const CARD = { width: 418 * 2, height: 378 * 2 };

/**
 * Figma image-fill hash -> shipped asset name.
 *
 * The most clicked card carries two image fills stacked on one rectangle. That
 * is how the second photograph of the same listing is stored, and the prev/next
 * arrows step between them.
 */
const ASSETS = [
  { from: 'fill-1.png', to: 'site-visits.webp', position: 'centre' },
  { from: 'fill-3.png', to: 'most-clicked.webp', position: 'centre' },
  { from: 'fill-2.png', to: 'most-clicked-2.webp', position: 'centre' },
  { from: 'fill-4.png', to: 'most-watchlisted.webp', position: 'centre' },
  { from: 'fill-5.png', to: 'listing-views.webp', position: 'centre' },
];

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

if (!existsSync(SRC)) {
  console.error(`Missing ${path.relative(root, SRC)}/ - export the image fills from Figma first.`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

let before = 0;
let after = 0;

for (const asset of ASSETS) {
  const src = path.join(SRC, asset.from);
  const out = path.join(OUT, asset.to);

  const input = await stat(src);
  await sharp(src)
    .resize(CARD.width, CARD.height, { fit: 'cover', position: asset.position })
    .webp({ quality: 82, effort: 6 })
    .toFile(out);
  const output = await stat(out);

  before += input.size;
  after += output.size;
  console.log(
    `${asset.to.padEnd(24)} ${kb(input.size).padStart(9)} -> ${kb(output.size).padStart(8)}`,
  );
}

const unused = (await readdir(SRC)).filter((f) => !ASSETS.some((a) => a.from === f));
if (unused.length) console.log(`\nskipped (not visible in the design): ${unused.join(', ')}`);

console.log(
  `\ntotal ${kb(before)} -> ${kb(after)}  (${(100 - (after / before) * 100).toFixed(1)}% smaller)`,
);
