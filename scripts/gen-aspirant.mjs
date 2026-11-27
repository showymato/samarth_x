// "Two futures, one aspirant": generates the hero art as inline SVG (lib/art/*.svg),
// inlined by components/Hero.tsx at build time, plus the PNG the loader halftone and
// x-ray silhouette mask sample (public/img/hero-aspirant.png, engineer version).
//
// One shared base (skin, hair, pose, phone, sneakers) + two outfit layers, so the
// engineer and the doctor line up exactly. 100% original vector art; only palette tokens.
// Text that comes from lib/content.ts (callouts, chips, phone screens) is drawn by
// components/Futures.tsx, not here. Run: npm run gen:aspirant
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const W = 289;
const H = 695;
// palette tokens only (app/original.css :root) + their opacity mixes
const C = {
  ink: '#1e1420',
  ink2: '#55534e', // charcoal
  ink3: '#9e9c95',
  ink4: '#c9c7bf',
  line: '#e4e2da',
  paper: '#fbf5f6',
  bpPaper: '#f6f0ff',
  lav: '#8b5cf6',
  baby: '#ffb8dc',
  pink: '#ff4f9a',
  butter: '#ffe45c',
  green: '#12a150',
  red: '#ff3b30',
  navy: '#2a2848', // existing hero joggers
  skin: '#c98d6b',
  skinD: '#a8704f',
  hair: '#24161c',
};
const SANS = 'Geist, Arial, sans-serif';
const MONO = "'Geist Mono', Consolas, monospace";
const SERIF = "'Instrument Serif', Georgia, serif";
const HAND = "'Momo Signature', 'Segoe Script', cursive";

/* ───────── shared base geometry (the x-ray skeleton's pose) ───────── */
const S = {
  hairBack: 'M76 26C90 6 128 2 142 24C152 42 150 78 152 108C155 138 162 168 152 198C142 184 134 152 130 122L88 122C84 154 76 196 58 240C44 228 40 200 46 170C52 140 62 108 66 80C67 58 69 40 76 26Z',
  legs: 'M48 394C100 402 170 402 226 392C232 470 226 560 222 662L166 662C164 590 158 520 146 440L140 440C134 520 136 590 136 662L86 662C82 590 74 500 48 394Z',
  torso: 'M40 168C52 152 76 144 96 140C104 150 118 150 126 140C148 142 172 147 192 158C205 172 207 190 204 206C212 270 220 340 226 398C160 410 84 410 48 404C50 330 52 260 46 196C44 184 42 174 40 168Z',
  sleeveR: 'M178 148C200 150 222 152 238 155L226 194C214 191 204 193 196 201C190 186 184 168 178 148Z',
  sleeveL: 'M40 166C52 156 64 160 66 176C64 205 60 240 57 266C44 264 26 262 12 260C17 225 26 190 40 166Z',
  shoeL: 'M80 654h58c5 0 9 7 11 15l3 12c1 6-2 10-8 10H78c-6 0-9-4-7-10z',
  shoeR: 'M160 654h60c5 0 8 7 10 15l3 12c1 6-2 10-8 10h-66c-6 0-8-4-7-10z',
  headTop: 'M80 48C82 26 96 14 110 14C126 14 138 26 140 48Z',
  phone: 'M84 44h54a10 10 0 0 1 10 10v38a10 10 0 0 1-10 10H84a10 10 0 0 1-10-10V54a10 10 0 0 1 10-10z',
  // doctor: open white coat (two panels, down to mid-thigh)
  coatL: 'M40 168C52 152 76 144 96 140L108 156L102 270L96 524L30 518C36 420 44 300 46 196C44 184 42 174 40 168Z',
  coatR: 'M126 140C148 142 172 147 192 158C205 172 207 190 204 206C212 300 222 420 230 516L150 524L142 270L120 156Z',
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

const tornFilter = (id) => `<filter id="${id}" x="-12%" y="-6%" width="124%" height="112%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency=".085" numOctaves="2" seed="7" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="1" seed="3" result="g"/>
  <feColorMatrix in="g" type="matrix" values="0 0 0 0 .78 0 0 0 0 .74 0 0 0 0 .68 1.3 0 0 0 -.62" result="gt"/>
  <feComposite in="gt" in2="d" operator="in" result="gi"/>
  <feMerge><feMergeNode in="d"/><feMergeNode in="gi"/></feMerge>
</filter>`;

const outline = (id, shapes) => `<g filter="url(#${id})" fill="#fff" stroke="#fff" stroke-width="18" stroke-linejoin="round" stroke-linecap="round">
  ${shapes.map((d) => `<path d="${d}"/>`).join('')}
  ${limbs.map(([d, w]) => `<path d="${d}" fill="none" stroke-width="${w + 18}"/>`).join('')}
  <ellipse cx="35" cy="424" rx="10" ry="19"/><ellipse cx="174" cy="82" rx="15" ry="13"/><circle cx="254" cy="181" r="10"/>
</g>`;

/* the SHOW UP daily. card + 42 badge, at any scale */
const showCard = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
  <rect width="104" height="104" rx="14" fill="${C.lav}"/>
  <text x="52" y="36" text-anchor="middle" font-family="${SANS}" font-size="23" font-weight="800" fill="${C.butter}" letter-spacing="-1">SHOW</text>
  <text x="52" y="62" text-anchor="middle" font-family="${SANS}" font-size="23" font-weight="800" fill="#fff" letter-spacing="-1">UP</text>
  <text x="52" y="88" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="24" fill="${C.baby}">daily.</text>
  <circle cx="100" cy="4" r="15" fill="${C.pink}" stroke="#fff" stroke-width="2"/>
  <text x="100" y="9" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="700" fill="#fff">42</text>
</g>`;

const gearPath = (cx, cy, r, teeth, depth) => {
  const pts = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? r - depth : r;
    pts.push([cx + rr * Math.cos(a0), cy + rr * Math.sin(a0)], [cx + rr * Math.cos(a1), cy + rr * Math.sin(a1)]);
  }
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`;
};

