// Generates the placeholder artwork: hero cut-out, avatar, OG image, favicon,
// lede icons and the desk polaroid. Run: npm run gen:assets
//
// The hero cut-out is an illustration drawn on the x-ray skeleton's own pose
// (289×695, mirror selfie, phone covering the face) so the x-ray overlay and
// the halftone loader still line up. Swap it for a real photo in the same pose.
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const pub = path.join(process.cwd(), 'public');
const W = 289;
const H = 695;

const C = {
  paper: '#fbf5f6',
  ink: '#1e1420',
  lav: '#8b5cf6',
  pink: '#ff4f9a',
  baby: '#ffb8dc',
  butter: '#ffe45c',
  orange: '#ff6b1a',
  green: '#12a150',
  skin: '#c98d6b',
  skinD: '#a8704f',
  hair: '#24161c',
  tee: '#f6f1e8',
  teeD: '#e3dacb',
  jog: '#2a2848',
  jogD: '#1d1b36',
};

const SANS = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = 'Consolas, Menlo, monospace';

/* ───────── the aspirant (mirror selfie) ───────── */
const limb = (d, w, c = C.skin) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

const figure = `
  <!-- hair, back layer -->
  <path d="M76 26C90 6 128 2 142 24C152 42 150 78 152 108C155 138 162 168 152 198C142 184 134 152 130 122L88 122C84 154 76 196 58 240C44 228 40 200 46 170C52 140 62 108 66 80C67 58 69 40 76 26Z" fill="${C.hair}"/>
  <!-- joggers -->
  <path d="M48 394C100 402 170 402 226 392C232 470 224 560 220 700L166 700C164 610 158 520 146 440L140 440C134 520 136 610 136 700L88 700C84 600 76 500 48 394Z" fill="${C.jog}"/>
  <path d="M51 402C76 500 86 600 92 700" stroke="#fff" stroke-opacity=".85" stroke-width="4" fill="none"/>
  <path d="M223 400C222 500 218 600 216 700" stroke="#fff" stroke-opacity=".85" stroke-width="4" fill="none"/>
  <path d="M141 446C141 520 138 610 138 700M145 446C150 520 160 610 164 700" stroke="${C.jogD}" stroke-width="3" fill="none"/>
  <!-- raised arm: upper arm (skin past the sleeve) -->
  ${limb('M206 170L254 181', 21)}
  <!-- oversized tee -->
  <path d="M40 168C52 152 76 144 96 140C104 150 118 150 126 140C148 142 172 147 192 158C205 172 207 190 204 206C212 270 220 340 226 398C160 410 84 410 48 404C50 330 52 260 46 196C44 184 42 174 40 168Z" fill="${C.tee}"/>
  <path d="M178 148C200 150 222 152 238 155L226 194C214 191 204 193 196 201C190 186 184 168 178 148Z" fill="${C.tee}"/>
  <path d="M40 166C52 156 64 160 66 176C64 205 60 240 57 266C44 264 26 262 12 260C17 225 26 190 40 166Z" fill="${C.tee}"/>
  <path d="M12 260C26 262 44 264 57 266" stroke="${C.teeD}" stroke-width="3" fill="none"/>
  <path d="M238 155L226 194" stroke="${C.teeD}" stroke-width="3" fill="none"/>
  <path d="M66 236C72 280 70 330 66 396M196 214C200 270 204 330 210 396M110 360C130 368 150 368 170 360" stroke="${C.teeD}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <!-- hanging arm (viewer's left) -->
  ${limb('M38 236L29 320', 20)}
  ${limb('M29 320L33 404', 16)}
  <ellipse cx="35" cy="424" rx="9.5" ry="19" fill="${C.skin}"/>
  <path d="M30 432l1 14M36 432l1.5 15M41 430l2 12" stroke="${C.skinD}" stroke-width="3" stroke-linecap="round"/>
  <!-- scrunchie -->
  <g fill="${C.pink}" stroke="${C.ink}" stroke-opacity=".25">
    <ellipse cx="33" cy="405" rx="12.5" ry="6"/>
    <circle cx="23" cy="405" r="3.6"/><circle cx="43" cy="405" r="3.6"/><circle cx="28" cy="401" r="3.2"/><circle cx="38" cy="401" r="3.2"/>
  </g>
  <!-- tee print -->
  <g transform="rotate(-4 120 280)">
    <rect x="70" y="232" width="104" height="104" rx="14" fill="${C.lav}"/>
    <text x="122" y="268" text-anchor="middle" font-family="${SANS}" font-size="23" font-weight="900" fill="${C.butter}" letter-spacing="-1">SHOW</text>
    <text x="122" y="294" text-anchor="middle" font-family="${SANS}" font-size="23" font-weight="900" fill="#fff" letter-spacing="-1">UP</text>
    <text x="122" y="320" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="22" fill="${C.baby}">daily.</text>
    <circle cx="170" cy="236" r="15" fill="${C.pink}"/>
    <text x="170" y="241" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="700" fill="#fff">42</text>
  </g>
  <!-- neck + chin under the phone -->
  <path d="M97 104h24v34c-4 8-20 8-24 0z" fill="${C.skinD}"/>
  <ellipse cx="109" cy="104" rx="21" ry="15" fill="${C.skin}"/>
  <path d="M96 140C104 149 118 149 126 140" stroke="${C.teeD}" stroke-width="4" fill="none"/>
  <!-- hair, front strands over the shoulders -->
  <path d="M80 60C72 100 70 150 62 200C58 214 54 224 50 230C60 200 62 160 66 120C68 96 72 74 80 60Z" fill="${C.hair}"/>
  <path d="M140 64C146 96 150 128 156 156C150 140 142 110 138 86Z" fill="${C.hair}"/>
  <!-- top of head above the phone -->
  <path d="M80 48C82 26 96 14 110 14C126 14 138 26 140 48Z" fill="${C.hair}"/>
  <!-- the phone (back facing the mirror) -->
  <rect x="74" y="44" width="74" height="58" rx="10" fill="${C.ink}"/>
  <rect x="77" y="47" width="68" height="52" rx="8" fill="none" stroke="#4a3a4e" stroke-width="1.5"/>
  <rect x="80" y="50" width="18" height="28" rx="6" fill="#33263a"/>
  <circle cx="88" cy="58" r="5" fill="#0d0910" stroke="#6b5a70" stroke-width="1.4"/>
  <circle cx="88" cy="70" r="5" fill="#0d0910" stroke="#6b5a70" stroke-width="1.4"/>
  <circle cx="96" cy="64" r="1.6" fill="${C.butter}"/>
  <!-- sticker on the phone -->
  <circle cx="124" cy="74" r="12" fill="${C.butter}"/>
  <path d="M124 65l2.4 6.4 6.6.2-5.2 4.1 1.9 6.4-5.7-3.8-5.7 3.8 1.9-6.4-5.2-4.1 6.6-.2z" fill="${C.pink}"/>
  <!-- raised arm: forearm + hand gripping the phone -->
  ${limb('M254 181L186 92', 17)}
  <circle cx="254" cy="181" r="10" fill="${C.skin}"/>
  <ellipse cx="174" cy="82" rx="15" ry="13" fill="${C.skin}"/>
  ${limb('M168 76L150 58', 8)}
  ${limb('M172 72L150 66', 8)}
  ${limb('M170 82L150 76', 8)}
  ${limb('M168 90L152 88', 7)}
  <path d="M150 58l-1 0M150 66l-1 0" stroke="${C.skinD}" stroke-width="2"/>
  <!-- the bow -->
  <g transform="translate(128 22)">
    <path d="M0 0C-8 -10 -18 -10 -16 0C-18 10 -8 10 0 0ZM0 0C8 -10 18 -10 16 0C18 10 8 10 0 0Z" fill="${C.lav}"/>
    <circle r="3.6" fill="${C.baby}"/>
  </g>
`;

