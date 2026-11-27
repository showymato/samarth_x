import type Lenis from 'lenis';

export const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector(sel) as T | null;
export const qsa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll(sel)) as T[];

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rand = (a: number, b: number) => a + Math.random() * (b - a);
export const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

type Cleanup = () => void;

export const site: {
  lenis: Lenis | null;
  cleanups: Cleanup[];
} = { lenis: null, cleanups: [] };

export function on<K extends keyof WindowEventMap>(
  target: Window,
  type: K,
  fn: (e: WindowEventMap[K]) => void,
  opts?: AddEventListenerOptions | boolean,
): void;
export function on<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  fn: (e: DocumentEventMap[K]) => void,
  opts?: AddEventListenerOptions | boolean,
): void;
export function on<K extends keyof HTMLElementEventMap>(
  target: Element,
  type: K,
  fn: (e: HTMLElementEventMap[K]) => void,
  opts?: AddEventListenerOptions | boolean,
): void;
export function on(target: EventTarget, type: string, fn: (e: never) => void, opts?: AddEventListenerOptions | boolean) {
  target.addEventListener(type, fn as EventListener, opts);
  site.cleanups.push(() => target.removeEventListener(type, fn as EventListener, opts));
}

export function every(ms: number, fn: () => void) {
  const id = window.setInterval(fn, ms);
  site.cleanups.push(() => window.clearInterval(id));
  return id;
}

export function onResize(fn: () => void, delay = 150) {
  let t = 0;
  let w = window.innerWidth;
  let h = window.innerHeight;
  on(window, 'resize', () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      // ignore mobile address-bar height jitter
      if (window.innerWidth === w && Math.abs(window.innerHeight - h) < 120) return;
      w = window.innerWidth;
      h = window.innerHeight;
      fn();
    }, delay);
  });
}

/* ---------- toast ---------- */
let toastTimer = 0;
export function toast(html: string, ms = 2200) {
  const el = qs('.toast');
  if (!el) return;
  el.innerHTML = html;
  el.classList.add('is-on');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-on'), ms);
}

/* ---------- clipboard ---------- */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

/* ---------- smooth scroll ---------- */
export function scrollToTarget(target: string | HTMLElement | number, opts: { offset?: number; immediate?: boolean } = {}) {
  const el = typeof target === 'string' ? (target === '#top' ? 0 : qs(target)) : target;
  if (el === null) return;
  if (site.lenis) site.lenis.scrollTo(el as HTMLElement | number, { offset: opts.offset ?? 0, duration: 1.5, immediate: opts.immediate });
  else if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'smooth' });
  else (el as HTMLElement).scrollIntoView({ behavior: 'smooth' });
}

export function kolkataTime(d = new Date()) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(d);
}

/** Runs `play` while the element is on screen and `pause` when it leaves. */
export function whileVisible(el: Element, play: () => void, pause: () => void, rootMargin = '80px') {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? play() : pause())),
    { rootMargin },
  );
  io.observe(el);
  site.cleanups.push(() => io.disconnect());
}
