import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, on, clamp, onResize, rand, reducedMotion, site } from './utils';
import { hero as heroCopy, flipboard, brand as person } from '@/lib/content';

const MOBILE = '(max-width: 760px)';

export function initHero(): { prepare: () => DOMRect; play: (fromLoader: boolean) => void } | null {
  const hxEl = qs('.hx');
  if (!hxEl) return null;
  const hx: HTMLElement = hxEl;
  const design = qs('.hx__layer--design', hx)!;
  const code = qs('.hx__layer--code', hx)!;
  const split = qs('.hx__split', hx)!;
  const hint = qs('.hx__hint', hx)!;
  const isMobile = () => window.matchMedia(MOBILE).matches;

  /* ───────── the JEE ⇄ NEET curtain (was design ⇄ code) ─────────
     100 = future engineer (default), 0 = future doctor. Every change is broadcast as
     'hx:x' so lib/behaviors/aspirant.ts can move the two worlds. */
  const state = { x: 100 };
  let userMoved = false; // once the visitor drags/keys/taps, scroll stops driving the curtain
  // 50 always lands on the figure's centre (it isn't at the hero's centre), so at 50% the
  // aspirant is split exactly down the middle; 0–50 and 50–100 stretch over each side.
  // --x is the handle's on-screen position (% of the hero); state.x is the slider value.
  let centre = 50;
  const measureCentre = () => {
    const me = qs('.hx__layer--design .hx__me', hx);
    const h = hx.getBoundingClientRect();
    if (!me || !h.width) return;
    const m = me.getBoundingClientRect();
    centre = clamp(((m.left + m.width / 2 - h.left) / h.width) * 100, 15, 85);
  };
  const toPos = (v: number) => (v >= 50 ? centre + ((v - 50) / 50) * (100 - centre) : (v / 50) * centre);
  const fromPos = (p: number) => (p >= centre ? 50 + ((p - centre) / (100 - centre)) * 50 : (p / centre) * 50);
  const setX = (v: number) => {
    state.x = clamp(v, 0, 100);
    hx.style.setProperty('--x', toPos(state.x).toFixed(2));
    split.setAttribute('aria-valuenow', String(Math.round(state.x)));
    split.setAttribute('aria-valuetext', state.x > 50 ? 'future engineer' : state.x < 50 ? 'future doctor' : 'both');
    hx.dispatchEvent(new CustomEvent('hx:x', { detail: state.x }));
  };
  setX(100);
  onResize(() => {
    measureCentre();
    setX(state.x);
  });
  ScrollTrigger.addEventListener('refresh', () => {
    measureCentre();
    setX(state.x);
  });

  // Dragging: grab the knob/line, or press anywhere on the hero background and
  // pull sideways. The split eases towards the pointer so it glides instead of jumping.
  let dragging = false;
  let pending: null | { id: number; x: number; y: number; el: HTMLElement } = null;
  let hintGone = false;
  const glide = { x: 100 };
  const follow = gsap.quickTo(glide, 'x', { duration: 0.32, ease: 'power3.out', onUpdate: () => setX(glide.x) });
  const killHint = () => {
    if (hintGone) return;
    hintGone = true;
    gsap.to(hint, { autoAlpha: 0, y: 8, duration: 0.4 });
  };
  const fromEvent = (e: PointerEvent) => {
    const r = hx.getBoundingClientRect();
    return fromPos(clamp(((e.clientX - r.left) / r.width) * 100, 0, 100));
  };
  let down = { x: 0, t: 0, el: null as HTMLElement | null };
  const begin = (e: PointerEvent, el: HTMLElement) => {
    dragging = true;
    userMoved = true;
    down = { x: e.clientX, t: performance.now(), el };
    pending = null;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
    hx.classList.add('is-dragging');
    gsap.killTweensOf(state);
    glide.x = state.x;
    killHint();
    window.getSelection()?.removeAllRanges();
    follow(fromEvent(e));
  };
  const interactive = 'a, button, input, textarea, select, label, [data-file], .fb, .hx__split, [data-ax]';
  on(split, 'pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('.hx__tag')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault(); // no text selection / image ghost while dragging
    begin(e, split);
  });
  // anywhere else on the hero: start dragging once the pointer moves sideways
  on(hx, 'pointerdown', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest(interactive) || (e.pointerType === 'mouse' && e.button !== 0)) return;
    pending = { id: e.pointerId, x: e.clientX, y: e.clientY, el: hx };
    if (e.pointerType === 'mouse') e.preventDefault();
  });
  on(hx, 'pointermove', (e) => {
    if (dragging) {
      follow(fromEvent(e));
      return;
    }
    if (!pending || e.pointerId !== pending.id) return;
    const dx = Math.abs(e.clientX - pending.x);
    const dy = Math.abs(e.clientY - pending.y);
    if (dy > 10 && dy > dx) pending = null; // a vertical swipe is a scroll
    else if (dx > 8) begin(e, pending.el);
  });
  // release: a tap on the handle toggles; a drag snaps to 0 / 50 / 100
  const end = (e?: Event) => {
    pending = null;
    if (!dragging) return;
    dragging = false;
    hx.classList.remove('is-dragging');
    gsap.killTweensOf(glide);
    const pe = e as PointerEvent | undefined;
    const moved = pe && 'clientX' in pe ? Math.abs(pe.clientX - down.x) : 99;
    if (down.el === split && moved < 5 && performance.now() - down.t < 350) {
      slideTo(state.x > 50 ? 0 : 100, 0.6);
      return;
    }
    const target = [0, 50, 100].reduce((a, b) => (Math.abs(b - state.x) < Math.abs(a - state.x) ? b : a));
    gsap.to(state, {
      x: target,
      duration: reducedMotion() ? 0 : 0.6,
      ease: 'back.out(1.7)',
      onUpdate: () => setX(state.x),
      onComplete: () => void (glide.x = state.x),
    });
  };
  on(hx, 'pointerup', end);
  on(hx, 'pointercancel', end);
  on(window, 'pointerup', end);
  on(window, 'blur', end);
  on(split, 'keydown', (e) => {
    userMoved = true;
    const step = 10;
    if (e.key === 'ArrowLeft') setX(state.x - step);
    else if (e.key === 'ArrowRight') setX(state.x + step);
    else if (e.key === 'Home') setX(0);
    else if (e.key === 'End') setX(100);
    else return;
    e.preventDefault();
    killHint();
  });
  function slideTo(v: number, dur = 1.1) {
    killHint();
    userMoved = true;
    gsap.killTweensOf(state);
    gsap.to(state, {
      x: v,
      duration: reducedMotion() ? 0 : dur,
      ease: 'expo.inOut',
      onUpdate: () => setX(state.x),
      onComplete: () => void (glide.x = state.x),
    });
  }
  on(qs('.hx__tag--d', split)!, 'click', () => slideTo(state.x > 96 ? 50 : 100));
  on(qs('.hx__tag--c', split)!, 'click', () => slideTo(state.x < 4 ? 50 : 0));

  // scroll (secondary): the first ~60vh of scrolling sweeps engineer → doctor, until the visitor takes over
  ScrollTrigger.create({
    trigger: hx,
    start: 'top top',
    end: () => `+=${Math.round(window.innerHeight * 0.6)}`,
    onUpdate: (self) => {
      if (userMoved || dragging) return;
      setX(100 - self.progress * 100);
      glide.x = state.x;
    },
  });

  // idle hint: once, after the intro, the handle peeks 12% in and springs back
  const nudge = () => {
    if (reducedMotion() || userMoved || window.scrollY > 8) return;
    gsap
      .timeline({ onUpdate: () => setX(state.x), onComplete: () => void (glide.x = state.x) })
      .to(state, { x: 88, duration: 0.45, ease: 'power2.out' })
      .to(state, { x: 100, duration: 0.8, ease: 'back.out(1.7)' });
  };

  /* ───────── layout: fit the name, place the photo card & blueprint notes ───────── */
  const canvas = document.createElement('canvas');
  const ctx2d = canvas.getContext('2d')!;

  function layout() {
    const mobile = isMobile();
    const hr = hx.getBoundingClientRect();
    const name = qs('.hx__name', design)!;
    const words = qsa('.hx__w', name);

    // 1. fit the name to the width
    hx.style.removeProperty('--nf');
    const fs0 = parseFloat(getComputedStyle(name).fontSize);
    const wr = words.map((w) => w.getBoundingClientRect());
    const textW = mobile ? Math.max(...wr.map((r) => r.width)) : wr[wr.length - 1].right - wr[0].left;
    const target = mobile ? hr.width - 32 : hr.width * 0.93;
    const nf = clamp((fs0 * target) / textW, 40, mobile ? 160 : 250);
    hx.style.setProperty('--nf', `${nf.toFixed(2)}px`);

    if (mobile) {
      hx.style.removeProperty('--gapx');
      hx.style.removeProperty('--meh');
      hx.style.removeProperty('--meb');
      hx.style.setProperty('--ky', '42%');
      return;
    }

    // 2. the cut-out sits in the gap between the two words, its faded top tucked under the name
    const stage = qs('.hx__stage', design)!;
    const sr = stage.getBoundingClientRect();
    const w1 = words[0].getBoundingClientRect();
    const w2 = words[1].getBoundingClientRect();

    ctx2d.font = `500 ${nf}px Geist, sans-serif`;
    const mH = ctx2d.measureText('H');
    const mx = ctx2d.measureText('x');
    const mp = ctx2d.measureText('p');
    const fA = mH.fontBoundingBoxAscent || nf * 0.9;
    const fD = mH.fontBoundingBoxDescent || nf * 0.22;
    const lh = nf * 0.84;
    const nameTop = name.offsetTop;
    const baseline = nameTop + (lh - (fA + fD)) / 2 + fA;
    const capH = mH.actualBoundingBoxAscent || nf * 0.71;
    const xH = mx.actualBoundingBoxAscent || nf * 0.53;
    const desc = mp.actualBoundingBoxDescent || nf * 0.15;

    const left = qs('.hx__left', design)!.getBoundingClientRect();
    const right = qs('.hx__right', design)!.getBoundingClientRect();
    const centerCol = right.left - left.right;
    // a face-filling selfie reads best centred between the two text columns,
    // starting just under the name, with its cropped bottom tucked behind the yellow strip
    // full-length cut-out: head just under the name, legs hidden behind the yellow strip
    const ratio = person.cutoutW / person.cutoutH;
    const visible = person.cutoutVisible ?? 0.76; // share of the figure above the yellow strip
    const figTop0 = baseline + desc * 0.3;
    let cardH = (sr.height - figTop0) / visible;
    cardH = Math.min(cardH, (centerCol * (person.cutoutMaxCol ?? 0.9)) / ratio);
    const w = cardH * ratio;
    const meb = -(cardH * (1 - visible));
    const figTop = sr.height - meb - cardH;
    hx.style.setProperty('--meh', `${cardH.toFixed(1)}px`);
    // centre it in the gap between the words, but never on top of the side columns
    // centred between the two text columns (or in the gap between the words)
    const gapWord = person.cutoutCentred ? (left.right + right.left) / 2 - hr.left : (w1.right + w2.left) / 2 - hr.left;
    const minC = left.right - hr.left + w / 2 + 12;
    const maxC = right.left - hr.left - w / 2 - 12;
    const gapCenter = minC > maxC ? (minC + maxC) / 2 : clamp(gapWord, minC, maxC);
    hx.style.setProperty('--gapx', `${(gapCenter - hr.width / 2).toFixed(1)}px`);
    hx.style.setProperty('--meb', `${meb.toFixed(1)}px`);
    const top = figTop;
    hx.style.setProperty('--ky', `${(sr.top - hr.top + top + cardH * 0.42).toFixed(1)}px`);

    // 3. blueprint notes in the code layer
    const guides: Record<string, [number, string]> = {
      cap: [baseline - capH, `cap height · ${Math.round(capH)}px`],
      x: [baseline - xH, `x-height · ${Math.round(xH)}px`],
      base: [baseline, 'baseline'],
      desc: [baseline + desc, `descender · ${Math.round(desc)}px`],
    };
    qsa<HTMLElement>('[data-guide]', code).forEach((g) => {
      const [y, t] = guides[g.dataset.guide!];
      g.style.top = `${y.toFixed(1)}px`;
      g.querySelector('span')!.textContent = t;
    });

    const cardLeft = gapCenter - w / 2 - (sr.left - hr.left);
    const cardRight = cardLeft + w;
    const rlGutter = qs('[data-rl="gutter"]', code)!;
    const gut = hr.right - right.right;
    Object.assign(rlGutter.style, { left: `${right.right - sr.left}px`, width: `${gut}px`, top: `${right.top - sr.top - 30}px` });
    rlGutter.querySelector('b')!.textContent = String(Math.round(gut));
    const rlGap = qs('[data-rl="gap"]', code)!;
    const gap = right.left - sr.left - cardRight;
    Object.assign(rlGap.style, {
      left: `${cardRight}px`,
      width: `${Math.max(0, gap)}px`,
      top: `${top + cardH * 0.72}px`,
      display: gap > 30 ? '' : 'none',
    });
    rlGap.querySelector('b')!.textContent = String(Math.round(gap));

    const layers = qs('.hx__layers', code)!;
    const stampTop = qs('.hx__stamp', design)!.getBoundingClientRect().top - sr.top;
    const gutterPx = hr.right - right.right;
    const lw = Math.min(300, sr.width * 0.2);
    // keep clear of the 'drag me' hint that sits right of the knob (split rests at 62%)
    const hintRight = sr.width * 0.62 + 64 + 200;
    const lx = Math.max(sr.width - gutterPx - lw, hintRight + 12);
    const ly = Math.max(baseline + desc + 24, top + 10);
    Object.assign(layers.style, { left: `${lx}px`, width: `${lw}px`, top: `${ly}px`, display: '' });
    // drop rows (keeping the selected last one) until the panel clears the stamp
    const rows = qsa('li', layers);
    rows.forEach((r) => (r.style.display = ''));
    for (let k = rows.length - 2; k >= 2 && ly + layers.offsetHeight > stampTop - 12; k--) rows[k].style.display = 'none';
    const fits = lw > 190 && lx + lw < sr.width - 12 && lx > cardRight + 170 && ly + layers.offsetHeight < stampTop - 12;
    layers.style.display = fits ? '' : 'none';
  }

  /* ───────── multiplayer cursors that bicker over the hero ───────── */
  function runCursors() {
    const stage = qs('.hx__stage', design)!;
    const curs: Record<string, HTMLElement> = {
      client: qs('.mp--client', design)!,
      mentor: qs('.mp--mentor', design)!,
    };
    const spans = Object.fromEntries(Object.entries(curs).map(([k, el]) => [k, el.querySelector('span')!]));
    let i = 0;
    let alive = true;
    let visible = true;
    const spot = (who: string) => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      return who === 'client'
        ? { x: rand(0.12, 0.34) * w, y: rand(0.16, 0.42) * h }
        : { x: rand(0.6, 0.74) * w, y: rand(0.22, 0.5) * h };
    };
    gsap.set(Object.values(curs), { autoAlpha: 1 });
    Object.entries(curs).forEach(([k, el]) => gsap.set(el, spot(k)));

    const step = () => {
      if (!alive) return;
      if (!visible || isMobile()) {
        gsap.delayedCall(1, step);
        return;
      }
      const [who, msg] = heroCopy.cursors[i % heroCopy.cursors.length];
      const key = who === heroCopy.cursorNames.a ? 'client' : 'mentor';
      const el = curs[key];
      i += 1;
      gsap.to(el, { ...spot(key), duration: 1.1, ease: 'power3.inOut' });
      const span = spans[key];
      gsap.delayedCall(0.9, () => {
        span.textContent = '';
        el.classList.remove('is-quiet');
        let n = 0;
        const type = () => {
          n += 1;
          span.textContent = msg.slice(0, n);
          if (n < msg.length) gsap.delayedCall(0.028, type);
        };
        type();
      });
      gsap.delayedCall(3.4, () => el.classList.add('is-quiet'));
      gsap.delayedCall(3.6, step);
    };
    ScrollTrigger.create({ trigger: hx, start: 'top top', end: 'bottom top', onToggle: (s) => (visible = s.isActive) });
    step();
    site.cleanups.push(() => (alive = false));
  }

  /* ───────── chat bubble: keeps typing new messages ───────── */
  function runBubble() {
    const says = qsa('.hx__say', hx);
    const msgs = qsa('[data-say]', hx);
    let k = 0;
    const next = () => {
      if (document.hidden || window.scrollY > hx.offsetHeight) return;
      if (hx.dataset.both === '1') return; // the curtain is at 50%: "why not both?" stays up
      k = (k + 1) % heroCopy.bubbles.length;
      says.forEach((s) => s.classList.add('is-typing'));
      gsap.fromTo(says, { scale: 0.96 }, { scale: 1, duration: 0.4, ease: 'back.out(1.7)' });
      gsap.delayedCall(1.3, () => {
        msgs.forEach((m) => (m.textContent = heroCopy.bubbles[k]));
        says.forEach((s) => s.classList.remove('is-typing'));
        gsap.fromTo(says, { scale: 0.9 }, { scale: 1, duration: 0.55, ease: 'back.out(1.7)' });
      });
    };
    const id = window.setInterval(next, 6500);
    site.cleanups.push(() => window.clearInterval(id));
  }

  /* ───────── intro ───────── */
  // measure & place everything; returns where the photo sits so the loader can draw on top of it
  const prepare = () => {
    layout();
    const me = qsa('.hx__me', hx);
    gsap.set(me, { xPercent: isMobile() ? 0 : -50 });
    measureCentre();
    setX(state.x);
    // build the intro now, paused, while the loader still covers the page,
    // so the reveal frame doesn't pay for style setup
    if (!reducedMotion()) {
      gsap.set(me, { opacity: 1 });
      prepared = build(true);
    }
    return qs('.hx__photo', design)!.getBoundingClientRect();
  };

  let prepared: gsap.core.Timeline | null = null;
  const play = (fromLoader: boolean) => {
    if (fromLoader && prepared) {
      prepared.play();
      return;
    }
    if (reducedMotion()) {
      const all = qsa('.hx__ch, .hx__bar > *, .hx__left, .hx__right, .hx__me', hx);
      gsap.set([all, split, hint], { opacity: 1, y: 0 });
      setX(100);
  onResize(() => {
    measureCentre();
    setX(state.x);
  });
  ScrollTrigger.addEventListener('refresh', () => {
    measureCentre();
    setX(state.x);
  });
      return;
    }
    build(fromLoader).play();
  };

  function build(fromLoader: boolean) {
    const chars = qsa('.hx__ch', hx);
    const bar = qsa('.hx__bar > *', hx);
    const sides = qsa('.hx__left, .hx__right', hx);
    const me = qsa('.hx__me', hx);
    const say = qsa('.hx__say', hx);

    const tl = gsap.timeline({ paused: true, delay: fromLoader ? 0 : 0.15 });
    if (fromLoader) gsap.set(me, { opacity: 1 });
    else tl.fromTo(me, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 0.2);
    // start at 0.001 (not 0) so the browser rasterises these behind the loader, not on the reveal frame
    const o0 = fromLoader ? 0.001 : 0;
    tl.fromTo(bar, { y: -18, opacity: o0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, 0);
    // from the loader, the wordmark is handed over already in place (lib/behaviors/loader.ts builds an
    // exact copy on top of it), so it just appears underneath; otherwise the letters tip forward into place
    if (fromLoader) tl.set(chars, { opacity: 1 }, 0);
    else
      tl.fromTo(
        chars,
        { opacity: 0, yPercent: 40, rotationX: -95, rotationY: -12, z: -60, transformOrigin: '50% 100%' },
        { opacity: 1, yPercent: 0, rotationX: 0, rotationY: 0, z: 0, duration: 1.3, ease: 'expo.out', stagger: 0.045 },
        0.05,
      );
    tl
      .fromTo(sides, { y: 30, opacity: o0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.45)
      .add(() => say.forEach((s) => s.classList.add('is-typing')), 0.7)
      .fromTo(say, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, 0.7)
      .add(() => say.forEach((s) => s.classList.remove('is-typing')), 1.9)
      .fromTo(say, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' }, 1.9)
      .to(split, { opacity: 1, duration: 0.4 }, 0.9)
      .add(() => nudge(), 1.2) // the curtain stays on 'future engineer'; it only peeks once
      .add(runCursors, 2.4)
      .add(runBubble, 2.4);

    if (!isMobile()) {
      const path = qs<SVGPathElement>('[data-hint-path]', hint)!;
      const len = path.getTotalLength();
      tl.set(hint, { opacity: 1 }, 2.1)
        .fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, 2.1)
        .fromTo(qs('span', hint), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.5 }, 2.4);
    }
    return tl;
  }

  onResize(() => {
    layout();
    gsap.set(qsa('.hx__me', hx), { xPercent: isMobile() ? 0 : -50 });
  });

  /* stamp spins with scroll */
  const stampSvgs = qsa('.hx__stamp > svg', hx);
  gsap.set(stampSvgs, { transformOrigin: '50% 50%' });
  let rot = 0;
  let lastY = window.scrollY;
  const spin = () => {
    const y = window.scrollY;
    if (y > hx.offsetHeight * 1.2) {
      lastY = y;
      return;
    }
    rot += (reducedMotion() ? 0 : 0.06) + Math.abs(y - lastY) * 0.25;
    lastY = y;
    gsap.set(stampSvgs, { rotation: rot });
  };
  gsap.ticker.add(spin);
  site.cleanups.push(() => gsap.ticker.remove(spin));

  initFlipboard(hx);
  return { prepare, play };
}

