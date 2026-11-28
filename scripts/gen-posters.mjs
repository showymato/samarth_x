// Generates the typographic motivation posters for "the wall" gallery.
// Same sizes as the gallery tiles they replace; each SVG carries a little CSS
// animation so it moves as a plain <img> (and in the lightbox).
// Run: npm run gen:posters
import fs from 'fs';
import path from 'path';

const out = path.join(process.cwd(), 'public', 'img', 'wall');
fs.mkdirSync(out, { recursive: true });

const SANS = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = 'Consolas, Menlo, monospace';

const C = {
  ink: '#1e1420',
  paper: '#fbf5f6',
  lav: '#8b5cf6',
  pink: '#ff4f9a',
  baby: '#ffb8dc',
  butter: '#ffe45c',
  orange: '#ff6b1a',
  green: '#12a150',
  blush: '#ffe1ef',
};

const css = `
  .spin{transform-box:fill-box;transform-origin:center;animation:spin 14s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .blink{animation:blink 1.1s steps(1) infinite}
  @keyframes blink{50%{opacity:0}}
  .pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.4s ease-in-out infinite}
  @keyframes pulse{50%{transform:scale(1.12)}}
  .drift{animation:drift 7s ease-in-out infinite alternate}
  @keyframes drift{to{transform:translateX(-40px)}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

const star = (x, y, r, fill) =>
  `<path class="spin" fill="${fill}" d="M${x} ${y - r}L${x + r * 0.22} ${y - r * 0.22}L${x + r} ${y}L${x + r * 0.22} ${y + r * 0.22}L${x} ${y + r}L${x - r * 0.22} ${y + r * 0.22}L${x - r} ${y}L${x - r * 0.22} ${y - r * 0.22}Z"/>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * lines: [text, style] where style is 'sans' | 'serif' | 'mono'
 * size: font size for all big lines (chosen per poster so the longest line fits 560px)
 */
