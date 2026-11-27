import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, on, onResize, site, isFinePointer } from './utils';

/* ───────── masonry gallery with filters ───────── */
export function initGallery() {
  const galleryEl = qs('[data-gallery]');
  if (!galleryEl) return;
  const gallery: HTMLElement = galleryEl;
  const tiles = qsa('.tile', gallery);
  const pills = qsa<HTMLButtonElement>('.pills .pill');
  let filter = 'all';

  const cols = () => (window.innerWidth > 1100 ? 4 : window.innerWidth > 640 ? 3 : 2);

  function layout(animate = false) {
    const n = cols();
    const visible = tiles.filter((t) => filter === 'all' || (t.dataset.tags || '').split(',').includes(filter));
    tiles.forEach((t) => t.classList.toggle('is-hidden', !visible.includes(t)));
    const columns = Array.from({ length: n }, () => {
      const c = document.createElement('div');
      c.className = 'gallery__col';
      return c;
    });
    const heights = new Array(n).fill(0);
    visible.forEach((t) => {
      const img = t.querySelector('img')!;
      const ratio = Number(img.getAttribute('height')) / Number(img.getAttribute('width')) || 1;
      const k = heights.indexOf(Math.min(...heights));
      columns[k].appendChild(t);
      heights[k] += ratio + 0.06;
    });
    // keep hidden tiles in the DOM (last column) so they can come back
    tiles.filter((t) => !visible.includes(t)).forEach((t) => columns[n - 1].appendChild(t));
    gallery.replaceChildren(...columns);
    if (animate) {
      gsap.fromTo(visible, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'expo.out', stagger: 0.04 });
    }
    parallax(columns);
    ScrollTrigger.refresh();
  }

  // columns drift at different speeds as you scroll past (desktop only)
  let drift: gsap.core.Tween[] = [];
  function parallax(columns: HTMLElement[]) {
    drift.forEach((t) => t.scrollTrigger?.kill() || t.kill());
    drift = [];
    if (window.innerWidth < 761) return;
    const amp = [40, -50, 70, -30];
    columns.forEach((col, i) => {
      drift.push(
        gsap.fromTo(col, { y: amp[i % 4] }, { y: -amp[i % 4], ease: 'none', scrollTrigger: { trigger: gallery, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }),
      );
    });
  }

  pills.forEach((p) =>
    on(p, 'click', () => {
      filter = p.dataset.f || 'all';
      pills.forEach((x) => x.classList.toggle('is-on', x === p));
      layout(true);
    }),
  );
  layout();
  onResize(() => layout());

  // reveal tiles as they scroll in
  ScrollTrigger.batch(tiles, {
    start: 'top 92%',
    once: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }),
  });

  // subtle 3D tilt
  if (isFinePointer()) {
    tiles.forEach((t) => {
      const btn = t.querySelector<HTMLElement>('.tile__open')!;
      on(btn, 'pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(btn, { rotationY: px * 8, rotationX: -py * 8, duration: 0.5, ease: 'power2.out' });
      });
      on(btn, 'pointerleave', () => gsap.to(btn, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'elastic.out(1, .5)' }));
    });
  }

  on(gallery, 'click', (e) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>('.tile');
    if (!tile) return;
    const list = qsa('.tile:not(.is-hidden)', gallery).map((t) => ({ src: t.dataset.full!, cap: t.dataset.cap! }));
    // gallery order follows the columns; sort by original order for prev/next
    const ordered = tiles.filter((t) => !t.classList.contains('is-hidden')).map((t) => ({ src: t.dataset.full!, cap: t.dataset.cap! }));
    openLightbox(ordered.length ? ordered : list, ordered.findIndex((x) => x.src === tile.dataset.full));
  });
}

/* ───────── kinetic marquee: speeds up and skews with scroll velocity ───────── */
export function initMarquee() {
  const pm = qs('[data-marquee]');
  if (!pm) return;
  const track = qs('.pm__track', pm)!;
  const stars = qsa('.pm__star', pm);
  let x = 0;
  let skew = 0;
  let dir = -1;
  let visible = false;
  const st = ScrollTrigger.create({
    trigger: pm,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (s) => (visible = s.isActive),
    onUpdate: (s) => (dir = s.direction === 1 ? -1 : 1),
  });
  const setX = gsap.quickSetter(track, 'x', 'px');
  const setSkew = gsap.quickSetter(track, 'skewX', 'deg');
  const tick = (_t: number, dt: number) => {
    if (!visible) return;
    const v = st.getVelocity();
    const speed = 0.06 + Math.min(1.4, Math.abs(v) / 2200);
    x += dir * speed * dt;
    const half = track.scrollWidth / 2;
    if (x <= -half) x += half;
    if (x > 0) x -= half;
    skew += (gsap.utils.clamp(-12, 12, -v / 260) - skew) * 0.12;
    setX(x);
    setSkew(skew);
  };
  gsap.ticker.add(tick);
  site.cleanups.push(() => gsap.ticker.remove(tick));
  gsap.to(stars, { rotation: 360, duration: 6, ease: 'none', repeat: -1 });
}

/* ───────── lightbox ───────── */
let lbItems: { src: string; cap: string }[] = [];
let lbIndex = 0;

export function openLightbox(items: { src: string; cap: string }[], index = 0) {
  const lb = qs('.lightbox');
  if (!lb) return;
  lbItems = items;
  lbIndex = Math.max(0, index);
  show();
  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add('is-open'));
  site.lenis?.stop();
  qs('.lightbox__close', lb)?.focus({ preventScroll: true });
  qsa('.lightbox__nav', lb).forEach((b) => (b.style.display = items.length > 1 ? '' : 'none'));
}

function show() {
  const lb = qs('.lightbox')!;
  const it = lbItems[lbIndex];
  const img = qs<HTMLImageElement>('.lightbox__fig img', lb)!;
  img.src = it.src;
  img.alt = it.cap;
  qs('.lightbox__fig figcaption', lb)!.textContent = it.cap;
  gsap.fromTo(img, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
}

function closeLightbox() {
  const lb = qs('.lightbox');
  if (!lb || lb.hidden) return;
  lb.classList.remove('is-open');
  window.setTimeout(() => (lb.hidden = true), 350);
  site.lenis?.start();
}

export function initLightbox() {
  const lb = qs('.lightbox');
  if (!lb) return;
  on(qs('.lightbox__close', lb)!, 'click', closeLightbox);
  on(lb, 'click', (e) => {
    if (e.target === lb) closeLightbox();
  });
  const step = (d: number) => {
    if (lbItems.length < 2) return;
    lbIndex = (lbIndex + d + lbItems.length) % lbItems.length;
    show();
  };
  on(qs('.lightbox__nav--prev', lb)!, 'click', () => step(-1));
  on(qs('.lightbox__nav--next', lb)!, 'click', () => step(1));
  on(window, 'keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}
