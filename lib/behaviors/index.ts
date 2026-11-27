import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { site, reducedMotion } from './utils';
import { initCursor, initSmallBits } from './cursor';
import { initHero } from './hero';
import { initShort, initReveals, initStack, initNpm, initDock, initAnchors } from './scroll';
import { initMocks } from './mocks';
import { initGallery, initLightbox, initMarquee } from './play';
import { initJourney } from './journey';
import { initDesk } from './desk';
import { initFooter } from './footer';
import { runLoader } from './loader';
import { initArcade } from './arcade';
import { initAspirant } from './aspirant';

let booted = false;

export function initSite() {
  if (booted) return () => {};
  booted = true;
  gsap.registerPlugin(ScrollTrigger);
  // no automatic re-measure on window 'load': it would land in the middle of the loading animation.
  // The loader triggers the refresh itself during its final still frame.
  ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,resize' });
  const html = document.documentElement;
  html.classList.add('js');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // smooth scrolling (skipped for reduced motion)
  let tick: ((t: number) => void) | null = null;
  if (!reducedMotion()) {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: false });
    site.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }

  let hero: ReturnType<typeof initHero> = null;
  const ctx = gsap.context(() => {
    hero = initHero();
    initAspirant();
    initCursor();
    initSmallBits();
    initAnchors();
    initLightbox();
    initShort();
    initStack();
    initMocks();
    initGallery();
    initMarquee();
    initArcade();
    initJourney();
    initNpm();
    initDesk();
    initFooter();
    initDock();
  });

  // anything that depends on text measurement waits for the web fonts
  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    ctx.add(() => initReveals());
    ScrollTrigger.refresh();
    const h = hero as ReturnType<typeof initHero>;
    if (!h) return;
    const rect = h.prepare();
    // halftone loading screen, then the hero intro plays as it fades away
    runLoader(rect, () => ctx.add(() => h.play(true)));
  });

  return () => {
    site.cleanups.splice(0).forEach((fn) => fn());
    ctx.revert();
    if (tick) gsap.ticker.remove(tick);
    site.lenis?.destroy();
    site.lenis = null;
    booted = false;
  };
}
