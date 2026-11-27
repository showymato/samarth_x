// Generates the hero "sticker-collage aspirant": two inline SVGs that Hero.tsx
// inlines at build time (lib/art/*.svg), plus the PNG the loader halftone and the
// x-ray silhouette mask sample (public/img/hero-aspirant.png).
// 100% original vector art, drawn on the x-ray skeleton's pose (289×695).
// Run: npm run gen:aspirant
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const W = 289;
const H = 695;
const C = {
  ink: '#1e1420',
  navy: '#2a2848',
  navyD: '#1d1b36',
  lav: '#8b5cf6',
  lavL: '#c7b3ff',
  pink: '#ff4f9a',
  pinkD: '#e0428f',
  baby: '#ffb8dc',
  butter: '#ffe45c',
  cream: '#fbf5f6',
  tee: '#f6f1e8',
  teeD: '#e3dacb',
  skin: '#c98d6b',
  skinD: '#a8704f',
  hair: '#24161c',
};
const SANS = 'Geist, Arial, sans-serif';
const MONO = "'Geist Mono', Consolas, monospace";
const HAND = "'Momo Signature', 'Segoe Script', cursive";
const SERIF = "'Instrument Serif', Georgia, serif";

/* ───────── shapes (shared by the art and the torn-paper outline) ───────── */
const S = {
  hairBack: 'M76 26C90 6 128 2 142 24C152 42 150 78 152 108C155 138 162 168 152 198C142 184 134 152 130 122L88 122C84 154 76 196 58 240C44 228 40 200 46 170C52 140 62 108 66 80C67 58 69 40 76 26Z',
  jog: 'M48 394C100 402 170 402 226 392C232 470 226 560 222 662L166 662C164 590 158 520 146 440L140 440C134 520 136 590 136 662L86 662C82 590 74 500 48 394Z',
  tee: 'M40 168C52 152 76 144 96 140C104 150 118 150 126 140C148 142 172 147 192 158C205 172 207 190 204 206C212 270 220 340 226 398C160 410 84 410 48 404C50 330 52 260 46 196C44 184 42 174 40 168Z',
  sleeveR: 'M178 148C200 150 222 152 238 155L226 194C214 191 204 193 196 201C190 186 184 168 178 148Z',
  sleeveL: 'M40 166C52 156 64 160 66 176C64 205 60 240 57 266C44 264 26 262 12 260C17 225 26 190 40 166Z',
  drapeL: 'M44 398C30 440 32 486 44 528L72 524C64 484 62 444 68 408Z',
  drapeR: 'M224 396C240 440 238 488 226 528L200 524C206 484 206 444 204 408Z',
  band: 'M42 384C100 397 170 397 230 383L234 409C170 422 100 422 40 409Z',
  knotSleeveA: 'M124 410C118 432 116 456 120 482L136 482C134 458 134 434 138 412Z',
  knotSleeveB: 'M138 410C146 432 152 452 158 478L172 472C164 450 156 428 148 407Z',
  shoeL: 'M80 654h58c5 0 9 7 11 15l3 12c1 6-2 10-8 10H78c-6 0-9-4-7-10z',
  shoeR: 'M160 654h60c5 0 8 7 10 15l3 12c1 6-2 10-8 10h-66c-6 0-8-4-7-10z',
  headTop: 'M80 48C82 26 96 14 110 14C126 14 138 26 140 48Z',
  phone: 'M84 44h54a10 10 0 0 1 10 10v38a10 10 0 0 1-10 10H84a10 10 0 0 1-10-10V54a10 10 0 0 1 10-10z',
};
const limbs = [
  ['M38 236L29 320', 20],
  ['M29 320L33 404', 16],
  ['M206 170L254 181', 21],
  ['M254 181L186 92', 17],
  ['M168 76L150 58', 8],
  ['M172 72L150 66', 8],
  ['M170 82L150 76', 8],
  ['M168 90L152 88', 7],
];
const limb = (d, w, c = C.skin) =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

/* torn white paper edge + paper grain, applied only to the outline layer */
const tornFilter = (id) => `<filter id="${id}" x="-12%" y="-6%" width="124%" height="112%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".085" numOctaves="2" seed="7" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="1" seed="3" result="g"/>
  <feColorMatrix in="g" type="matrix" values="0 0 0 0 .78 0 0 0 0 .74 0 0 0 0 .68 1.3 0 0 0 -.62" result="gt"/>
  <feComposite in="gt" in2="d" operator="in" result="gi"/>
  <feMerge><feMergeNode in="d"/><feMergeNode in="gi"/></feMerge>
</filter>`;

