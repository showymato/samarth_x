import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, on, onResize, reducedMotion, isFinePointer, whileVisible, site } from './utils';

/*
  Hero "sticker-collage aspirant".
  idle: breathing bob + stickers floating · scroll: stickers peel off outward (scrubbed, so they settle back)
  cursor: head tilts toward the pointer (desktop) · click: focus mode (headphones, pill, reels flicked away)
  hover on any pricing CTA: thumbs-up · reduced motion: static collage.
*/
export function initAspirant() {
  const ax = qs('[data-ax]');
  if (!ax) return;
  const hx = ax.closest('.hx') as HTMLElement;
  const rm = reducedMotion();
  const fig = qs<SVGSVGElement>('.ax__fig', ax)!;
  const head = qs<SVGGElement>('.ax__head', ax)!;
  const hp = qs<SVGGElement>('.ax__hp', ax)!;
  const pill = qs<SVGGElement>('.ax__pill', ax)!;
  const thumb = qs<SVGGElement>('.ax__thumb', ax)!;
  const reels = qs<SVGGElement>('.ax-s--reels', ax)!;
  const screens = qsa<SVGGElement>('[data-ax-scr]', ax);
  const stickers = qsa<SVGGElement>('.ax-s', ax);

  /* ── never cover hero text: hide any sticker/doodle that would overlap it at this width ── */
  const pieces = qsa<SVGGElement>('.ax__stk > g:not(.ax-d):not(.ax__pill):not(:has(.ax__thumb)), .ax-d > g', ax);
  const words = () =>
    qsa('.hx__layer--design :is(.hx__left, .hx__right, .hx__bar) :is(p, a, button), .hx__layer--design .hx__ch', hx)
      .map((el) => el.getBoundingClientRect())
      .filter((b) => b.width && b.height);
  const M = 14; // covers the idle float (±4 units) + rotation
  const hits = (g: Element, text: DOMRect[]) => {
    const a = g.getBoundingClientRect();
    return text.some((b) => a.left - M < b.right && a.right + M > b.left && a.top - M < b.bottom && a.bottom + M > b.top);
  };
  // placement is "translate(x y) rotate(r)": slide a colliding piece inward onto the figure, hide only as a last resort
  const cull = () => {
    const text = words();
    pieces.forEach((g) => {
      const orig = (g.dataset.t ??= g.getAttribute('transform') ?? '');
      g.setAttribute('transform', orig);
      g.style.visibility = '';
      if (!hits(g, text)) return;
      const m = orig.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)(.*)/);
      if (m) {
        const x = +m[1];
        const inward = x < 144 ? 1 : -1;
        for (let step = 1; step <= 10; step++) {
          g.setAttribute('transform', `translate(${x + inward * step * 10} ${m[2]})${m[3]}`);
          if (!hits(g, text)) return;
        }
        g.setAttribute('transform', orig);
      }
      g.style.visibility = 'hidden';
    });
  };
  // once fonts are in, and again after the hero intro has settled
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    requestAnimationFrame(cull);
    window.setTimeout(cull, 2600);
    window.setTimeout(cull, 5200);
    window.setTimeout(cull, 8000); // loader (~3.5 s) + hero intro have fully settled
  });
  ScrollTrigger.addEventListener('refresh', cull);
  onResize(cull);
  site.cleanups.push(() => ScrollTrigger.removeEventListener('refresh', cull));

  /* ── phone screen: cycles every 2.5 s while the hero is on screen ── */
  let k = 0;
  let cycle = 0;
  const nextScreen = () => {
    const prev = screens[k];
    k = (k + 1) % screens.length;
    gsap.to(prev, { opacity: 0, y: -6, duration: 0.3, ease: 'power2.in' });
    gsap.fromTo(screens[k], { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, delay: 0.25, ease: 'power2.out' });
  };

  /* ── idle loops (paused off-screen) ── */
  const idle: gsap.core.Tween[] = [];
  if (!rm) {
    idle.push(gsap.to(fig, { y: -2.5, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    qsa<SVGGElement>('.ax-f', ax).forEach((f, i) =>
      idle.push(
        gsap.to(f, {
          y: i % 2 ? 4 : -4,
          rotation: i % 2 ? 1.5 : -1.5,
          duration: 2.4 + (i % 4) * 0.55,
          delay: i * 0.17,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        }),
      ),
    );
    const pend = qs('.ax__pend', ax);
    if (pend) idle.push(gsap.fromTo(pend, { rotation: -16 }, { rotation: 16, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    const orb = qs('.ax__orb', ax);
    if (orb) idle.push(gsap.to(orb, { rotation: 360, duration: 14, ease: 'none', repeat: -1 }));
    idle.forEach((t) => t.pause());
  }
  whileVisible(
    hx,
    () => {
      inView = true;
      idle.forEach((t) => t.play());
      if (!rm && !cycle) cycle = window.setInterval(nextScreen, 2500);
    },
    () => {
      inView = false;
      idle.forEach((t) => t.pause());
      window.clearInterval(cycle);
      cycle = 0;
    },
  );
  site.cleanups.push(() => window.clearInterval(cycle));

  /* ── perf: idle floats rest while the page is scrolling (the peel already moves the stickers) ── */
  let inView = false;
  let rest = 0;
  if (!rm) {
    on(window, 'scroll', () => {
      if (!inView) return;
      idle.forEach((t) => t.pause());
      window.clearTimeout(rest);
      rest = window.setTimeout(() => inView && idle.forEach((t) => t.play()), 180);
    }, { passive: true });
  }

  /* ── scroll: stickers peel off and drift outward; scrubbed, so they settle back on scroll-up ── */
  if (!rm) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: hx, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    stickers.forEach((s, i) => {
      const dir = Number(s.dataset.dir) || 1;
      const depth = Number(s.dataset.depth) || 1;
      tl.to(s, { x: dir * 70 * depth, y: -60 * depth, rotation: dir * (8 + (i % 3) * 5), ease: 'none' }, 0);
    });
  }

  /* ── cursor: head tilts a few degrees toward the pointer (desktop only) ── */
  if (!rm && isFinePointer()) {
    const tilt = gsap.quickTo(head, 'rotation', { duration: 0.6, ease: 'power3.out' });
    let raf = 0;
    on(hx, 'pointermove', (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = ax.getBoundingClientRect();
        const cx = r.left + r.width * 0.38;
        const cy = r.top + r.height * 0.1;
        const dx = (e.clientX - cx) / window.innerWidth;
        const dy = (e.clientY - cy) / window.innerHeight;
        tilt(gsap.utils.clamp(-5, 5, dx * 10 + dy * 2));
      });
    });
    on(hx, 'pointerleave', () => tilt(0));
  }

  /* ── click: focus mode on / off ── */
  let focus = false;
  const d = rm ? 0 : 1;
  const setFocus = (onState: boolean) => {
    focus = onState;
    ax.setAttribute('aria-label', onState ? 'Illustrated student taking a selfie, surrounded by study stickers. Focus mode is on.' : 'Illustrated student taking a selfie, surrounded by study stickers.');
    if (onState) {
      gsap.fromTo(hp, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 * d, ease: 'back.out(1.6)' });
      gsap.fromTo(pill, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45 * d, delay: 0.15 * d, ease: 'back.out(2)' });
      gsap.to(reels, { x: 420, y: -160, rotation: 220, opacity: 0, duration: 0.7 * d, ease: 'power2.in' });
    } else {
      gsap.to(hp, { y: -40, opacity: 0, duration: 0.35 * d, ease: 'power2.in' });
      gsap.to(pill, { opacity: 0, scale: 0.6, duration: 0.3 * d });
      // back to wherever the scroll scrub wants it
      gsap.to(reels, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.6 * d, ease: 'back.out(1.4)' });
    }
  };
  on(ax, 'click', () => setFocus(!focus));
  on(ax, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFocus(!focus);
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