/* ───────── shared base layers ───────── */
const baseBack = `<path d="${S.hairBack}" fill="${C.hair}"/>`;
const sneakers = (doodle) => `<g stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round">
    <path d="${S.shoeL}" fill="#fff"/><path d="${S.shoeR}" fill="#fff"/>
  </g>
  <path d="M72 684h80M152 684h80" stroke="${C.lav}" stroke-width="5" stroke-linecap="round"/>
  ${doodle}`;
const armsFront = `
  ${limb('M38 236L29 320', 20)}
  ${limb('M29 320L33 404', 16)}
  <ellipse cx="35" cy="424" rx="9.5" ry="19" fill="${C.skin}"/>
  <path d="M30 432l1 14M36 432l1.5 15M41 430l2 12" stroke="${C.skinD}" stroke-width="3" stroke-linecap="round"/>
  <g fill="${C.butter}" stroke="${C.ink}" stroke-opacity=".3">
    <ellipse cx="33" cy="405" rx="12.5" ry="6"/>
    <circle cx="23" cy="405" r="3.6"/><circle cx="43" cy="405" r="3.6"/><circle cx="28" cy="401" r="3.2"/><circle cx="38" cy="401" r="3.2"/>
  </g>`;
const neck = `
  <path d="M97 104h24v34c-4 8-20 8-24 0z" fill="${C.skinD}"/>
  <ellipse cx="109" cy="104" rx="21" ry="15" fill="${C.skin}"/>
  <path d="M80 60C72 100 70 150 62 200C58 214 54 224 50 230C60 200 62 160 66 120C68 96 72 74 80 60Z" fill="${C.hair}"/>
  <path d="M140 64C146 96 150 128 156 156C150 140 142 110 138 86Z" fill="${C.hair}"/>`;