const outlineBody = `<g filter="url(#ax-torn)" fill="#fff" stroke="#fff" stroke-width="18" stroke-linejoin="round" stroke-linecap="round">
  ${['hairBack', 'jog', 'tee', 'sleeveR', 'sleeveL', 'drapeL', 'drapeR', 'band', 'knotSleeveA', 'knotSleeveB', 'shoeL', 'shoeR', 'phone']
    .map((k) => `<path d="${S[k]}"/>`)
    .join('')}
  ${limbs.map(([d, w]) => `<path d="${d}" fill="none" stroke-width="${w + 18}"/>`).join('')}
  <ellipse cx="35" cy="424" rx="10" ry="19"/><ellipse cx="174" cy="82" rx="15" ry="13"/><circle cx="254" cy="181" r="10"/>
</g>`;

const screens = [
  ['streak', '🔥 42'],
  ['sunday mock', '214/300 ↑18'],
  ['reels', 'blocked 🚫'],
  ['mentor call', '7 pm'],
];

const figure = `<svg xmlns="http://www.w3.org/2000/svg" class="ax__fig" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" overflow="visible" aria-hidden="true" focusable="false">
<defs>
  ${tornFilter('ax-torn')}
  <linearGradient id="ax-scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.navy}"/><stop offset="1" stop-color="#4b2d86"/></linearGradient>
</defs>
<g class="ax__body">
  ${outlineBody}
  <path d="${S.hairBack}" fill="${C.hair}"/>
  <path d="${S.drapeL}" fill="${C.pink}"/><path d="${S.drapeR}" fill="${C.pinkD}"/>
  <path d="${S.jog}" fill="${C.navy}"/>
  <path d="M51 402C76 500 86 600 90 662" stroke="#fff" stroke-opacity=".85" stroke-width="4" fill="none"/>
  <path d="M223 400C224 500 220 600 218 662" stroke="#fff" stroke-opacity=".85" stroke-width="4" fill="none"/>
  <path d="M141 446C141 520 138 600 138 662M145 446C150 520 160 600 164 662" stroke="${C.navyD}" stroke-width="3" fill="none"/>
  <!-- sneakers with doodles -->
  <g stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round">
    <path d="${S.shoeL}" fill="#fff"/><path d="${S.shoeR}" fill="#fff"/>
  </g>
  <path d="M72 684h80M152 684h80" stroke="${C.lav}" stroke-width="5" stroke-linecap="round"/>
  <path d="M96 664l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="${C.butter}" stroke="${C.ink}" stroke-width=".8"/>
  <path d="M116 668c4-4 8 4 12 0s8 4 12 0" stroke="${C.pink}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M178 666c4-4 8 4 12 0s8 4 12 0" stroke="${C.lav}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="212" cy="668" r="4" fill="${C.pink}"/>
  <!-- hanging arm, in front of the tee -->
  <path d="${S.tee}" fill="${C.tee}"/>
  <path d="${S.sleeveR}" fill="${C.tee}"/>
  ${limb('M206 170L254 181', 21)}
  <path d="${S.sleeveR}" fill="${C.tee}"/>
  <path d="${S.sleeveL}" fill="${C.tee}"/>
  <path d="M12 260C26 262 44 264 57 266M238 155L226 194" stroke="${C.teeD}" stroke-width="3" fill="none"/>
  <path d="M66 236C72 280 70 330 66 380M196 214C200 270 204 330 208 380" stroke="${C.teeD}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${limb('M38 236L29 320', 20)}
  ${limb('M29 320L33 404', 16)}
  <ellipse cx="35" cy="424" rx="9.5" ry="19" fill="${C.skin}"/>
  <path d="M30 432l1 14M36 432l1.5 15M41 430l2 12" stroke="${C.skinD}" stroke-width="3" stroke-linecap="round"/>
  <g fill="${C.butter}" stroke="${C.ink}" stroke-opacity=".3">
    <ellipse cx="33" cy="405" rx="12.5" ry="6"/>
    <circle cx="23" cy="405" r="3.6"/><circle cx="43" cy="405" r="3.6"/><circle cx="28" cy="401" r="3.2"/><circle cx="38" cy="401" r="3.2"/>
  </g>
  <!-- tee print: SHOW UP daily. + the 42 badge -->
  <g transform="rotate(-4 120 280)">
    <rect x="70" y="232" width="104" height="104" rx="14" fill="${C.lav}"/>
    <text x="122" y="268" text-anchor="middle" font-family="${SANS}" font-size="23" font-weight="800" fill="${C.butter}" letter-spacing="-1">SHOW</text>
    <text x="122" y="294" text-anchor="middle" font-family="${SANS}" font-size="23" font-weight="800" fill="#fff" letter-spacing="-1">UP</text>
    <text x="122" y="320" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="24" fill="${C.baby}">daily.</text>
    <circle cx="170" cy="236" r="15" fill="${C.pink}" stroke="#fff" stroke-width="2"/>
    <text x="170" y="241" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="700" fill="#fff">42</text>
  </g>
  <!-- hoodie tied at the waist -->
  <path d="${S.band}" fill="${C.pink}"/>
  <path d="M42 396C100 409 170 409 232 396" stroke="${C.pinkD}" stroke-width="2" fill="none" stroke-dasharray="5 4"/>
  <path d="${S.knotSleeveA}" fill="${C.pink}"/><path d="${S.knotSleeveB}" fill="${C.pinkD}"/>
  <path d="M118 474h20M156 470l14-6" stroke="${C.baby}" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="138" cy="406" rx="13" ry="10" fill="${C.pinkD}"/>
  <!-- neck, chin -->
  <path d="M97 104h24v34c-4 8-20 8-24 0z" fill="${C.skinD}"/>
  <ellipse cx="109" cy="104" rx="21" ry="15" fill="${C.skin}"/>
  <path d="M96 140C104 149 118 149 126 140" stroke="${C.teeD}" stroke-width="4" fill="none"/>
  <path d="M80 60C72 100 70 150 62 200C58 214 54 224 50 230C60 200 62 160 66 120C68 96 72 74 80 60Z" fill="${C.hair}"/>
  <path d="M140 64C146 96 150 128 156 156C150 140 142 110 138 86Z" fill="${C.hair}"/>
</g>
<!-- head: tilts toward the cursor -->
<g class="ax__head">
  <path d="${S.headTop}" filter="url(#ax-torn)" fill="#fff" stroke="#fff" stroke-width="18" stroke-linejoin="round"/>
  <path d="${S.headTop}" fill="${C.hair}"/>
  <g transform="translate(128 22)">
    <path d="M0 0C-8 -10 -18 -10 -16 0C-18 10 -8 10 0 0ZM0 0C8 -10 18 -10 16 0C18 10 8 10 0 0Z" fill="${C.lav}" stroke="#fff" stroke-width="2.5"/>
    <circle r="3.6" fill="${C.baby}"/>
  </g>
  <!-- headphones: slide on in focus mode -->
  <g class="ax__hp" opacity="0">
    <path d="M66 66C62 18 156 18 152 66" fill="none" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>
    <path d="M70 60C68 28 150 28 148 60" fill="none" stroke="${C.lav}" stroke-width="2.4"/>
    <rect x="56" y="50" width="18" height="30" rx="8" fill="${C.pink}" stroke="${C.ink}" stroke-width="2"/>
    <rect x="144" y="50" width="18" height="30" rx="8" fill="${C.pink}" stroke="${C.ink}" stroke-width="2"/>
  </g>
</g>
<!-- phone (screen cycles) + the hand holding it -->
<g class="ax__phone">
  <path d="${S.phone}" fill="${C.ink}"/>
  <rect x="78" y="48" width="66" height="50" rx="7" fill="url(#ax-scr)"/>
  <rect x="104" y="51" width="14" height="3" rx="1.5" fill="#000" opacity=".5"/>
  ${screens
    .map(
      ([a, b], i) => `<g class="ax__scr" data-ax-scr="${i}"${i ? ' opacity="0"' : ''}>
    <text x="111" y="68" text-anchor="middle" font-family="${MONO}" font-size="6.6" letter-spacing=".4" fill="${C.baby}">${a.toUpperCase()}</text>
    <text x="111" y="86" text-anchor="middle" font-family="${SANS}" font-size="11.5" font-weight="700" fill="#fff">${b}</text>
  </g>`,
    )
    .join('\n  ')}
</g>
<g class="ax__arm">
  ${limb('M254 181L186 92', 17)}
  <circle cx="254" cy="181" r="10" fill="${C.skin}"/>
  <ellipse cx="174" cy="82" rx="15" ry="13" fill="${C.skin}"/>
  ${limbs.slice(4).map(([d, w]) => limb(d, w)).join('')}
  <path d="M150 58h-1M150 66h-1" stroke="${C.skinD}" stroke-width="2"/>
</g>
</svg>`;