// the current hero character lives in lib/art (scripts/gen-aspirant.mjs); reuse it here
const fig = fs.readFileSync(path.join(process.cwd(), 'lib/art/aspirant-figure.svg'), 'utf8')
  .replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const heroSvg = (w = W, h = H) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${W} ${H}">${figure}</svg>`;

/* ───────── avatar: the same aspirant, cropped, on baby pink ───────── */
const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="28 -8 236 236">
  <rect x="28" y="-8" width="236" height="236" fill="${C.baby}"/>
  <circle cx="146" cy="110" r="96" fill="#fff" fill-opacity=".35"/>
  ${fig}
</svg>`;

/* ───────── OG image 1200×630 ───────── */
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><pattern id="d" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1.3" fill="${C.lav}" fill-opacity=".18"/></pattern></defs>
  <rect width="1200" height="630" fill="${C.paper}"/>
  <rect width="1200" height="630" fill="url(#d)"/>
  <rect x="0" y="560" width="1200" height="70" fill="${C.butter}"/>
  <text x="70" y="610" font-family="${MONO}" font-size="24" fill="${C.ink}" letter-spacing="2">JEE · NEET · OLYMPIAD · WITH PARENTS IN THE LOOP</text>
  <g transform="translate(70 96)">
    <rect width="300" height="44" rx="22" fill="#fff" stroke="#e4e2da"/>
    <circle cx="26" cy="22" r="7" fill="${C.green}"/>
    <text x="44" y="29" font-family="${MONO}" font-size="20" fill="${C.ink}">admissions open</text>
  </g>
  <text x="66" y="290" font-family="${SANS}" font-weight="900" font-size="80" fill="${C.ink}" letter-spacing="-4">SamarthX</text>
  <text x="70" y="370" font-family="${SANS}" font-size="44" fill="${C.ink}" letter-spacing="-1.5">one dream, one mentor, every step</text>
  <text x="70" y="432" font-family="${SERIF}" font-style="italic" font-size="58" fill="${C.lav}">together.</text>
  <text x="70" y="500" font-family="${MONO}" font-size="24" fill="#55534e">from ₹3,999/mo · free diagnostic test</text>
  <g transform="translate(905 20) scale(.84)">${fig}</g>
</svg>`;