function poster({ file, w, h, bg, fg, accent, lines, size, top, by, n, extra = '' }) {
  const lh = size * 1.02;
  const body = lines
    .map(([t, s, col], i) => {
      const fam = s === 'serif' ? SERIF : s === 'mono' ? MONO : SANS;
      const weight = s === 'sans' ? 'font-weight="900"' : '';
      const italic = s === 'serif' ? 'font-style="italic"' : '';
      const ls = s === 'sans' ? `letter-spacing="${-size * 0.045}"` : '';
      const fs2 = s === 'serif' ? size * 1.08 : s === 'mono' ? size * 0.62 : size;
      return `<text x="40" y="${top + i * lh}" font-family="${fam}" ${weight} ${italic} ${ls} font-size="${fs2}" fill="${col || fg}">${esc(t)}</text>`;
    })
    .join('\n');
  const lastY = top + (lines.length - 1) * lh;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<style>${css}</style>
<defs><pattern id="dt" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1" fill="#000" fill-opacity=".07"/></pattern></defs>
<rect width="${w}" height="${h}" fill="${bg}"/>
${extra}
${body}
<rect class="blink" x="${40}" y="${lastY + 18}" width="${size * 0.5}" height="${Math.max(6, size * 0.09)}" fill="${accent}"/>
${by ? `<text x="40" y="${h - 70}" font-family="${SERIF}" font-style="italic" font-size="30" fill="${accent}">— ${esc(by)}</text>` : ''}
<text x="40" y="${h - 32}" font-family="${MONO}" font-size="15" letter-spacing="3" fill="${fg}" fill-opacity=".6">THE WALL · POSTER ${n} · 2026</text>
${star(w - 58, h - 40, 16, accent)}
<rect width="${w}" height="${h}" fill="url(#dt)" pointer-events="none"/>
</svg>`;
  fs.writeFileSync(path.join(out, file), svg);
  console.log('wrote', file);
}

const ring = (cx, cy, r, col, op = 1) => `<circle class="pulse" cx="${cx}" cy="${cy}" r="${r}" fill="${col}" fill-opacity="${op}"/>`;

const posters = [
  {
    file: 'poster-01.svg', w: 640, h: 905, bg: C.ink, fg: '#fff', accent: C.butter, size: 90, top: 230, n: '01',
    lines: [['Motivation', 'sans'], ['gets you to', 'sans'], ['the desk.', 'sans'], ['Small habits', 'sans', C.butter], ['keep you', 'sans', C.butter], ['there.', 'serif', C.baby]],
    extra: ring(520, 110, 70, C.lav, 0.55),
  },
  {
    file: 'poster-02.svg', w: 640, h: 640, bg: C.lav, fg: '#fff', accent: C.butter, size: 64, top: 150, n: '02',
    lines: [['The syllabus', 'sans'], ['is finite.', 'sans'], ['You’ll get', 'sans', C.butter], ['through it.', 'serif', C.baby]],
  },
  {
    file: 'poster-03.svg', w: 640, h: 960, bg: C.butter, fg: C.ink, accent: C.pink, size: 72, top: 240, n: '03',
    lines: [['Nobody gets', 'sans'], ['ready in', 'sans'], ['a day.', 'sans'], ['Everyone', 'sans', C.lav], ['who did,', 'sans', C.lav], ['did it', 'sans', C.lav], ['day by day.', 'serif', C.pink]],
    extra: `<g class="drift">${Array.from({ length: 14 }, (_, i) => `<rect x="${40 + i * 44}" y="80" width="34" height="34" rx="8" fill="${i < 11 ? C.green : C.ink}" fill-opacity="${i < 11 ? 0.85 : 0.12}"/>`).join('')}</g>`,
  },
  {
    file: 'poster-04.svg', w: 640, h: 640, bg: C.paper, fg: C.ink, accent: C.lav, size: 62, top: 150, n: '04',
    lines: [['Progress is', 'sans'], ['a lagging', 'sans'], ['indicator of', 'sans'], ['your habits.', 'serif', C.lav]],
    extra: `<polyline points="380,560 430,520 470,540 520,470 560,490 600,420" fill="none" stroke="${C.pink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/>`,
  },
  {
    file: 'poster-05.svg', w: 640, h: 960, bg: C.pink, fg: '#fff', accent: C.butter, size: 90, top: 260, n: '05',
    lines: [['1 DPP', 'sans'], ['a day', 'sans'], ['beats 10', 'sans', C.ink], ['on Sunday.', 'serif', C.butter]],
    extra: `${Array.from({ length: 7 }, (_, i) => `<g><rect x="${40 + i * 80}" y="96" width="64" height="64" rx="14" fill="#fff" fill-opacity="${i === 6 ? 0.25 : 0.9}"/><text x="${72 + i * 80}" y="138" text-anchor="middle" font-family="${MONO}" font-size="22" fill="${C.ink}">${'MTWTFSS'[i]}</text></g>`).join('')}`,
  },
  {
    file: 'poster-06.svg', w: 640, h: 640, bg: C.green, fg: '#fff', accent: C.butter, size: 60, top: 150, n: '06',
    lines: [['Ask the', 'sans'], ['doubt today,', 'sans'], ['not in the', 'sans', C.butter], ['exam hall.', 'serif', C.butter]],
  },
  {
    file: 'poster-07.svg', w: 640, h: 960, bg: C.blush, fg: C.ink, accent: C.pink, size: 78, top: 250, n: '07',
    lines: [['Progress', 'sans'], ['isn’t made', 'sans'], ['on result day.', 'sans'], ['It’s made', 'sans', C.pink], ['on boring', 'sans', C.pink], ['Tuesdays.', 'serif', C.lav]],
    extra: `<text x="40" y="110" font-family="${MONO}" font-size="20" letter-spacing="4" fill="${C.ink}" fill-opacity=".5">MON  <tspan fill="${C.pink}" fill-opacity="1">TUE</tspan>  WED  THU  FRI</text>`,
  },
  {
    file: 'poster-08.svg', w: 640, h: 640, bg: C.ink, fg: '#fff', accent: C.pink, size: 58, top: 230, n: '08',
    lines: [['You don’t need', 'sans'], ['more time.', 'sans'], ['You need', 'sans', C.baby], ['fewer tabs.', 'serif', C.butter]],
    extra: `${Array.from({ length: 6 }, (_, i) => `<rect x="${40 + i * 92}" y="70" width="84" height="40" rx="10" fill="#fff" fill-opacity="${i === 0 ? 0.9 : 0.12}"/>`).join('')}<text x="58" y="97" font-family="${MONO}" font-size="16" fill="${C.ink}">NCERT</text>`,
  },
  {
    file: 'poster-09.svg', w: 640, h: 410, bg: C.butter, fg: C.ink, accent: C.lav, size: 50, top: 110, n: '09',
    lines: [['Mock tests', 'sans'], ['don’t judge you.', 'sans'], ['They guide you.', 'serif', C.lav]],
  },
  {
    file: 'poster-10.svg', w: 640, h: 640, bg: C.lav, fg: '#fff', accent: C.baby, size: 56, top: 150, n: '10',
    lines: [['Consistency', 'sans', C.butter], ['is a superpower', 'sans'], ['you build', 'sans'], ['quietly.', 'serif', C.baby]],
  },
  {
    file: 'poster-11.svg', w: 640, h: 640, bg: C.orange, fg: '#fff', accent: C.ink, size: 56, top: 140, n: '11',
    lines: [['Rest is part', 'sans'], ['of the plan.', 'sans'], ['Not a break', 'sans', C.ink], ['from it.', 'serif', C.butter]],
  },
  {
    file: 'poster-12.svg', w: 640, h: 905, bg: C.paper, fg: C.ink, accent: C.pink, size: 66, top: 240, n: '12', by: 'Will Durant',
    lines: [['We are what we', 'sans'], ['repeatedly do.', 'sans'], ['Excellence,', 'sans', C.lav], ['then, is not', 'sans', C.lav], ['an act', 'sans', C.lav], ['but a habit.', 'serif', C.pink]],
    extra: ring(540, 120, 54, C.baby, 0.7),
  },
];

posters.forEach(poster);