/* ───────── stickers around the figure (each its own <g>) ───────── */
// placement <g> (static) › .ax-s (scroll peel) › .ax-f (idle float)
const sticker = (name, x, y, r, dir, depth, body, extra = '') =>
  `<g transform="translate(${x} ${y}) rotate(${r})"><g class="ax-s ax-s--${name}" data-dir="${dir}" data-depth="${depth}"${extra}><g class="ax-f">${body}</g></g></g>`;
const back = (shape) =>
  `<g transform="translate(2 3)" fill="${C.ink}" opacity=".14">${shape}</g><g fill="#fff" stroke="#fff" stroke-width="6" stroke-linejoin="round">${shape}</g>`;

const dna = (() => {
  const n = 40;
  const pa = [];
  const pb = [];
  const rungs = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y = 8 + t * 68;
    const s = Math.sin(t * Math.PI * 3);
    pa.push(`${(20 + 11 * s).toFixed(1)} ${y.toFixed(1)}`);
    pb.push(`${(20 - 11 * s).toFixed(1)} ${y.toFixed(1)}`);
    if (i % 4 === 2) rungs.push(`M${(20 + 11 * s).toFixed(1)} ${y.toFixed(1)}H${(20 - 11 * s).toFixed(1)}`);
  }
  return `<path d="${rungs.join('')}" stroke="${C.lavL}" stroke-width="2"/>
    <path d="M${pa.join('L')}" fill="none" stroke="${C.lav}" stroke-width="3" stroke-linecap="round"/>
    <path d="M${pb.join('L')}" fill="none" stroke="${C.pink}" stroke-width="3" stroke-linecap="round"/>`;
})();

