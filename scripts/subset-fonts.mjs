/**
 * Subsets Open Runde down to the characters this dashboard can actually render.
 *
 * The upstream woff2 files carry Inter's full glyph coverage (~155 KB each, 465 KB
 * for the three weights the design uses). The dashboard only ever draws Latin text
 * plus a naira sign, so subsetting cuts that by roughly 90%, a meaningful win on
 * a page whose fonts would otherwise dominate first load.
 *
 * Sources live in `design-source/fonts/` (not committed, fetched from
 * github.com/lauridskern/open-runde, SIL Open Font License 1.1). Run:
 *   pnpm fonts
 */
import subsetFont from 'subset-font';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'design-source', 'fonts');
const OUT = path.join(root, 'src', 'assets', 'fonts');

/** Weights the design uses: 400 body, 500 labels, 600 figures and headings. */
const WEIGHTS = [
  { file: 'OpenRunde-Regular.woff2', out: 'OpenRunde-Regular.subset.woff2', weight: 400 },
  { file: 'OpenRunde-Medium.woff2', out: 'OpenRunde-Medium.subset.woff2', weight: 500 },
  { file: 'OpenRunde-Semibold.woff2', out: 'OpenRunde-Semibold.subset.woff2', weight: 600 },
];

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)).join('');

/**
 * Written as escape sequences rather than literal glyphs so the charset survives
 * any tool that guesses at this file's encoding.
 */
const CHARSET = [
  range(0x20, 0x7e), // printable ASCII
  range(0xa0, 0xff), // Latin-1 supplement, for accented names in mock data
  '₦', // naira sign, used by every currency figure in the design
  '‘’“”', // curly quotes: "Total Riders' Credit" uses U+2019
  '–—…', // en dash, em dash, ellipsis
  '↑↓•×', // arrows, bullet, multiplication sign
].join('');

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

if (!existsSync(SRC)) {
  console.error(
    `Missing ${path.relative(root, SRC)}/, download Open Runde first (see script header).`,
  );
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

let before = 0;
let after = 0;

for (const { file, out, weight } of WEIGHTS) {
  const input = await readFile(path.join(SRC, file));
  const subset = await subsetFont(input, CHARSET, { targetFormat: 'woff2' });
  await writeFile(path.join(OUT, out), subset);

  before += input.length;
  after += subset.length;
  console.log(
    `${String(weight).padEnd(4)} ${out.padEnd(34)} ${kb(input.length).padStart(9)} -> ${kb(subset.length).padStart(8)}`,
  );
}

console.log(`\n${CHARSET.length} glyphs kept`);
console.log(
  `total ${kb(before)} -> ${kb(after)}  (${(100 - (after / before) * 100).toFixed(1)}% smaller)`,
);