const head = (extra) => `<g class="ax__head">
  <path d="${S.headTop}" filter="url(#ax-torn)" fill="#fff" stroke="#fff" stroke-width="18" stroke-linejoin="round"/>
  <path d="${S.headTop}" fill="${C.hair}"/>
  <g transform="translate(128 22)">
    <path d="M0 0C-8 -10 -18 -10 -16 0C-18 10 -8 10 0 0ZM0 0C8 -10 18 -10 16 0C18 10 8 10 0 0Z" fill="${C.lav}" stroke="#fff" stroke-width="2.5"/>
    <circle r="3.6" fill="${C.baby}"/>
  </g>
  ${extra}
  <g class="ax__hp" opacity="0">
    <path d="M66 66C62 18 156 18 152 66" fill="none" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>
    <path d="M70 60C68 28 150 28 148 60" fill="none" stroke="${C.lav}" stroke-width="2.4"/>
    <rect x="56" y="50" width="18" height="30" rx="8" fill="${C.pink}" stroke="${C.ink}" stroke-width="2"/>
    <rect x="144" y="50" width="18" height="30" rx="8" fill="${C.pink}" stroke="${C.ink}" stroke-width="2"/>
  </g>
</g>`;
// phone: screen left blank (Futures.tsx draws the cycling screen text on top); the case differs per outfit
const phone = (caseArt) => `<g class="ax__phone">
  <path d="${S.phone}" fill="${C.ink}"/>
  ${caseArt}
  <rect x="78" y="48" width="66" height="50" rx="7" fill="url(#ax-scr)"/>
  <rect x="104" y="51" width="14" height="3" rx="1.5" fill="#000" opacity=".5"/>
</g>`;
const handFront = `<g class="ax__arm">
  ${limb('M254 181L186 92', 17)}
  <circle cx="254" cy="181" r="10" fill="${C.skin}"/>
  <ellipse cx="174" cy="82" rx="15" ry="13" fill="${C.skin}"/>
  ${limbs.slice(4).map(([d, w]) => limb(d, w)).join('')}
</g>`;
const figure = (cls, id, outlineShapes, body, headExtra, caseArt) =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="ax__fig ${cls}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" overflow="visible" aria-hidden="true" focusable="false">
<defs>
  ${tornFilter(id)}
  <linearGradient id="${id}-scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.navy}"/><stop offset="1" stop-color="#4b2d86"/></linearGradient>
</defs>
<g class="ax__body">
  ${outline(id, outlineShapes)}
  ${body}
