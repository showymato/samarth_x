import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, reducedMotion, site } from './utils';
import { loader as copy } from '@/lib/content';

/*
  Opening sequence: "find your way".

  01 anticipation  a pink line (the student's path) wanders in, loops back on itself, hesitates.
  02 transform     a steady ink line (the mentor's path) sweeps in to meet it. They cross, and the
                   crossing is the x: the tails retract into two diagonals that gain weight and land
                   exactly on the real "x" glyph, which takes over in pink.
  03 reveal        "samarth" rises letter by letter through masks at the hero wordmark's exact
                   position, then "a mentor. a guide. a companion." and a short still beat.
  04 handoff       the x turns ink, the page opens as an iris from the x, and the hero wordmark
                   underneath (identical pixels) takes over. The rest of the hero intro plays as it opens.

  Readiness is real: the handoff waits for the hero image. Repeat loads in a session get a short
  form. If loading runs long there's a calm waiting state, an "enter now" button, and hard caps
  (here and in CSS) so the page can never stay covered.
*/

const SEEN = 'sx-intro-seen';
const ENTER_AFTER = 3.2; // s of waiting before "enter now" appears
const HARD_CAP = 8; // s of waiting before the page opens regardless
const PINK = '#ff4f9a';
const INK = '#1e1420';

type Pt = [number, number];
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const unit = (v: Pt): Pt => {
  const l = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / l, v[1] / l];
};
const p = (v: Pt) => `${v[0].toFixed(1)} ${v[1].toFixed(1)}`;

export function runLoader(onReveal: () => void): void {
  const root = qs('.ld');
  const html = document.documentElement;
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    onReveal();
  };
  const done = () => {
    reveal();
    root?.remove();
    html.classList.remove('is-loading');
    site.lenis?.start();
  };
  if (!root) return reveal();
  // the CSS failsafe already uncovered the page (the script arrived very late): go straight to the hero
  if (reducedMotion() || getComputedStyle(root).visibility === 'hidden') {
    done();
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    return;
  }
  // the script is running, so its own caps take over from the CSS failsafe
  root.style.animation = 'none';
  html.classList.add('is-loading');
  site.lenis?.stop();
  window.scrollTo(0, 0);
  try {
    sequence(root, reveal, done);
  } catch (e) {
    console.error(e);
    done();
  }
}