const stickers = `<svg xmlns="http://www.w3.org/2000/svg" class="ax__stk" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" overflow="visible" aria-hidden="true" focusable="false">
<!-- static doodles: coffee ring, washi tape, formulas -->
<g class="ax-d" aria-hidden="true">
  <g fill="none" stroke="${C.navy}" stroke-opacity=".16" stroke-linecap="round">
    <circle cx="262" cy="560" r="25" stroke-width="3.5" stroke-dasharray="46 4 30 6 60 3"/>
    <circle cx="263" cy="561" r="21" stroke-width="1.5" stroke-dasharray="20 10 40 6"/>
  </g>
  <g transform="translate(14 146) rotate(-32)">
    <rect width="64" height="16" fill="${C.pink}" fill-opacity=".55"/>
    <path d="M8 0l-6 16M20 0l-6 16M32 0l-6 16M44 0l-6 16M56 0l-6 16" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
  </g>
  <g transform="translate(-70 300) rotate(-5)">
    <text font-family="${HAND}" font-size="17" fill="${C.lav}">F = ma</text>
    <path d="M0 7c10 4 22-2 32 2s18 0 26 2" stroke="${C.lav}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <g transform="translate(-76 500) rotate(-4)">
    <text font-family="${HAND}" font-size="14" fill="${C.navy}">PV = nRT</text>
  </g>
</g>
${sticker('pend', -70, 116, -6, -1, 0.7, `${back('<rect width="54" height="72" rx="7"/>')}
  <rect width="54" height="72" rx="7" fill="${C.cream}"/>
  <path d="M8 10H46" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/>
  <g class="ax__pend"><path d="M27 10V50" stroke="${C.ink}" stroke-width="1.5"/><circle cx="27" cy="54" r="7" fill="${C.lav}"/></g>
  <path d="M13 48a16 16 0 0 0 28 0" stroke="${C.pink}" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>
  <text x="27" y="68" text-anchor="middle" font-family="${MONO}" font-size="5.6" fill="${C.ink}">T = 2π√(l/g)</text>`)}
${sticker('pyq', -64, 214, -8, -1, 1, `${back('<rect width="60" height="36" rx="9"/>')}
  <rect width="60" height="36" rx="9" fill="${C.lav}"/>
  <text x="9" y="21" font-family="${SANS}" font-size="17" font-weight="800" fill="#fff" letter-spacing="-.5">PYQ</text>
  <text x="9" y="31" font-family="${MONO}" font-size="6.4" fill="${C.butter}">20 YRS ✓</text>`)}
${sticker('ncert', -68, 332, 5, -1, 0.85, `${back('<rect width="66" height="30" rx="8"/>')}
  <rect width="66" height="30" rx="8" fill="${C.navy}"/>
  <text x="9" y="20" font-family="${SANS}" font-size="12" font-weight="700" fill="${C.cream}">NCERT <tspan fill="${C.butter}">✓</tspan></text>`)}
${sticker('note', -84, 404, -5, -1, 0.6, `${back('<rect width="74" height="72" rx="3"/>')}
  <rect width="74" height="72" rx="3" fill="${C.butter}"/>
  <rect x="24" y="-6" width="28" height="12" fill="${C.pink}" fill-opacity=".7" transform="rotate(4 38 0)"/>
  <text x="8" y="30" font-family="${HAND}" font-size="11" fill="${C.ink}">kal se nahi,</text>
  <text x="8" y="50" font-family="${HAND}" font-size="13" fill="${C.pinkD}">aaj se.</text>`)}
${sticker('atom', 230, 26, 0, 1, 0.9, `${back('<circle cx="29" cy="29" r="30"/>')}
  <circle cx="29" cy="29" r="30" fill="${C.cream}"/>
  <g class="ax__orb" fill="none" stroke="${C.lav}" stroke-width="1.7">
    <ellipse cx="29" cy="29" rx="22" ry="8"/>
    <ellipse cx="29" cy="29" rx="22" ry="8" transform="rotate(60 29 29)"/>
    <ellipse cx="29" cy="29" rx="22" ry="8" transform="rotate(120 29 29)"/>
    <circle cx="51" cy="29" r="2.4" fill="${C.navy}" stroke="none"/><circle cx="18" cy="10" r="2.4" fill="${C.navy}" stroke="none"/><circle cx="18" cy="48" r="2.4" fill="${C.navy}" stroke="none"/>
  </g>
  <circle cx="29" cy="29" r="4.5" fill="${C.pink}"/>`)}
${sticker('air', 282, 112, 9, 1, 1.1, `${back('<circle cx="28" cy="28" r="28"/>')}
  <circle cx="28" cy="28" r="28" fill="${C.pink}"/>
  <circle cx="28" cy="28" r="23" fill="none" stroke="#fff" stroke-opacity=".5" stroke-dasharray="3 3"/>
  <text x="28" y="22" text-anchor="middle" font-family="${MONO}" font-size="8" letter-spacing="1" fill="#fff">AIR</text>
  <text x="28" y="41" text-anchor="middle" font-family="${SANS}" font-size="19" font-weight="800" fill="#fff">??</text>`)}
${sticker('dna', 214, 296, 10, 1, 0.75, `${back('<rect width="40" height="84" rx="9"/>')}
  <rect width="40" height="84" rx="9" fill="${C.cream}"/>
  ${dna}`)}
${sticker('reels', 248, 486, -7, 1, 0.95, `${back('<rect width="72" height="34" rx="10"/>')}
  <rect width="72" height="34" rx="10" fill="${C.ink}"/>
  <rect x="8" y="8" width="18" height="18" rx="5" fill="${C.pink}"/>
  <path d="M14 12.5v9l7-4.5z" fill="#fff"/>
  <text x="32" y="17" font-family="${SANS}" font-size="11" font-weight="700" fill="#fff">reels</text>
  <text x="32" y="27" font-family="${MONO}" font-size="6.2" fill="${C.baby}">“5 min”</text>`)}
<!-- focus mode pill + thumbs-up (hidden until used) -->
<g class="ax__pill" opacity="0" transform="translate(190 104)">
  <rect width="104" height="24" rx="12" fill="${C.ink}" stroke="#fff" stroke-width="3"/>
  <circle cx="13" cy="12" r="4" fill="${C.pink}"/>
  <text x="23" y="16" font-family="${MONO}" font-size="9.5" fill="#fff">focus mode: ON</text>
</g>
<g transform="translate(14 486)"><g class="ax__thumb" opacity="0">
  <circle r="19" fill="#fff" stroke="${C.lav}" stroke-width="3"/>
  <text y="8" text-anchor="middle" font-size="21">👍</text>
</g></g>
</svg>`;

const artDir = path.join(process.cwd(), 'lib', 'art');
fs.mkdirSync(artDir, { recursive: true });
fs.writeFileSync(path.join(artDir, 'aspirant-figure.svg'), figure);
fs.writeFileSync(path.join(artDir, 'aspirant-stickers.svg'), stickers);
console.log('wrote lib/art/aspirant-figure.svg', `${(figure.length / 1024).toFixed(1)} KB`);
console.log('wrote lib/art/aspirant-stickers.svg', `${(stickers.length / 1024).toFixed(1)} KB`);

// raster copy for the loader halftone + x-ray silhouette mask (character only, 2×)
await sharp(Buffer.from(figure.replace(`width="${W}" height="${H}"`, `width="${W * 2}" height="${H * 2}"`)))
  .png()
  .toFile(path.join(process.cwd(), 'public', 'img', 'hero-aspirant.png'));
console.log('wrote public/img/hero-aspirant.png');
