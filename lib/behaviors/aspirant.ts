import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, on, onResize, reducedMotion, isFinePointer, whileVisible, site } from './utils';
import { futures, hero as heroCopy } from '@/lib/content';

/*
  Hero "two futures, one aspirant": engineer (x = 100) ⟷ doctor (x = 0).
  lib/behaviors/hero.ts owns the slider and broadcasts 'hx:x'. Here we move the worlds:
  - curtain: windows slide one way, their content slides back (transforms only, no repaint)
  - divider (circuit ⟷ ECG) follows the handle; a scan flash when it crosses the figure's centre
  - caption crossfades at 50%; at exactly 50% the bubble asks "why not both?"
  - idle: bob, chips float, gears turn, heart beats at 72 bpm, helix twists (each side pauses when hidden)
  - desktop: background parallax + head tilt toward the cursor
  - click: focus mode (headphones) · pricing CTA hover: thumbs-up · reduced motion: static
*/
export function initAspirant() {
  const ax = qs('[data-ax]');
  if (!ax) return;
  const hx = ax.closest('.hx') as HTMLElement;
  const rm = reducedMotion();
  const fine = isFinePointer();

  const win = { eng: qs('[data-ax-win="eng"]', ax)!, doc: qs('[data-ax-win="doc"]', ax)! };
  const inner = { eng: qs('.ax__in', win.eng)!, doc: qs('.ax__in', win.doc)! };
  const bgWin = qs('[data-fx-win="doc"]', hx)!;
  const bgIn = qs('.fx__in', bgWin)!;
  const div = qs('[data-fx-div]', hx)!;
  const scan = qs('.fx-div__scan', div)!;
  const traces = qsa<SVGPathElement>('.fx-div__trace', div);
  const heads = qsa<SVGGElement>('.ax__head', ax);
  const thumb = qs<SVGGElement>('.ax__thumb', ax)!;
  const says = qsa('[data-say]', hx);

  /* ── the curtain ── */
  let x = 100;
  let side: 'eng' | 'doc' = 'eng';
  let lastCentreSide = 1;
  const apply = () => {
    const h = hx.getBoundingClientRect();
    const f = ax.getBoundingClientRect();
    // the handle's on-screen position (hero.ts maps the slider so 50 = the figure's centre)
    const D = h.left + (h.width * (parseFloat(hx.style.getPropertyValue('--x')) || x)) / 100;
    // figure windows span the figure box ±60% wide (see .ax__win)
    const L0 = f.left - 0.6 * f.width;
    const WW = 2.2 * f.width;
    const t = gsap.utils.clamp(0, WW, D - L0);
    const u = gsap.utils.clamp(0, WW, L0 + WW - D);
    gsap.set(win.doc, { x: t });
    gsap.set(inner.doc, { x: -t });
    gsap.set(win.eng, { x: -u });
    gsap.set(inner.eng, { x: u });
    // background: the doctor world covers everything right of the handle
    const tb = gsap.utils.clamp(0, h.width, D - h.left);
    gsap.set(bgWin, { x: tb });
    gsap.set(bgIn, { x: -tb });
    gsap.set(div, { x: D - h.left });
    div.classList.toggle('is-on', x > 0.5 && x < 99.5);
    // scan flash when the curtain crosses the figure's centre
    const centreSide = Math.sign(D - (f.left + f.width / 2)) || 1;
    if (centreSide !== lastCentreSide && x > 0.5 && x < 99.5 && !rm) {
      gsap.fromTo(scan, { opacity: 0.95, scaleY: 0.2 }, { opacity: 0, scaleY: 1, duration: 0.15, ease: 'power1.out' });
    }
    lastCentreSide = centreSide;
    // which future is "current" (caption, aria, paused sets)
    const now = x < 50 ? 'doc' : 'eng';
    if (now !== side) {
      side = now;
      ax.dataset.side = side;
      ax.setAttribute('aria-label', futures.aria[side]);
    }
    // exactly 50%: "why not both? ask your mentor."
    const both = Math.abs(x - 50) < 1.5;
    if (both && hx.dataset.both !== '1') {
      hx.dataset.both = '1';
      says.forEach((m) => (m.textContent = futures.bubbleBoth));
    } else if (!both && hx.dataset.both === '1') {
      delete hx.dataset.both;
      says.forEach((m) => (m.textContent = heroCopy.bubble));
    }
    syncPlay();
  };
  on(hx, 'hx:x' as keyof HTMLElementEventMap, ((e: CustomEvent<number>) => {
    x = e.detail;
    apply();
  }) as EventListener);
  onResize(apply);
  ScrollTrigger.addEventListener('refresh', apply);
  site.cleanups.push(() => ScrollTrigger.removeEventListener('refresh', apply));
  requestAnimationFrame(apply);

  /* ── idle loops: one set per side, each paused while its side is hidden or the hero is off-screen ── */
  const sets: Record<'eng' | 'doc' | 'both', gsap.core.Tween[]> = { eng: [], doc: [], both: [] };
  if (!rm) {
    sets.both.push(gsap.to(qsa('.ax__fig', ax), { y: -2.5, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    qsa<SVGGElement>('.ax-f', ax).forEach((g, i) =>
      sets.both.push(gsap.to(g, { y: i % 2 ? 3 : -3, duration: 2.4 + (i % 4) * 0.5, delay: i * 0.15, ease: 'sine.inOut', yoyo: true, repeat: -1 })),
    );
    sets.both.push(
      gsap.to(traces, { strokeDashoffset: -900, duration: 3.2, ease: 'none', repeat: -1 }),
    );
    const ga = qs('.fx__piece--gear-a', hx);
    const gb = qs('.fx__piece--gear-b', hx);
    if (ga) sets.eng.push(gsap.to(ga, { rotation: 360, duration: 16, ease: 'none', repeat: -1 }));
    if (gb) sets.eng.push(gsap.to(gb, { rotation: -360, duration: 16 * (8 / 12), ease: 'none', repeat: -1 }));
    const heart = qs('.fx__piece--heart', hx);
    // 72 bpm: one beat every 0.833 s (a quick double thump, then rest)
    if (heart)
      sets.doc.push(
        gsap.to(heart, {
          keyframes: [{ scale: 1.09, duration: 0.09 }, { scale: 1, duration: 0.12 }, { scale: 1.05, duration: 0.08 }, { scale: 1, duration: 0.543 }],
          repeat: -1,
          ease: 'sine.inOut',
        }),
      );
    const helix = qs('.fx__helix', hx);
    if (helix) {
      const period = () => (helix.getBoundingClientRect().height || 176) / 3;
      sets.doc.push(gsap.fromTo(helix, { y: 0 }, { y: () => -period(), duration: 2.6, ease: 'none', repeat: -1 }));
    }
    Object.values(sets).flat().forEach((t) => t.pause());
  }
  let inView = false;
  function syncPlay() {
    const play = (list: gsap.core.Tween[], onState: boolean) => list.forEach((t) => (onState ? t.play() : t.pause()));
    play(sets.both, inView);
    play(sets.eng, inView && x > 0.5);
    play(sets.doc, inView && x < 99.5);
  }
  whileVisible(
    hx,
    () => {
      inView = true;
      syncPlay();
      startScreens();
    },
    () => {
      inView = false;
      syncPlay();
      stopScreens();
    },
  );

  /* ── phone screens: both phones cycle together every 2.5 s ── */
  const groups = [0, 1, 2, 3].map((i) => qsa<SVGGElement>(`[data-ax-scr="${i}"]`, ax));
  let k = 0;
  let cycle = 0;
  const nextScreen = () => {
    const prev = groups[k];
    k = (k + 1) % groups.length;
    gsap.to(prev, { opacity: 0, y: -6, duration: 0.3, ease: 'power2.in' });
    gsap.fromTo(groups[k], { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, delay: 0.25, ease: 'power2.out' });
  };
  function startScreens() {
    if (!rm && !cycle) cycle = window.setInterval(nextScreen, 2500);
  }
  function stopScreens() {
    window.clearInterval(cycle);
    cycle = 0;
  }
  site.cleanups.push(stopScreens);

  /* ── desktop: background parallax (4–8 px) + the head tilts toward the cursor ── */
  if (!rm && fine) {
    const par = qsa('[data-fx-par]', hx).map((el, i) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
      depth: i ? 8 : 5,
    }));
    const tilts = heads.map((h) => gsap.quickTo(h, 'rotation', { duration: 0.6, ease: 'power3.out' }));
    let raf = 0;
    on(hx, 'pointermove', (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        par.forEach((p) => {
          p.x(-nx * p.depth * 2);
          p.y(-ny * p.depth * 2);
        });
        const r = ax.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width * 0.38)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height * 0.1)) / window.innerHeight;
        tilts.forEach((t) => t(gsap.utils.clamp(-5, 5, dx * 10 + dy * 2)));
      });
    });
    on(hx, 'pointerleave', () => {
      par.forEach((p) => {
        p.x(0);
        p.y(0);
      });
      tilts.forEach((t) => t(0));
    });
  }

  /* ── never cover hero text: hide any callout/chip/label that would overlap it at this width ── */
  const pieces = qsa<SVGGElement>('.ax-p', ax);
  const words = () =>
    qsa('.hx__layer--design :is(.hx__left, .hx__right, .hx__bar) :is(p, a, button), .hx__layer--design .hx__ch, .hx__layer--design .hx__say', hx)
      .map((el) => el.getBoundingClientRect())
      .filter((b) => b.width && b.height);
  const M = 10;
  const cull = () => {
    const text = words();
    pieces.forEach((g) => {
      g.style.visibility = '';
      const a = g.getBoundingClientRect();
      const hit = text.some((b) => a.left - M < b.right && a.right + M > b.left && a.top - M < b.bottom && a.bottom + M > b.top);
      if (hit) g.style.visibility = 'hidden';
    });
  };
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    requestAnimationFrame(cull);
    window.setTimeout(cull, 2600);
    window.setTimeout(cull, 5200);
    window.setTimeout(cull, 8000); // loader + hero intro have fully settled
  });
  ScrollTrigger.addEventListener('refresh', cull);
  onResize(cull);
  site.cleanups.push(() => ScrollTrigger.removeEventListener('refresh', cull));

  /* ── click / Enter on the character: switch future (engineer ⟷ doctor) ── */
  // reuse the handle's own JEE / NEET tags so the switch sweeps like the handle does
  const toggle = () => qs<HTMLButtonElement>(x > 50 ? '.hx__tag--c' : '.hx__tag--d', hx)?.click();
  on(ax, 'click', toggle);
  on(ax, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });

  /* ── a quick thumbs-up whenever a pricing CTA is hovered, anywhere on the page ── */
  let last = 0;
  on(document, 'pointerover', (e: PointerEvent) => {
    const t = (e.target as HTMLElement).closest?.('a[href="#pricing"], [data-cursor="enroll"]');
    if (!t || performance.now() - last < 900) return;
    last = performance.now();
    gsap.killTweensOf(thumb);
    if (rm) {
      gsap.set(thumb, { opacity: 1, scale: 1 });
      gsap.set(thumb, { opacity: 0, delay: 1.2 });
      return;
    }
    gsap
      .timeline()
      .fromTo(thumb, { opacity: 0, scale: 0.3, rotation: -25 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(2.4)' })
      .to(thumb, { rotation: 12, duration: 0.12, yoyo: true, repeat: 3, ease: 'sine.inOut' })
      .to(thumb, { opacity: 0, scale: 0.6, duration: 0.3, delay: 0.5 });
  });
}