</g>
${head(headExtra)}
${phone(caseArt)}
${handFront}
</svg>`
    .replaceAll('url(#ax-torn)', `url(#${id})`)
    .replaceAll('url(#ax-scr)', `url(#${id}-scr)`);

/* ───────── outfit 1: future engineer · JEE ───────── */
const engineer = figure(
  'ax__fig--eng',
  'axe-torn',
  [S.hairBack, S.legs, S.torso, S.sleeveR, S.sleeveL, S.shoeL, S.shoeR, S.phone],
  `${baseBack}
  <path d="${S.legs}" fill="${C.navy}"/>
  <path d="M51 402C76 500 86 600 90 662M223 400C224 500 220 600 218 662" stroke="#fff" stroke-opacity=".85" stroke-width="4" fill="none"/>
  <path d="M141 446C141 520 138 600 138 662M145 446C150 520 160 600 164 662" stroke="#1d1b36" stroke-width="3" fill="none"/>
  ${sneakers(`<g fill="none" stroke="${C.lav}" stroke-width="1.6">
    <path d="${gearPath(102, 670, 7, 8, 2.4)}"/><circle cx="102" cy="670" r="2.4"/>
    <path d="${gearPath(196, 670, 7, 8, 2.4)}"/><circle cx="196" cy="670" r="2.4"/>
  </g><path d="M120 668h6v-5h6M206 666h8" stroke="${C.pink}" stroke-width="1.6" fill="none"/>`)}
  <g transform="rotate(8 220 392)"><rect x="212" y="352" width="13" height="78" rx="2" fill="${C.butter}" stroke="${C.ink}" stroke-width="1.2"/>
    <path d="M212 360h5M212 368h3M212 376h5M212 384h3M212 392h5M212 400h3M212 408h5M212 416h3" stroke="${C.ink}" stroke-width="1"/></g>
  <path d="${S.torso}" fill="${C.ink2}"/>
  ${limb('M206 170L254 181', 21)}
  <path d="${S.sleeveR}" fill="${C.ink2}"/>
  <path d="${S.sleeveL}" fill="${C.ink2}"/>
  <path d="M14 254C28 258 44 260 56 262M236 158L226 190" stroke="#3d3b38" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M70 352h104l6 42H64z" fill="#4a4844"/>
  <path d="M70 352h104" stroke="#3d3b38" stroke-width="2"/>
  <path d="M64 236C70 280 70 320 68 350M198 214C202 270 206 320 210 380" stroke="#4a4844" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M50 398C110 410 170 410 228 396" stroke="#3d3b38" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${showCard(70, 232, 1, -4)}
  ${armsFront}
  ${neck}
  <path d="M84 144C96 160 124 160 136 144" stroke="#3d3b38" stroke-width="11" fill="none" stroke-linecap="round"/>
  <path d="M104 152L101 196M118 152L121 198" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="101" cy="198" r="2.6" fill="${C.butter}"/><circle cx="121" cy="200" r="2.6" fill="${C.butter}"/>`,
  `<path d="M78 40C92 26 128 26 142 40" stroke="${C.ink}" stroke-width="5" fill="none" stroke-linecap="round"/>
   <g fill="${C.lav}" fill-opacity=".45" stroke="${C.ink}" stroke-width="2.4"><rect x="86" y="26" width="22" height="15" rx="6"/><rect x="112" y="26" width="22" height="15" rx="6"/></g>
   <path d="M108 33h4" stroke="${C.ink}" stroke-width="2.4"/>
   <path d="M90 30l6 6M116 30l6 6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
   <g transform="rotate(-38 70 64)"><rect x="46" y="61" width="38" height="6" rx="1" fill="${C.butter}" stroke="${C.ink}" stroke-width="1"/>
     <path d="M84 61l7 3-7 3z" fill="#f1d2b0" stroke="${C.ink}" stroke-width="1"/><rect x="41" y="61" width="6" height="6" fill="${C.pink}"/></g>`,
  `<path d="M77 60h5v-8h6M77 84h7v8M145 64h-6v-10h-6M145 88h-5v6h-10M96 101v-3h10M122 101v-3h8" stroke="${C.lav}" stroke-width="1.3" fill="none"/>
   <g fill="${C.butter}"><circle cx="88" cy="52" r="1.4"/><circle cx="133" cy="54" r="1.4"/><circle cx="130" cy="94" r="1.4"/><circle cx="84" cy="92" r="1.4"/></g>`,
);

/* ───────── outfit 2: future doctor · NEET ───────── */
const MINT = `fill="${C.green}" fill-opacity=".42"`;
const doctor = figure(
  'ax__fig--doc',
  'axd-torn',
  [S.hairBack, S.legs, S.torso, S.coatL, S.coatR, S.sleeveR, S.sleeveL, S.shoeL, S.shoeR, S.phone],
  `<g class="ax__lightbox">
    <rect x="160" y="96" width="122" height="150" rx="8" fill="#fff" stroke="${C.ink4}" stroke-width="3"/>
    <rect x="168" y="106" width="106" height="130" rx="4" fill="${C.bpPaper}"/>
    <g fill="none" stroke="${C.lav}" stroke-opacity=".5" stroke-width="2.2" stroke-linecap="round">
      <path d="M221 112V230"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M221 ${126 + i * 20}C${206 - i} ${122 + i * 20} ${190 - i * 2} ${130 + i * 20} ${186 - i * 2} ${146 + i * 20}M221 ${126 + i * 20}C${236 + i} ${122 + i * 20} ${252 + i * 2} ${130 + i * 20} ${256 + i * 2} ${146 + i * 20}"/>`).join('')}
    </g>
    <rect x="200" y="90" width="12" height="14" rx="2" fill="${C.ink3}"/><rect x="230" y="90" width="12" height="14" rx="2" fill="${C.ink3}"/>
  </g>
  ${baseBack}
  <path d="${S.legs}" fill="#fff"/><path d="${S.legs}" ${MINT}/>
  <path d="M141 446C141 520 138 600 138 662M145 446C150 520 160 600 164 662" stroke="${C.green}" stroke-opacity=".6" stroke-width="2.4" fill="none"/>
  ${sneakers(`<path d="M96 664l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="${C.butter}" stroke="${C.ink}" stroke-width=".8"/>
    <path d="M116 668c4-4 8 4 12 0s8 4 12 0M178 666c4-4 8 4 12 0s8 4 12 0" stroke="${C.pink}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M206 662v10M201 667h10" stroke="${C.red}" stroke-width="2.4"/>`)}
  <path d="${S.torso}" fill="#fff"/><path d="${S.torso}" ${MINT}/>
  <path d="M100 146L112 182L124 146" stroke="${C.green}" stroke-opacity=".8" stroke-width="3" fill="none" stroke-linejoin="round"/>
  ${limb('M206 170L254 181', 21)}
  <g stroke="${C.ink4}" stroke-width="1.6" stroke-linejoin="round">
    <path d="${S.coatL}" fill="#fff"/><path d="${S.coatR}" fill="#fff"/>
    <path d="${S.sleeveR}" fill="#fff"/><path d="${S.sleeveL}" fill="#fff"/>
  </g>
  <path d="M96 140L108 156L94 196M126 140L120 156L134 196" stroke="${C.ink4}" stroke-width="2" fill="none"/>
  <path d="M60 420h30M160 420h36" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="104" cy="300" r="2.4" fill="${C.ink4}"/><circle cx="103" cy="360" r="2.4" fill="${C.ink4}"/>
  <rect x="152" y="226" width="40" height="34" rx="3" fill="#fff" stroke="${C.ink4}" stroke-width="1.6"/>
  <rect x="181" y="206" width="5" height="30" rx="2" fill="${C.ink2}"/><rect x="181" y="204" width="5" height="5" rx="2" fill="${C.butter}"/>
  ${showCard(150, 228, 0.3, -6)}
  ${armsFront}
  ${neck}
  <path d="M90 144C80 178 88 214 104 226M130 144C140 178 132 212 116 226" stroke="${C.ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <path d="M104 226C96 236 86 246 82 256" stroke="${C.ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <circle cx="80" cy="262" r="8" fill="${C.ink4}" stroke="${C.ink}" stroke-width="2"/><circle cx="80" cy="262" r="3.4" fill="#fff"/>
  <path d="M102 150L111 232L120 150" stroke="${C.pink}" stroke-width="2.4" fill="none"/>
  <g transform="rotate(-3 111 252)">
    <rect x="96" y="232" width="32" height="40" rx="4" fill="#fff" stroke="${C.ink}" stroke-width="1.4"/>
    <rect x="96" y="232" width="32" height="10" rx="4" fill="${C.lav}"/>
    <circle cx="105" cy="252" r="5" fill="${C.baby}"/>
    <text x="112" y="250" font-family="${MONO}" font-size="4.6" fill="${C.ink}">Dr. ___</text>
    <text x="100" y="266" font-family="${MONO}" font-size="4" fill="${C.ink2}">(loading…)</text>
  </g>`,
  '',
  `<circle cx="143" cy="49" r="6.5" fill="#fff"/><path d="M143 45v8M139 49h8" stroke="${C.red}" stroke-width="2.4"/>`,
);

/* ───────── backgrounds (full hero, behind the text; 1440×900, slice) ───────── */
const bg = (cls, body, defs) => `<svg xmlns="http://www.w3.org/2000/svg" class="fx__svg ${cls}" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs>${defs}<linearGradient id="${cls}-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.paper}"/><stop offset=".6" stop-color="${C.paper}"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0"/></linearGradient></defs>
${body}
<rect width="1440" height="96" fill="url(#${cls}-top)"/>
</svg>`;
const eq = (x, y, t, size = 22, rot = 0, fam = HAND) =>
  `<text x="${x}" y="${y}" font-family="${fam}" font-size="${size}" transform="rotate(${rot} ${x} ${y})">${t}</text>`;

const bgEngineer = bg(
  'fx__svg--eng',
  `<rect width="1440" height="900" fill="${C.paper}"/>
  <rect width="1440" height="900" fill="${C.bpPaper}" fill-opacity=".5"/>
  <rect width="1440" height="900" fill="url(#fx-grid)"/>
  <rect width="1440" height="900" fill="url(#fx-grid-lg)"/>
  <g fill="none" stroke="${C.lav}" stroke-opacity=".3" stroke-width="1.4">
    <path d="M90 560Q300 250 520 560" stroke-dasharray="3 7"/>
    <path d="M90 560L170 440" stroke-width="2"/><path d="M170 440l-12 3 6 -11z" fill="${C.lav}" fill-opacity=".3"/>
    <path d="M90 560h80"/><path d="M128 560A38 38 0 0 0 112 528"/>
    <path d="M1080 820L1360 820L1360 660Z"/>
    <g transform="rotate(-29.7 1230 742)"><rect x="1206" y="716" width="48" height="30"/><path d="M1230 716v-46M1230 670l-5 9h10z"/><path d="M1230 746v40"/></g>
    <path d="M1440 430H1330V500H1250V560H1190"/>
    <path d="M1290 500l6-10 8 20 8-20 8 20 6-10"/>
    <circle cx="1330" cy="430" r="4" fill="${C.lav}" fill-opacity=".3"/><circle cx="1250" cy="500" r="4" fill="${C.lav}" fill-opacity=".3"/><circle cx="1190" cy="560" r="4" fill="${C.lav}" fill-opacity=".3"/>
    <path d="M1000 160h260M1000 150v20M1260 150v20M1000 160l12-5v10zM1260 160l-12-5v10z"/>
    <path d="M70 250h220M70 240v20M290 240v20M70 250l12-5v10zM290 250l-12-5v10z"/>
  </g>
  <g fill="${C.lav}" fill-opacity=".42">
    ${eq(1080, 146, 'rank: TBD', 18, 0, MONO)}
    ${eq(80, 236, 'Δ effort → Δ rank', 18, 0, MONO)}
    ${eq(240, 640, 'F = ma', 30, -4)}
    ${eq(1120, 300, '∮E·dA = Q/ε₀', 28, 3)}
    ${eq(620, 820, 'PV = nRT', 26, -2)}
    ${eq(820, 120, '∫₀<tspan baseline-shift="super" font-size="16">π</tspan> sin x dx = 2', 26, 2)}
    ${eq(196, 600, 'v₀', 18)}${eq(150, 552, 'θ', 18)}
  </g>`,
  `<pattern id="fx-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${C.lav}" stroke-opacity=".06" stroke-width="1"/></pattern>
   <pattern id="fx-grid-lg" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M120 0H0V120" fill="none" stroke="${C.lav}" stroke-opacity=".08" stroke-width="1"/></pattern>`,
);

