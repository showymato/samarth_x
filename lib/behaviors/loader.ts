import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, reducedMotion, site } from './utils';
import { loader as copy, brand as person, play } from '@/lib/content';

/*
  Halftone "DPI" loading screen, modelled on the original.

  Smoothness: every dot layer is rendered ONCE up front (one canvas per ink per
  dot size). The animation itself only moves, scales and cross-fades those
  pre-rendered layers with drawImage on every frame, so it runs at a steady
  60fps instead of redrawing tens of thousands of dots per step.
*/

const INKS = [
  { color: '#8b5cf6', ch: 0 }, // lavender plate ← red channel
  { color: '#ffcf5c', ch: 2 }, // butter plate   ← blue channel
  { color: '#ff4f9a', ch: 1 }, // pink plate     ← green channel
] as const;

// per step: how far the inks drift apart (× base) and how long the step lasts (relative)
const SEP = [0.02, 0.02, 0.025, 0.03, 0.05, 0.09, 0.27, 0.2, 0.13, 0.065, 0.014, 0];
const WEIGHT = [1.1, 0.9, 0.9, 0.9, 0.9, 0.9, 1.4, 1.1, 1.1, 1, 1, 1];
const TOTAL = 3.5; // seconds for the whole DPI ladder

const loadImg = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.decoding = 'async';
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export async function runLoader(target: DOMRect, onReveal: () => void): Promise<void> {
  const root = qs('.ld');
  if (!root) {
    onReveal();
    return;
  }
  const html = document.documentElement;
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    onReveal();
  };
  const finish = () => {
    reveal();
    root.remove();
    html.classList.remove('is-loading');
    site.lenis?.start();
  };
  if (reducedMotion()) {
    finish();
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    return;
  }
  html.classList.add('is-loading');
  site.lenis?.stop();
  window.scrollTo(0, 0);

  const cv = qs<HTMLCanvasElement>('.ld__cv', root)!;
  const dpiEl = qs('[data-ld-dpi]', root)!;
  const msgEl = qs('[data-ld-msg]', root)!;
  const countEl = qs('[data-ld-count]', root)!;
  const ctx = cv.getContext('2d')!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  // preload the gallery so "designs n/12" is real
  const tiles = play.tiles.map((t) => t.src);
  let loaded = 0;
  countEl.textContent = `0/${tiles.length}`;
  // fetch only (no image decode) so the counter doesn't steal frames from the animation
  tiles.forEach((src) =>
    fetch(src, { priority: 'low' } as RequestInit)
      .then((r) => r.blob())
      .catch(() => null)
      .then(() => {
        loaded += 1;
        countEl.textContent = `${loaded}/${tiles.length}`;
      }),
  );

  const t0 = performance.now();
  let img: HTMLImageElement;
  try {
    img = await loadImg(person.cutout);
  } catch {
    finish();
    return;
  }

  const R = target;
  const steps = copy.steps;
  const n = steps.length;
  const zoomAt = (k: number) => (k < 6 ? 1.75 - (k / 6) * 0.75 : 1);
  const cellAt = (k: number) => Math.max(3.4, 360 / steps[k][0]);
  const sepBase = Math.max(R.width * 1.2, 380);

  // sample source: the cut-out's alpha is the mask
  const SW = 180;
  const SH = Math.round((SW * img.naturalHeight) / img.naturalWidth);
  const src = document.createElement('canvas');
  src.width = SW;
  src.height = SH;
  const sx = src.getContext('2d', { willReadFrequently: true })!;
  sx.drawImage(img, 0, 0, SW, SH);
  const px = sx.getImageData(0, 0, SW, SH).data;

  // ── pre-render the dot layers (one per ink per distinct dot size) ──
  type Layer = { canvas: HTMLCanvasElement };
  const cache = new Map<string, Layer[]>();
  const layersFor = (k: number): Layer[] => {
    const cell = cellAt(k);
    const scale = zoomAt(k);
    const jitter = k < 4 ? cell * 0.4 : k < 6 ? cell * 0.15 : 0;
    const key = `${cell.toFixed(2)}|${scale.toFixed(2)}|${jitter.toFixed(1)}`;
    const hit = cache.get(key);
    if (hit) return hit;
    const cw = Math.ceil(R.width * scale);
    const ch = Math.ceil(R.height * scale);
    const layers = INKS.map((ink, i) => {
      const c = document.createElement('canvas');
      c.width = cw;
      c.height = ch;
      const g = c.getContext('2d')!;
      g.fillStyle = ink.color;
      g.beginPath();
      const off = (i * cell) / 3;
      for (let y = off; y < ch; y += cell) {
        for (let x = off; x < cw; x += cell) {
          const si = ((((y / ch) * SH) | 0) * SW + (((x / cw) * SW) | 0)) * 4;
          const a = px[si + 3] / 255;
          if (a < 0.04) continue;
          const amt = (1 - px[si + ink.ch] / 255) * a;
          const r = cell * 0.54 * Math.sqrt(amt);
          if (r < 0.35) continue;
          const jx = jitter ? (hash(x, y + i) - 0.5) * jitter * 2 : 0;
          const jy = jitter ? (hash(y, x - i) - 0.5) * jitter * 2 : 0;
          g.moveTo(x + jx + r, y + jy);
          g.arc(x + jx, y + jy, r, 0, Math.PI * 2);
        }
      }
      g.fill();
      return { canvas: c };
    });
    cache.set(key, layers);
    return layers;
  };
  for (let k = 0; k < n; k++) layersFor(k);

  // the real photo at its on-screen size, for the final registration
  const photo = document.createElement('canvas');
  photo.width = Math.max(1, Math.round(R.width * dpr));
  photo.height = Math.max(1, Math.round(R.height * dpr));
  const pc = photo.getContext('2d')!;
  pc.imageSmoothingQuality = 'high';
  pc.drawImage(img, 0, 0, photo.width, photo.height);

  // warm up: push every pre-rendered layer to the GPU now, during the dark flash,
  // so the first visible frames don't stall on texture uploads
  cache.forEach((ls) => ls.forEach((l) => ctx.drawImage(l.canvas, 0, 0, 2, 2)));
  ctx.drawImage(photo, 0, 0, 2, 2);
  ctx.clearRect(0, 0, W, H);

  // a brief dark flash, like the original, then the paper and the bar
  const ink = Math.max(0, 380 - (performance.now() - t0));
  await new Promise((r) => setTimeout(r, ink));

  const face = { x: R.left + R.width * 0.4, y: R.top + R.height * 0.12 };
  const weights = WEIGHT.slice(0, n);
  const wsum = weights.reduce((a, b) => a + b, 0);
  // cumulative start (0..1) of every step
  const starts: number[] = [];
  weights.forEach((w, i) => starts.push(i ? starts[i - 1] + weights[i - 1] / wsum : 0));

  const drawLevel = (k: number, alpha: number, zoom: number, sep: number) => {
    if (alpha <= 0.001) return;
    const zx = face.x + (R.left - face.x) * zoom;
    const zy = face.y + (R.top - face.y) * zoom;
    const zw = R.width * zoom;
    const zh = R.height * zoom;
    ctx.globalAlpha = alpha;
    layersFor(k).forEach((layer, i) => {
      const dx = (i - 1) * sep;
      const dy = (i === 0 ? 0.02 : i === 2 ? -0.012 : 0) * R.height * 0.25 * Math.min(1, sep / (0.1 * sepBase));
      ctx.drawImage(layer.canvas, zx + dx, zy + dy, zw, zh);
    });
  };

  let lastLabel = -1;
  const frame = (u: number, photoMix: number) => {
    let k = 0;
    while (k < n - 1 && u >= starts[k + 1]) k++;
    const segLen = k < n - 1 ? starts[k + 1] - starts[k] : 1 - starts[k];
    const p = Math.min(1, (u - starts[k]) / Math.max(1e-6, segLen));
    const next = Math.min(n - 1, k + 1);
    // hold each DPI, then cross-fade to the next during the last 40% of the step
    const fade = k === n - 1 ? 0 : smooth(Math.max(0, (p - 0.6) / 0.4));
    // zoom and ink separation glide continuously across the whole step
    const e = smooth(p);
    const zoom = lerp(zoomAt(k), zoomAt(next), e);
    const sep = lerp(SEP[k], SEP[next], e) * sepBase;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    if (photoMix < 1) {
      ctx.globalCompositeOperation = 'multiply';
      drawLevel(k, (1 - fade) * (1 - photoMix), zoom, sep);
      drawLevel(next, fade * (1 - photoMix), zoom, sep);
    }
    if (photoMix > 0) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = photoMix;
      ctx.drawImage(photo, R.left, R.top, R.width, R.height);
    }
    ctx.globalAlpha = 1;

    const shown = fade > 0.5 ? next : k;
    const dpi = Math.round(lerp(steps[k][0], steps[next][0], fade));
    dpiEl.textContent = String(dpi).padStart(3, '0');
    if (shown !== lastLabel) {
      lastLabel = shown;
      if (msgEl.textContent !== steps[shown][1]) msgEl.textContent = steps[shown][1];
    }
  };

  // show the first frame and hold it still while the dark flash fades to paper,
  // so any one-off browser work happens on a static image instead of mid-motion
  frame(0, 0);
  root.classList.remove('is-ink');
  await new Promise((r) => setTimeout(r, 320));

  // run the ladder on the GSAP ticker, register into the photo, then reveal
  await new Promise<void>((res) => {
    const st = { u: 0, photo: 0 };
    gsap
      .timeline({ onComplete: res })
      .to(st, { u: 1, duration: TOTAL, ease: 'none', onUpdate: () => frame(st.u, st.photo) })
      .to(st, { photo: 1, duration: 0.5, ease: 'power2.inOut', onUpdate: () => frame(1, st.photo) }, '-=0.25')
      // the frame is static here, so re-measure the page now where a hiccup can't be seen
      .add(() => ScrollTrigger.refresh())
      .to({}, { duration: 0.3 });
  });

  reveal();
  await new Promise<void>((res) => {
    gsap.to(root, { opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: res });
  });
  finish();
  // free the layer memory once the page is idle, off the reveal's critical frames
  window.setTimeout(() => cache.forEach((ls) => ls.forEach((l) => (l.canvas.width = 0))), 1500);
}
