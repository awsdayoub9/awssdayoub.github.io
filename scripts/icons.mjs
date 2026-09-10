/**
 * Generates public/favicon.ico (32px, via png-to-ico) and public/apple-touch-icon.png (180px)
 * from the same geometry as public/favicon.svg (light palette; the SVG itself carries the
 * dark-mode media query). Usage: node scripts/icons.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = process.cwd();
const pub = path.join(root, 'public');

function svg(size, pad = 0) {
  // 64-unit geometry: paper square, two hairlines, one accent dot.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${64 + 2 * pad} ${64 + 2 * pad}" width="${size}" height="${size}">
  <rect x="${-pad}" y="${-pad}" width="${64 + 2 * pad}" height="${64 + 2 * pad}" fill="#F6F5F1"/>
  <rect x="4" y="4" width="56" height="56" rx="4" fill="#FFFFFF" stroke="#7E7A70" stroke-width="2"/>
  <path d="M14 24h36M14 34h36" stroke="#1A1F26" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="45" cy="46" r="5" fill="#0E5C58"/>
</svg>`;
}

const png32 = await sharp(Buffer.from(svg(32))).png().toBuffer();
const png16 = await sharp(Buffer.from(svg(16))).png().toBuffer();
const ico = await pngToIco([png16, png32]);
fs.writeFileSync(path.join(pub, 'favicon.ico'), ico);
console.log(`icons: favicon.ico ${ico.length} bytes`);

const apple = await sharp(Buffer.from(svg(180, 6))).png().toBuffer();
fs.writeFileSync(path.join(pub, 'apple-touch-icon.png'), apple);
console.log(`icons: apple-touch-icon.png ${apple.length} bytes`);