const bgDoctor = bg(
  'fx__svg--doc',
  `<rect width="1440" height="900" fill="${C.paper}"/>
  <rect width="1440" height="900" fill="${C.green}" fill-opacity=".02"/>
  <rect width="1440" height="900" fill="url(#fx-plus)"/>
  <g fill="none" stroke="${C.green}" stroke-opacity=".3" stroke-width="1.4">
    <ellipse cx="170" cy="560" rx="110" ry="80"/>
    <circle cx="150" cy="552" r="30"/><circle cx="146" cy="548" r="9" fill="${C.green}" fill-opacity=".12"/>
    <ellipse cx="226" cy="590" rx="30" ry="13" transform="rotate(-18 226 590)"/>
    <path d="M204 594c6-8 10 6 16-2s10 6 16-2s8 6 12 0" transform="rotate(-18 226 590)"/>
    <circle cx="100" cy="600" r="5"/><circle cx="218" cy="520" r="4"/><circle cx="240" cy="550" r="3"/>
    <path d="M1180 690l40-23 40 23v46l-40 23-40-23z"/>
    <path d="M1260 690l22-13M1260 736l22 13M1180 736l-22 13M1220 667v-22"/>
  </g>
  <g fill="${C.green}" fill-opacity=".5">
    ${eq(1214, 675, 'O', 16, 0, MONO)}
    ${eq(1286, 676, 'OH', 13, 0, MONO)}${eq(1286, 760, 'OH', 13, 0, MONO)}${eq(1124, 760, 'HO', 13, 0, MONO)}${eq(1196, 640, 'CH₂OH', 13, 0, MONO)}
  </g>
  <g fill="${C.green}" fill-opacity=".45">
    ${eq(1040, 150, 'ATP', 30, -3)}
    ${eq(240, 690, 'Krebs cycle', 26, 2)}
    ${eq(640, 820, 'Ksp', 26, -2)}
    ${eq(1100, 330, 'NCERT pg. 128', 22, 3, MONO)}
  </g>`,
  `<pattern id="fx-plus" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M14 10v8M10 14h8" stroke="${C.green}" stroke-opacity=".08" stroke-width="1.4"/></pattern>`,
);

