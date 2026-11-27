// "Two futures, one aspirant": everything around the hero figure that carries text
// (phone screen, x-ray callouts, chips, labels, caption). Same positions on both sides;
// lib/behaviors/aspirant.ts slides the curtain between them. Art lives in lib/art/*.svg.
import { futures } from '@/lib/content';

type Side = 'eng' | 'doc';
const MONO = "'Geist Mono', Consolas, monospace";
const SANS = 'Geist, Arial, sans-serif';
const INK = '#1e1420';
const ACCENT: Record<Side, string> = { eng: '#8b5cf6', doc: '#12a150' };

// figure units (viewBox 289×695). Head points the callouts lead from.
const RIGHT_CALLOUTS = [
  { from: [96, 40], y: 6 },
  { from: [126, 44], y: 40 },
  { from: [131, 60], y: 74 },
];
const LEFT_CALLOUTS = [
  { from: [78, 98], y: 118 }, // phone
  { from: [100, 204], y: 172 }, // heart
];
const CHIP_Y = [228, 258, 288, 318];

/** naive wrap for SVG text: ~n characters per line */
function wrap(t: string, n = 26) {
  const out: string[] = [];
  let line = '';
  for (const w of t.split(' ')) {
    if ((line + ' ' + w).trim().length > n && line) {
      out.push(line);
      line = w;
    } else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line);
  return out;
}
const textW = (t: string, size: number) => t.length * size * 0.6;

function Callout({ x, y, label, text, from, align, side }: { x: number; y: number; label: string; text: string; from: number[]; align: 'start' | 'end'; side: Side }) {
  const lines = wrap(text);
  const lx = align === 'start' ? x - 4 : x + 4;
  return (
    <g className="ax-p ax-p--callout" data-hide-only="">
      <path d={`M${from[0]} ${from[1]}L${lx} ${y - 3}`} stroke={ACCENT[side]} strokeWidth="1" strokeDasharray="2 2" fill="none" />
      <circle cx={from[0]} cy={from[1]} r="2.2" fill={ACCENT[side]} />
      <text x={x} y={y} textAnchor={align} fontFamily={MONO} fontSize="7" letterSpacing=".6" fill={ACCENT[side]} style={{ textTransform: 'uppercase' }}>
        {label}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + 11 + i * 10} textAnchor={align} fontFamily={SANS} fontSize="8.6" fill={INK}>
          {l}
        </text>
      ))}
    </g>
  );
}

function Chip({ y, text, i, side }: { y: number; text: string; i: number; side: Side }) {
  const w = textW(text, 8) + 18;
  const fills = ['#ff4f9a', ACCENT[side], INK, '#ffe45c'];
  const fg = i === 3 ? INK : '#fff';
  return (
    <g transform={`translate(${6 - w} ${y})`}>
      <g className="ax-p ax-p--chip ax-f" data-hide-only="">
        <rect x="2" y="3" width={w} height="20" rx="10" fill={INK} opacity=".14" />
        <rect width={w} height="20" rx="10" fill={fills[i]} stroke="#fff" strokeWidth="2.5" />
        <text x={w / 2} y="13.6" textAnchor="middle" fontFamily={MONO} fontSize="8" fontWeight="600" fill={fg}>
          {text}
        </text>
      </g>
    </g>
  );
}

/** text layer for one side, in the figure's own coordinates */
export function FutureOverlay({ side }: { side: Side }) {
  const c = futures.callouts;
  return (
    <svg className={`ax__over ax__over--${side}`} viewBox="0 0 289 695" overflow="visible" aria-hidden="true" focusable="false">
      {/* phone screen (cycles every 2.5 s) */}
      {futures.screens[side].map(([a, b], i) => (
        <g className="ax__scr" data-ax-scr={i} key={i} opacity={i ? 0 : 1}>
          <text x="111" y="68" textAnchor="middle" fontFamily={MONO} fontSize="6.6" letterSpacing=".4" fill="#ffb8dc">
            {a.toUpperCase()}
          </text>
          <text x="111" y="86" textAnchor="middle" fontFamily={SANS} fontSize="11.5" fontWeight="700" fill="#fff">
            {b}
          </text>
        </g>
      ))}
      {/* x-ray callouts: three lobes on the right, phone + heart on the left */}
      {RIGHT_CALLOUTS.map((p, i) => (
        <Callout key={i} x={232} y={p.y} from={p.from} label={c[i][0]} text={side === 'eng' ? c[i][1] : c[i][2]} align="start" side={side} />
      ))}
      {LEFT_CALLOUTS.map((p, i) => (
        <Callout key={i} x={-8} y={p.y} from={p.from} label={c[i + 3][0]} text={side === 'eng' ? c[i + 3][1] : c[i + 3][2]} align="end" side={side} />
      ))}
      {futures.chips[side].map((t, i) => (
        <Chip key={t + i} y={CHIP_Y[i]} text={t} i={i} side={side} />
      ))}
      <g className="ax-p ax-p--label" data-hide-only="">
        <text x="6" y="360" textAnchor="end" fontFamily={MONO} fontSize="7.2" letterSpacing=".5" fill={ACCENT[side]}>
          {futures.label[side]}
        </text>
      </g>
    </svg>
  );
}

/** shared layer: the caption that crossfades at 50%, and the thumbs-up */
export function FutureShared() {
  const caption = (t: string, side: Side) => {
    const w = textW(t, 8.4) + 22;
    return (
      <g className={`ax__cap ax__cap--${side}`} transform={`translate(${6 - w} 382)`}>
        <rect width={w} height="22" rx="11" fill="#fff" stroke={ACCENT[side]} strokeWidth="1.6" />
        <circle cx="11" cy="11" r="3.4" fill={ACCENT[side]} />
        <text x="19" y="14.8" fontFamily={MONO} fontSize="8.4" fill={INK}>
          {t}
        </text>
      </g>
    );
  };
  return (
    <svg className="ax__shared" viewBox="0 0 289 695" overflow="visible" aria-hidden="true" focusable="false">
      <g className="ax-p ax-p--caption" data-hide-only="">
        {caption(futures.caption.eng, 'eng')}
        {caption(futures.caption.doc, 'doc')}
      </g>
      <g transform="translate(14 486)">
        <g className="ax__thumb" opacity="0">
          <circle r="19" fill="#fff" stroke="#8b5cf6" strokeWidth="3" />
          <text y="8" textAnchor="middle" fontSize="21">
            👍
          </text>
        </g>
      </g>
    </svg>
  );
}