/* ───────── split-flap "been around" board ───────── */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function initFlipboard(hx: HTMLElement) {
  const boards = qsa('[data-fb]', hx);
  if (!boards.length) return;
  let idx = 0;
  let visible = true;

  const flip = () => {
    if (!visible || document.hidden) return;
    idx = (idx + 1) % flipboard.length;
    const item = flipboard[idx];
    boards.forEach((fb) => {
      const cells = qsa('.fb__c i', fb);
      cells.forEach((cell, i) => {
        const ch = item.name[i] && item.name[i] !== ' ' ? item.name[i] : ' ';
        if (cell.textContent === ch) return;
        const steps = 2 + Math.floor(Math.random() * 3);
        const tl = gsap.timeline({ delay: i * 0.035 });
        for (let s = 0; s <= steps; s++) {
          const last = s === steps;
          tl.to(cell, { rotationX: -90, duration: 0.06, ease: 'none' }).add(() => {
            cell.textContent = last ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }).fromTo(cell, { rotationX: 90 }, { rotationX: 0, duration: last ? 0.16 : 0.06, ease: last ? 'back.out(2)' : 'none' });
        }
      });
      const swap = (sel: string, html: string) => {
        const el = qs(sel, fb);
        if (!el) return;
        gsap.to(el, {
          yPercent: -110,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            el.innerHTML = html;
            gsap.fromTo(el, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' });
          },
        });
      };
      swap('[data-fb-no]', String(idx + 1).padStart(2, '0'));
      swap('[data-fb-role]', item.role);
      swap('[data-fb-year]', item.year);
      swap('[data-fb-st]', `<i></i>${item.st}`);
    });
  };
  const id = window.setInterval(flip, 3400);
  site.cleanups.push(() => window.clearInterval(id));
  ScrollTrigger.create({ trigger: hx, start: 'top bottom', end: 'bottom top', onToggle: (s) => (visible = s.isActive) });
}
