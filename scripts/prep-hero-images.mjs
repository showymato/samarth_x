// Prepares the owner-supplied hero characters (source-art/hero/engineer.png, doctor.png):
// both on ONE identical canvas, same face size, eyes aligned, so the JEE ⟷ NEET curtain
// splits a single face cleanly at 50%. Adds the white sticker edge used across the site.
// Outputs public/img/hero/aspirant-{engineer,doctor}.webp + public/img/hero-aspirant.png
// (the loader halftone and x-ray mask sample the engineer).
// Run: npm run gen:hero
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.join(process.cwd(), 'source-art', 'hero');
const OUT = path.join(process.cwd(), 'public', 'img', 'hero');
fs.mkdirSync(OUT, { recursive: true });

// Alignment, measured on the trimmed images. The doctor is drawn ~19% smaller in her file
// (hair width ~380 vs ~450 px, shoulders 730 vs 874 px), so she's scaled to the same body
// size as the engineer, centred on the same axis, and moved so the eye lines match.
// Both are cut at the same bottom edge (the engineer's file is already cropped there).
const BASE = { w: 904, h: 1325 }; // engineer, trimmed
const DOCTOR = { scale: 884 / 904, left: 10, top: 54 }; // 743 px → 884 px wide (×1.19)
const PAD = 24; // room for the white edge

const W = BASE.w + PAD * 2;
const OUT_W = 720; // ~360 px on screen at desktop, 2× for retina
const H = BASE.h + PAD * 2;
const blank = () => sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } });

async function place(file, { scale = 1, left = 0, top = 0 } = {}) {
  let img = sharp(path.join(SRC, file)).trim({ threshold: 1 });
  if (scale !== 1) img = img.resize({ width: Math.round(BASE.w * scale) });
  let buf = await img.png().toBuffer();
  // anything below the shared bottom edge is cut, so both figures end at the same line
  const { width, height } = await sharp(buf).metadata();
  const maxH = BASE.h - top;
  if (height > maxH) buf = await sharp(buf).extract({ left: 0, top: 0, width, height: maxH }).png().toBuffer();
  return blank().composite([{ input: buf, left: PAD + left, top: PAD + top }]).png().toBuffer();
}

// white sticker edge: dilate the alpha (blur + threshold) and put a white silhouette underneath
async function withEdge(buf) {
  const mask = await sharp(buf).extractChannel('alpha').blur(7).threshold(6).toBuffer();
  const white = await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } }).joinChannel(mask).png().toBuffer();
  return blank().composite([{ input: white }, { input: buf }]).png().toBuffer();
}

const engineer = await withEdge(await place('engineer.png'));
const doctor = await withEdge(await place('doctor.png', DOCTOR));

for (const [name, buf] of [['engineer', engineer], ['doctor', doctor]]) {
  const f = path.join(OUT, `aspirant-${name}.webp`);
  await sharp(buf).resize({ width: OUT_W }).webp({ quality: 84, alphaQuality: 90, effort: 6 }).toFile(f);
  console.log(`wrote public/img/hero/aspirant-${name}.webp`, `${OUT_W}×${Math.round((H * OUT_W) / W)}`, `${(fs.statSync(f).size / 1024).toFixed(0)} KB`);
}
await sharp(engineer).resize({ width: Math.round(W / 2) }).png({ compressionLevel: 9 }).toFile(path.join(process.cwd(), 'public', 'img', 'hero-aspirant.png'));
console.log('wrote public/img/hero-aspirant.png');
console.log(`set brand.cutoutW = ${OUT_W}, brand.cutoutH = ${Math.round((H * OUT_W) / W)} in lib/content.ts`);