/* ───────── favicon: a star on a lavender tile ───────── */
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="${C.ink}"/>
  <path d="M32 11l5.6 14.6 15.4.8-12 9.8 4 15-13-8.4-13 8.4 4-15-12-9.8 15.4-.8z" fill="${C.baby}"/>
  <circle cx="32" cy="32" r="5" fill="${C.lav}"/>
</svg>`;

/* ───────── lede icons (32×32) ───────── */
const mentorIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${C.orange}"/>
  <path d="M7.5 9.5h17a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H15l-5 4v-4H7.5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2z" fill="#fff" stroke="${C.ink}" stroke-width="1.4" stroke-linejoin="round"/>
  <circle cx="11.5" cy="15.8" r="1.6" fill="${C.ink}"/><circle cx="16" cy="15.8" r="1.6" fill="${C.ink}"/><circle cx="20.5" cy="15.8" r="1.6" fill="${C.ink}"/></svg>`;
const parentIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${C.lav}"/>
  <path d="M4.5 16s4.2-7 11.5-7 11.5 7 11.5 7-4.2 7-11.5 7S4.5 16 4.5 16z" fill="#fff" stroke="${C.ink}" stroke-width="1.4" stroke-linejoin="round"/>
  <circle cx="16" cy="16" r="4.4" fill="${C.baby}" stroke="${C.ink}" stroke-width="1.4"/><circle cx="16" cy="16" r="1.8" fill="${C.ink}"/></svg>`;

/* ───────── desk polaroid: the error log (400×300) ───────── */
const errorLog = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#e9e4d8"/>
  <g transform="rotate(-3 200 150)">
    <rect x="58" y="26" width="290" height="250" rx="6" fill="#fffdf6" stroke="#d9d2c2"/>
    ${Array.from({ length: 9 }, (_, i) => `<path d="M70 ${82 + i * 21}H336" stroke="#c7d6ef" stroke-width="1"/>`).join('')}
    <path d="M100 30V272" stroke="${C.pink}" stroke-opacity=".5" stroke-width="1.5"/>
    ${Array.from({ length: 7 }, (_, i) => `<circle cx="72" cy="${56 + i * 32}" r="5" fill="#e9e4d8"/>`).join('')}
    <text x="110" y="62" font-family="${SERIF}" font-style="italic" font-size="26" fill="${C.ink}">error log · mock 14</text>
    <text x="110" y="98" font-family="${MONO}" font-size="15" fill="${C.ink}">sign error ......... ×3</text>
    <text x="110" y="119" font-family="${MONO}" font-size="15" fill="${C.ink}">units .............. ×2</text>
    <text x="110" y="140" font-family="${MONO}" font-size="15" fill="${C.ink}">read the question .. ×2</text>
    <path d="M108 152H318" stroke="${C.ink}" stroke-width="1.5"/>
    <text x="110" y="173" font-family="${MONO}" font-size="15" font-weight="700" fill="#ff3b30">total: −28 marks</text>
    <text x="110" y="205" font-family="${SERIF}" font-style="italic" font-size="21" fill="${C.lav}">all fixable. fix by sunday.</text>
    <path d="M250 222c18-14 40-14 58 0" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="252" y="252" font-family="${MONO}" font-size="13" fill="${C.green}">mentor ✓</text>
  </g>
</svg>`;

const write = (rel, data) => {
  const f = path.join(pub, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
  console.log('wrote', rel);
};

// 2× pixels, same 289:695 ratio as before
await sharp(Buffer.from(avatarSvg)).resize(300, 300).flatten({ background: C.baby }).jpeg({ quality: 86 }).toFile(path.join(pub, 'img/avatar.jpg'));
console.log('wrote img/avatar.jpg');
await sharp(Buffer.from(og)).png().toFile(path.join(pub, 'og.png'));
console.log('wrote og.png');
write('icon.svg', icon);
write('img/icons/mentor.svg', mentorIcon);
write('img/icons/parent.svg', parentIcon);
write('img/wall/desk-errorlog.svg', errorLog);