function sequence(root: HTMLElement, reveal: () => void, doneBase: () => void) {
  const offs: (() => void)[] = [];
  const done = () => {
    offs.splice(0).forEach((f) => f());
    doneBase();
  };
  const W = window.innerWidth;
  const H = window.innerHeight;
  let short = false;
  try {
    short = sessionStorage.getItem(SEEN) === '1';
    sessionStorage.setItem(SEEN, '1');
  } catch {}

  /* ── readiness: the hero image the iris opens onto ── */
  let ready = false;
  const img = qs<HTMLImageElement>('[data-ax-win="eng"] img');
  const imgReady = !img
    ? Promise.resolve()
    : img.complete
      ? img.decode().catch(() => {})
      : new Promise<void>((r) => {
          img.addEventListener('load', () => img.decode().catch(() => {}).then(() => r()), { once: true });
          img.addEventListener('error', () => r(), { once: true });
        });
  imgReady.then(() => (ready = true));

  /* ── measure the hero wordmark: the loader builds an exact copy on top of it ── */
  const design = qs('[data-hx-design]')!;
  const name = qs('.hx__name', design)!;
  const chars = qsa('.hx__ch', design);
  const cs = getComputedStyle(name);
  const fs = parseFloat(cs.fontSize);
  const word = qs('[data-ld-word]', root)!;
  Object.assign(word.style, { fontFamily: cs.fontFamily, fontWeight: cs.fontWeight, fontSize: `${fs}px`, letterSpacing: cs.letterSpacing });
  const pieces = chars.map((c) => {
    const r = c.getBoundingClientRect();
    const m = document.createElement('span');
    m.className = 'ld__ch';
    Object.assign(m.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, lineHeight: `${r.height}px` });
    const g = document.createElement('span');
    g.textContent = c.textContent;
    m.appendChild(g);
    word.appendChild(m);
    return { m, g, r };
  });
  const xp = pieces[pieces.length - 1];
  const letters = pieces.slice(0, -1).map((q) => q.g);
  xp.m.classList.add('ld__ch--x');

  // the x's ink box, from the font's own metrics (same font, same size, same baseline as the hero)
  const cx = document.createElement('canvas').getContext('2d')!;
  cx.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
  const mt = cx.measureText('x');
  const fA = mt.fontBoundingBoxAscent ?? fs * 0.9;
  const fD = mt.fontBoundingBoxDescent ?? fs * 0.22;
  const baseline = xp.r.top + (xp.r.height - (fA + fD)) / 2 + fA;
  const ink = {
    l: xp.r.left - mt.actualBoundingBoxLeft,
    r: xp.r.left + mt.actualBoundingBoxRight,
    t: baseline - mt.actualBoundingBoxAscent,
    b: baseline + mt.actualBoundingBoxDescent,
  };
  const centre: Pt = [(ink.l + ink.r) / 2, (ink.t + ink.b) / 2]; // where the x finally sits (the iris opens here)
  const stem = fs * 0.095; // stroke weight of Geist 500's x

  /* ── staging: on narrow screens the hero wordmark is small, so the composition plays larger and
        centred, then glides home at the handoff (a shared-element move). Wide screens play at 1:1. ── */
  const bx = Math.min(...pieces.map((q) => q.r.left)), by = Math.min(...pieces.map((q) => q.r.top));
  const bw = Math.max(...pieces.map((q) => q.r.right)) - bx, bh = Math.max(...pieces.map((q) => q.r.bottom)) - by;
  let S = Math.min((W * 0.82) / bw, (H * 0.34) / bh);
  if (bw > W * 0.6 || S < 1.08) S = 1;
  const T: Pt = S === 1 ? [0, 0] : [(W - bw * S) / 2 - bx * S, H * 0.36 - (bh * S) / 2 - by * S];
  const M = (q: Pt): Pt => [q[0] * S + T[0], q[1] * S + T[1]];
  if (S !== 1) gsap.set(word, { x: T[0], y: T[1], scale: S, transformOrigin: '0 0' });
  const st = stem * S;
  const [il, it] = M([ink.l, ink.t]);
  const [ir, ib] = M([ink.r, ink.b]);

  /* ── the two paths, in viewport coordinates ── */
  const svg = qs<SVGSVGElement>('[data-ld-paths]', root)!;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const pa = qs<SVGPathElement>('[data-ld-a]', root)!;
  const pb = qs<SVGPathElement>('[data-ld-b]', root)!;
  const iris = qs<SVGCircleElement>('[data-ld-iris]', root)!;
  // stroke ends sit just inside the glyph's terminals so the handover doesn't ghost
  const i = st * 0.62, iy = st * 0.1;
  const BL: Pt = [il + i, ib - iy], TR: Pt = [ir - i, it + iy];
  const TL: Pt = [il + i, it + iy], BR: Pt = [ir - i, ib - iy];
  const k = Math.min(W, H) * 0.24;
  const u = unit(sub(TR, BL));
  const v = unit(sub(BR, TL));
  const portrait = H > W;
  // the student's path: in from the lower left, loops back once, then finds the "/" of the x
  const a0: Pt = [-0.05 * W, portrait ? 0.94 * H : 0.9 * H];
  const loop: Pt = [0.3 * W, portrait ? 0.7 * H : 0.6 * H];
  const back: Pt = [0.36 * W, portrait ? 0.84 * H : 0.78 * H];
  pa.setAttribute(
    'd',
    `M${p(a0)}C${p([0.2 * W, 0.99 * H])} ${p([0.44 * W, loop[1] + 0.02 * H])} ${p(loop)}` +
      `C${p([0.17 * W, loop[1] - 0.02 * H])} ${p([0.19 * W, back[1] + 0.03 * H])} ${p(back)}` +
      `C${p([0.5 * W, back[1] - 0.01 * H])} ${p([BL[0] - u[0] * k, BL[1] - u[1] * k])} ${p(BL)}L${p(TR)}`,
  );
  // the mentor's path: one calm arc in from the right, down through the "\" of the x
  const b0: Pt = [1.05 * W, portrait ? 0.62 * H : 0.56 * H];
  const bc: Pt = [Math.max(0.12 * W, TL[0] - 0.3 * W), portrait ? 0.66 * H : 0.62 * H];
  pb.setAttribute('d', `M${p(b0)}C${p(bc)} ${p([TL[0] - v[0] * k, TL[1] - v[1] * k])} ${p(TL)}L${p(BR)}`);
  const La = pa.getTotalLength(), Lb = pb.getTotalLength();
  const seg = Math.hypot(TR[0] - BL[0], TR[1] - BL[1]);
  const A = { head: 0, tail: 0 }, B = { head: 0, tail: 0 };
  const dash = (el: SVGPathElement, s: { head: number; tail: number }, L: number) => {
    el.style.strokeDasharray = `${Math.max(0, s.head - s.tail)} ${L * 2}`;
    el.style.strokeDashoffset = `${-s.tail}`;
  };
  dash(pa, A, La);
  dash(pb, B, Lb);

  /* ── tagline sits under the wordmark, centred ── */
  const tag = qs('[data-ld-tag]', root)!;
  const wordBottom = M([0, by + bh])[1];
  // landscape: a balanced lower-middle line; portrait: anchored close under the wordmark
  tag.style.top = `${Math.min(H * 0.8, portrait ? wordBottom + H * 0.12 : Math.max(wordBottom + H * 0.1, H * 0.56))}px`;
  const tagIn = qsa('.ld__m > span', tag);

  const status = qs('[data-ld-status]', root)!;
  const enter = qs<HTMLButtonElement>('[data-ld-enter]', root)!;
  const bg = qs('.ld__bg', root)!;

  /* ── starting states ── */
  gsap.set(letters, { yPercent: 112 });
  gsap.set(xp.g, { opacity: 0, color: PINK });
  gsap.set(tagIn, { yPercent: 115 });
  root.classList.add('is-live');

  /* ── 01–03: the introduction ── */
  // paused until the main thread is idle, so the first strokes don't drop frames to start-up work
  const intro = gsap.timeline({ paused: true });
  const go = () => intro.play();
  if (typeof requestIdleCallback === 'function') requestIdleCallback(go, { timeout: 400 });
  else setTimeout(go, 120);
  if (!short) {
    intro
      // the student's path: quick start, a hesitation at the loop, then it finds its way
      .to(A, { head: La * 0.42, duration: 0.62, ease: 'power2.out', onUpdate: () => dash(pa, A, La) }, 0.1)
      .to(A, { head: La, duration: 0.7, ease: 'power3.inOut', onUpdate: () => dash(pa, A, La) }, 0.84)
      // the mentor's path: one confident sweep, arriving at the same moment
      .to(B, { head: Lb, duration: 1.0, ease: 'expo.out', onUpdate: () => dash(pb, B, Lb) }, 0.54)
      // they cross: tails retract into the two diagonals, which gain the weight of the glyph
      .to(A, { tail: La - seg, duration: 0.5, ease: 'power3.inOut', onUpdate: () => dash(pa, A, La) }, 1.5)
      .to(B, { tail: Lb - seg, duration: 0.5, ease: 'power3.inOut', onUpdate: () => dash(pb, B, Lb) }, 1.52)
      .to([pa, pb], { attr: { 'stroke-width': st }, duration: 0.42, ease: 'power3.inOut' }, 1.58)
      .to(pb, { stroke: PINK, duration: 0.3 }, 1.6)
      // the glyph takes over from the strokes, and the x has its moment
      .to(xp.g, { opacity: 1, duration: 0.18, ease: 'none' }, 1.96)
      .to([pa, pb], { opacity: 0, duration: 0.2, ease: 'none' }, 2.06)
      .fromTo(xp.g, { scale: 1 }, { scale: 1.07, duration: 0.14, ease: 'power2.out', transformOrigin: '50% 62%' }, 2.02)
      .to(xp.g, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.45)' }, 2.16)
      // the name rises into place
      .to(letters, { yPercent: 0, duration: 0.95, ease: 'expo.out', stagger: { each: 0.045, from: 'end' } }, 2.12)
      .to(tagIn, { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.14 }, 2.42)
      .add(() => ScrollTrigger.refresh(), 2.95) // a still frame: re-measure the page where no one can see a hiccup
      .to({}, { duration: 0.1 }, 3.05);
  } else {
    gsap.set([pa, pb], { opacity: 0 });
    intro
      .fromTo(xp.g, { opacity: 0, scale: 0.6, rotation: -45 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'expo.out', transformOrigin: '50% 62%' }, 0.05)
      .to(letters, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: { each: 0.03, from: 'end' } }, 0.15)
      .add(() => ScrollTrigger.refresh(), 0.75)
      .to({}, { duration: 0.1 }, 0.8);
  }

  /* ── 04: the handoff ── */
  let handing = false;
  let waitStart = 0;
  let poll: gsap.core.Tween | null = null;
  const maxR = Math.max(...[[0, 0], [W, 0], [0, H], [W, H]].map(([x, y]) => Math.hypot(x - centre[0], y - centre[1]))) + 2;

  const handoff = () => {
    if (handing) return;
    handing = true;
    poll?.kill();
    intro.progress(1); // if skipped early, land every element on its final state first
    status.textContent = copy.status.ready;
    root.classList.remove('is-waiting');
    root.classList.add('is-out');
    const ir = { r: 0 };
    bg.style.setProperty('--cx', `${centre[0]}px`);
    bg.style.setProperty('--cy', `${centre[1]}px`);
    iris.setAttribute('cx', String(centre[0]));
    iris.setAttribute('cy', String(centre[1]));
    // staged (narrow screens): the wordmark glides home first and the iris opens as it settles
    const home = S !== 1;
    const at = home ? 0.72 : 0.2;
    const out = gsap
      .timeline({ onComplete: done })
      .to(tagIn, { yPercent: -115, duration: 0.45, ease: 'power3.in', stagger: 0.05 }, 0)
      .to(qsa('.ld__c, .ld__enter', root), { opacity: 0, duration: 0.3 }, 0)
      .to(xp.g, { color: INK, duration: 0.35, ease: 'power1.inOut' }, 0.05)
      .add(reveal, at + 0.05); // hero intro starts; its wordmark lies exactly under this one
    if (home) out.to(word, { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'expo.inOut' }, 0.08);
    out
      .to(
        ir,
        {
          r: maxR,
          duration: 0.95,
          ease: 'power3.inOut',
          onUpdate: () => {
            bg.style.setProperty('--r', `${ir.r}px`);
            iris.setAttribute('r', String(ir.r));
          },
        },
        at,
      )
      .fromTo(iris, { opacity: 1 }, { opacity: 0, duration: 0.45, ease: 'power1.in' }, at + 0.45);
  };

  const tryHandoff = () => {
    if (ready) return handoff();
    // still loading: hold the composed wordmark, say so plainly, offer a way in, and cap the wait
    root.classList.add('is-waiting');
    status.textContent = copy.status.waiting;
    waitStart = performance.now();
    const check = () => {
      const t = (performance.now() - waitStart) / 1000;
      if (ready || t > HARD_CAP) return handoff();
      if (t > ENTER_AFTER && !root.classList.contains('has-enter')) {
        root.classList.add('has-enter');
        enter.tabIndex = 0;
      }
      poll = gsap.delayedCall(0.12, check);
    };
    check();
  };
  intro.eventCallback('onComplete', tryHandoff);

  /* ── escapes: the button, Escape, and a viewport change (the measurements would be stale) ── */
  enter.addEventListener('click', handoff);
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handoff();
  window.addEventListener('keydown', onKey);
  const w0 = W;
  const onResize = () => {
    if (Math.abs(window.innerWidth - w0) > 2) {
      intro.kill();
      poll?.kill();
      done();
    }
  };
  window.addEventListener('resize', onResize);
  offs.push(
    () => window.removeEventListener('keydown', onKey),
    () => window.removeEventListener('resize', onResize),
  );
  site.cleanups.push(() => offs.splice(0).forEach((f) => f()));
}