/* small animated pieces: their own layers, animated with transforms only */
const small = (cls, vb, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;
const gearA = small('fx__gear fx__gear--a', '0 0 100 100', `<g fill="none" stroke="${C.lav}" stroke-opacity=".45" stroke-width="2"><path d="${gearPath(50, 50, 46, 12, 9)}"/><circle cx="50" cy="50" r="14"/><circle cx="50" cy="50" r="4"/></g>`);
const gearB = small('fx__gear fx__gear--b', '0 0 64 64', `<g fill="none" stroke="${C.lav}" stroke-opacity=".45" stroke-width="2"><path d="${gearPath(32, 32, 29, 8, 7)}"/><circle cx="32" cy="32" r="8"/></g>`);
const heart = small('fx__heart', '0 0 100 90', `<path d="M50 84C20 62 4 46 4 26C4 12 15 4 27 4C37 4 45 10 50 18C55 10 63 4 73 4C85 4 96 12 96 26C96 46 80 62 50 84Z" fill="${C.pink}" fill-opacity=".08" stroke="${C.pink}" stroke-opacity=".55" stroke-width="2.4"/>
  <path d="M14 40h20l6-12 8 26 6-18 4 4h28" fill="none" stroke="${C.pink}" stroke-opacity=".55" stroke-width="2"/>`);
// helix: three periods; the CSS layer scrolls one period so it reads as a 2.5D twist
const HELIX_PERIOD = 80;
const helixSvg = (() => {
  const per = HELIX_PERIOD;
  const n = 120;
  const a = [];
  const b = [];
  const rungs = [];
  for (let i = 0; i <= n; i++) {
    const y = (i / n) * per * 3;
    const s = Math.sin((y / per) * Math.PI * 2);
    a.push(`${(30 + 22 * s).toFixed(1)} ${y.toFixed(1)}`);
    b.push(`${(30 - 22 * s).toFixed(1)} ${y.toFixed(1)}`);
    if (i % 5 === 2) rungs.push(`M${(30 + 22 * s).toFixed(1)} ${y.toFixed(1)}H${(30 - 22 * s).toFixed(1)}`);
  }
  return small('fx__helix-strip', `0 0 60 ${per * 3}`, `<path d="${rungs.join('')}" stroke="${C.green}" stroke-opacity=".35" stroke-width="2"/>
    <path d="M${a.join('L')}" fill="none" stroke="${C.green}" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
    <path d="M${b.join('L')}" fill="none" stroke="${C.pink}" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>`);
})();

/* divider strip: circuit (engineer side, left half) and ECG (doctor side, right half) */
const divider = `<svg xmlns="http://www.w3.org/2000/svg" class="fx-div__svg" viewBox="0 0 60 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
  <path class="fx-div__trace fx-div__trace--circuit" d="M30 0V90H18V170H30V260H12V330H30V420H20V520H30V600H14V690H30V780H22V900" fill="none" stroke="${C.lav}" stroke-width="1.8" vector-effect="non-scaling-stroke"/>
  <path class="fx-div__trace fx-div__trace--ecg" d="M30 0V100l6 6-10 14 22 10-26 14 8 8V250l6 6-10 14 22 10-26 14 8 8V400l6 6-10 14 22 10-26 14 8 8V550l6 6-10 14 22 10-26 14 8 8V700l6 6-10 14 22 10-26 14 8 8V900" fill="none" stroke="${C.pink}" stroke-width="1.8" vector-effect="non-scaling-stroke"/>
</svg>`;

const out = path.join(process.cwd(), 'lib', 'art');
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) if (f.endsWith('.svg')) fs.unlinkSync(path.join(out, f));
const files = {
  'fig-engineer.svg': engineer,
  'fig-doctor.svg': doctor,
  'bg-engineer.svg': bgEngineer,
  'bg-doctor.svg': bgDoctor,
  'gear-a.svg': gearA,
  'gear-b.svg': gearB,
  'heart.svg': heart,
  'helix.svg': helixSvg,
  'divider.svg': divider,
};
let total = 0;
for (const [f, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(out, f), svg);
  total += svg.length;
  console.log('wrote lib/art/' + f, `${(svg.length / 1024).toFixed(1)} KB`);
}
console.log(`total inline SVG: ${(total / 1024).toFixed(1)} KB`);

// raster copy for the loader halftone + x-ray silhouette mask (engineer = the default state)
await sharp(Buffer.from(engineer.replace(`width="${W}" height="${H}"`, `width="${W * 2}" height="${H * 2}"`)))
  .png()
  .toFile(path.join(process.cwd(), 'public', 'img', 'hero-aspirant.png'));
console.log('wrote public/img/hero-aspirant.png');
