/**
 * Generates the favicon set from an "AD" monogram set in Source Serif 4 (600), converted to
 * vector paths with opentype.js so the SVG needs no font at runtime.
 *
 *   public/favicon.svg          vector, any size (teal square, paper-coloured monogram)
 *   public/favicon.ico          16 / 32 / 48 px (48 is the size Google Search asks for)
 *   public/icon-192.png         PWA + Android
 *   public/icon-512.png         PWA splash / large
 *   public/apple-touch-icon.png 180 px
 *
 * Usage: node scripts/icons.mjs [path/to/SourceSerif4-600.ttf]
 * The TTF is only needed at generation time; a static TrueType file of the weight-600 face works
 * (Google Fonts serves one for the request `css2?family=Source+Serif+4:wght@600` with a non-browser
 * user agent). The generated SVG is committed, so the build never needs the font.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import opentype from 'opentype.js';

const root = process.cwd();
const pub = path.join(root, 'public');
const ttf = process.argv[2];
if (!ttf || !fs.existsSync(ttf)) {
  console.error('icons: pass the path to a Source Serif 4 weight-600 .ttf file');
  process.exit(1);
}

const ACCENT = '#0E5C58';   // --accent (light theme); reads on light and dark backgrounds alike
const PAPER = '#F6F5F1';    // --bg

// 64-unit canvas. Rounded square, monogram centred optically (serif caps sit slightly high).
const buf = fs.readFileSync(ttf);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const text = 'AD';
const size = 38;                       // cap height ≈ 0.66 em → ~25 units tall
const glyphPath = font.getPath(text, 0, 0, size, { kerning: true, letterSpacing: -0.04 });
const bb = glyphPath.getBoundingBox();
const w = bb.x2 - bb.x1;
const h = bb.y2 - bb.y1;
const dx = (64 - w) / 2 - bb.x1;
const dy = (64 - h) / 2 - bb.y1 + 0.5;
const d = font.getPath(text, dx, dy, size, { kerning: true, letterSpacing: -0.04 }).toPathData(2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="12" fill="${ACCENT}"/>
<path fill="${PAPER}" d="${d}"/>
</svg>
`;
fs.writeFileSync(path.join(pub, 'favicon.svg'), svg);
console.log(`icons: favicon.svg ${svg.length} bytes (monogram bbox ${w.toFixed(1)}×${h.toFixed(1)})`);

const png = (px) => sharp(Buffer.from(svg), { density: 384 }).resize(px, px).png().toBuffer();
const ico = await pngToIco([await png(16), await png(32), await png(48)]);
fs.writeFileSync(path.join(pub, 'favicon.ico'), ico);
console.log(`icons: favicon.ico ${ico.length} bytes (16/32/48)`);
for (const [name, px] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  const buf = await png(px);
  fs.writeFileSync(path.join(pub, name), buf);
  console.log(`icons: ${name} ${buf.length} bytes`);
}
