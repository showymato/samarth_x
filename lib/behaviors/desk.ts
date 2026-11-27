import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, on, onResize, clamp, rand, toast, copyText, reducedMotion } from './utils';
import { openLightbox } from './play';
import { initTerminal } from './terminal';
import { flashCursor } from './cursor';
import { brand as person, about } from '@/lib/content';

type Item = { el: HTMLElement; x: number; y: number; r: number; hx: number; hy: number; type: string };

// Reference layout measured from the original desk at 1296px wide (designer mode)
const REF_W = 1296;
const REF: Record<string, [number, number]> = {
  scr: [40, 66],
  kbd: [40, 475],
  note0: [660, 138.5],
  phone: [866, 66],
  badge: [1076, 172],
  polaroid0: [700, 446],
  polaroid1: [956, 446],
  card: [80, 758],
  key: [326, 781],
  chai: [434, 768],
  frame: [568, 686],
  plant: [914, 766],
  note1: [1052, 732],
  patch: [500, 986],
  headphones: [658, 1004],
};

export function initDesk() {
  const deskEl = qs('[data-desk]');
  if (!deskEl) return;
  const desk: HTMLElement = deskEl;
  const scr = qs('[data-scr]', desk)!;
  const dks = qsa('.dk', desk);
  const mat = qs('.desk__mat', desk)!;
  const statusEl = qs('[data-desk-status]', desk)!;
  const term = initTerminal();

  const counts: Record<string, number> = {};
  const items: Item[] = [scr, ...dks].map((el) => {
    const t = el === scr ? 'scr' : el.dataset.type!;
    const key = t === 'note' || t === 'polaroid' ? `${t}${(counts[t] = (counts[t] ?? -1) + 1)}` : t;
    el.dataset.key = key;
    return { el, x: 0, y: 0, r: 0, hx: 0, hy: 0, type: t };
  });
  const byEl = new Map(items.map((it) => [it.el, it]));
  let mode: 'knoll' | 'mess' = 'knoll';
  let z = 10;

  const apply = (it: Item) => gsap.set(it.el, { x: it.x, y: it.y, rotation: it.r });
  const visible = (it: Item) => it.el.offsetWidth > 0;

  /* ───────── layout (designer mode = "knolled") ───────── */
  function layout() {
    const W = desk.clientWidth;
    let H = 1176;
    if (W >= 1180) {
      const k = W / REF_W;
      const sw = Math.round(557 * k);
      desk.style.setProperty('--sw', `${sw}px`);
      const scrH = scr.offsetHeight;
      items.forEach((it) => {
        const [x, y] = REF[it.el.dataset.key!] || [40, 66];
        it.hx = Math.round(x * (it.type === 'scr' || it.type === 'kbd' ? 1 : k));
        it.hy = y;
      });
      const kb = items.find((i) => i.type === 'kbd')!;
      kb.hy = 66 + scrH + 27;
      const kbBottom = kb.hy + kb.el.offsetHeight;
      desk.style.setProperty('--mx', '22px');
      desk.style.setProperty('--my', '48px');
      desk.style.setProperty('--mw', `${sw + 36}px`);
      desk.style.setProperty('--mh', `${kbBottom + 22 - 48}px`);
      H = Math.max(1176, kbBottom + 500);
    } else {
      // shelf-pack: screen + keyboard as a block, everything else flows around it
      const small = W < 700;
      const pad = small ? 14 : 22;
      const sw = Math.round(small ? W - pad * 2 - 18 : clamp(W * 0.48, 380, 557));
      desk.style.setProperty('--sw', `${sw}px`);
      const gx = pad + 18;
      let gy = 66;
      const scrIt = items[0];
      scrIt.hx = gx;
      scrIt.hy = gy;
      gy += scr.offsetHeight + 24;
      const kb = items.find((i) => i.type === 'kbd')!;
      if (visible(kb)) {
        kb.hx = gx;
        kb.hy = gy;
        gy += kb.el.offsetHeight + 4;
      }
      const groupBottom = gy;
      desk.style.setProperty('--mx', `${pad}px`);
      desk.style.setProperty('--my', '48px');
      desk.style.setProperty('--mw', `${sw + 36}px`);
      desk.style.setProperty('--mh', `${groupBottom + 18 - 48}px`);

      const gap = small ? 16 : 26;
      let regionL = pad + sw + 36 + gap + 6;
      const regionR = W - pad;
      let x = regionL;
      let y = 66;
      let rowH = 0;
      let below = regionR - regionL < 180;
      if (below) {
        regionL = pad;
        x = pad;
        y = groupBottom + 40;
      }
      let maxBottom = groupBottom;
      items.slice(1).forEach((it) => {
        if (it.type === 'kbd' || !visible(it)) return;
        const w = it.el.offsetWidth;
        const h = it.el.offsetHeight;
        if (x + w > regionR && x > regionL) {
          x = regionL;
          y += rowH + gap;
          rowH = 0;
        }
        if (!below && (y > groupBottom - 60 || w > regionR - regionL)) {
          below = true;
          regionL = pad;
          x = pad;
          y = Math.max(groupBottom + 40, y);
          rowH = 0;
        }
        it.hx = x;
        it.hy = y;
        x += w + gap;
        rowH = Math.max(rowH, h);
        maxBottom = Math.max(maxBottom, y + h);
      });
      H = maxBottom + 64;
    }
    desk.style.setProperty('--dh', `${Math.round(H)}px`);
    desk.style.height = `${Math.round(H)}px`;
  }

  function knoll(animate = true) {
    items.forEach((it, i) => {
      it.x = it.hx;
      it.y = it.hy;
      it.r = 0;
      if (animate && !reducedMotion()) gsap.to(it.el, { x: it.x, y: it.y, rotation: 0, duration: 1, ease: 'expo.inOut', delay: i * 0.025 });
      else apply(it);
    });
    window.setTimeout(updateStatus, animate ? 1100 : 0);
  }

  function mess() {
    const W = desk.clientWidth;
    const H = desk.clientHeight;
    items.forEach((it, i) => {
      if (!visible(it)) return;
      const w = it.el.offsetWidth;
      const h = it.el.offsetHeight;
      const big = it.type === 'scr' || it.type === 'kbd';
      it.x = clamp(it.hx + rand(-1, 1) * (big ? 60 : W * 0.25), 0, Math.max(0, W - w));
      it.y = clamp(it.hy + rand(-1, 1) * (big ? 50 : H * 0.18), 40, Math.max(40, H - h - 30));
      it.r = rand(-1, 1) * (big ? 6 : 28);
      gsap.to(it.el, { x: it.x, y: it.y, rotation: it.r, duration: 1.1, ease: 'expo.out', delay: i * 0.02 });
    });
    window.setTimeout(updateStatus, 1150);
  }

  function updateStatus() {
    const vis = items.filter(visible);
    const tilt = vis.reduce((s, it) => s + Math.abs(it.r), 0) / vis.length;
    const off = vis.reduce((s, it) => s + Math.hypot(it.x - it.hx, it.y - it.hy), 0) / vis.length;
    const tidy = tilt < 0.05 && off < 1;
    statusEl.classList.toggle('is-tidy', tidy);
    statusEl.classList.toggle('is-mess', !tidy);
    statusEl.textContent = tidy
      ? 'knolled ✓ · 0.0° tilt · 0px off grid'
      : `${mode === 'mess' ? 'chaos' : 'rearranged'} · ${tilt.toFixed(1)}° avg tilt · ${Math.round(off)}px off grid`;
  }

  /* ───────── day / night ───────── */
  const lamp = qs('[data-desk-lamp]', desk)!;
  const tEl = qs('[data-desk-time]', desk)!;
  const mood = qs('[data-desk-mood]', desk)!;
  const ampmEl = qs('[data-desk-ampm]', desk);
  const setNight = (night: boolean) => {
    desk.classList.toggle('is-night', night);
    lamp.setAttribute('aria-pressed', String(night));
    tEl.textContent = night ? about.time.night[0] : about.time.day[0];
    if (ampmEl) ampmEl.textContent = night ? about.time.night[1] : about.time.day[1];
    mood.textContent = night ? about.mood.night : about.mood.day;
  };
  on(lamp, 'click', () => setNight(!desk.classList.contains('is-night')));

  const btnKnoll = qs('[data-desk-knoll]')!;
  const btnMess = qs('[data-desk-mess]')!;
  const setMode = (m: 'knoll' | 'mess') => {
    mode = m;
    btnKnoll.classList.toggle('is-on', m === 'knoll');
    btnMess.classList.toggle('is-on', m === 'mess');
    setNight(m === 'mess');
    if (m === 'knoll') knoll();
    else mess();
  };
  on(btnKnoll, 'click', () => setMode('knoll'));
  on(btnMess, 'click', () => setMode('mess'));

  /* ───────── dragging & throwing ───────── */
  let drag: null | {
    it: Item;
    id: number;
    sx: number;
    sy: number;
    ox: number;
    oy: number;
    moved: boolean;
    vx: number;
    vy: number;
    lx: number;
    ly: number;
    lt: number;
  } = null;

  on(desk, 'pointerdown', (e) => {
    const t = e.target as HTMLElement;
    if (e.button !== 0) return;
    if (t.closest('.kb__k:not(.kb__k--gone)')) return; // keys are for typing
    if (t.closest('.term__body, input, a, .desk__lamp')) return;
    const el = t.closest<HTMLElement>('.dk, .scr');
    if (!el) return;
    const it = byEl.get(el);
    if (!it) return;
    gsap.killTweensOf(el, 'x,y,rotation');
    drag = { it, id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: it.x, oy: it.y, moved: false, vx: 0, vy: 0, lx: e.clientX, ly: e.clientY, lt: performance.now() };
    el.style.zIndex = String(++z);
    el.setPointerCapture(e.pointerId);
  });
  on(desk, 'pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    if (!drag.moved) {
      drag.moved = true;
      drag.it.el.classList.add('is-drag');
    }
    const now = performance.now();
    const dt = Math.max(1, now - drag.lt);
    drag.vx = lerpV(drag.vx, ((e.clientX - drag.lx) / dt) * 16, 0.4);
    drag.vy = lerpV(drag.vy, ((e.clientY - drag.ly) / dt) * 16, 0.4);
    drag.lx = e.clientX;
    drag.ly = e.clientY;
    drag.lt = now;
    const it = drag.it;
    it.x = drag.ox + dx;
    it.y = drag.oy + dy;
    const big = it.type === 'scr' || it.type === 'kbd';
    const tr = clamp(it.r + drag.vx * (big ? 0.05 : 0.35), -35, 35);
    gsap.set(it.el, { x: it.x, y: it.y });
    gsap.to(it.el, { rotation: tr, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    it.r = lerpV(it.r, tr, 0.12);
  });
  const release = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { it, moved, vx, vy } = drag;
    drag = null;
    it.el.classList.remove('is-drag');
    if (!moved) {
      act(it, e);
      return;
    }
    const W = desk.clientWidth;
    const H = desk.clientHeight;
    const w = it.el.offsetWidth;
    const h = it.el.offsetHeight;
    it.x = clamp(it.x + vx * 9, -w * 0.3, W - w * 0.7);
    it.y = clamp(it.y + vy * 9, 30, H - h * 0.6);
    gsap.to(it.el, { x: it.x, y: it.y, rotation: it.r, duration: 0.9, ease: 'power3.out', onComplete: updateStatus });
  };
  on(desk, 'pointerup', release);
  on(desk, 'pointercancel', release);

  /* ───────── things you can click on the desk ───────── */
  const phoneList = qs('.ph__n', desk);
  let phoneIdx = 3;
  let sips = 0;

  function act(it: Item, e: PointerEvent) {
    const el = it.el;
    const pulse = (cls: string, ms = 900) => {
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      window.setTimeout(() => el.classList.remove(cls), ms);
    };
    switch (it.type) {
      case 'kbd': {
        const k = (e.target as HTMLElement).closest('.kb__k--gone');
        if (k) toast(about.toasts.esc);
        break;
      }
      case 'phone': {
        if (!phoneList) break;
        const n = about.phone[phoneIdx % about.phone.length];
        phoneIdx += 1;
        const tpl = phoneList.querySelector<HTMLElement>(`li[data-game="${n.key}"]`) || phoneList.firstElementChild;
        const li = tpl!.cloneNode(true) as HTMLElement;
        li.dataset.game = n.key;
        li.querySelector('b')!.textContent = n.app;
        li.querySelector('em')!.textContent = 'now';
        li.querySelector('span')!.textContent = n.text;
        phoneList.querySelectorAll('em').forEach((em, i) => (em.textContent = ['4m', '1h', '2h'][i] || '3h'));
        li.classList.add('is-new');
        phoneList.prepend(li);
        while (phoneList.children.length > 4) phoneList.lastElementChild?.remove();
        pulse('is-buzz', 600);
        break;
      }
      case 'badge':
        pulse('is-spin');
        toast(about.toasts.badge);
        break;
      case 'polaroid':
        openLightbox([{ src: el.dataset.full!, cap: el.dataset.cap! }]);
        break;
      case 'card':
        copyText(person.email).then((ok) => {
          if (!ok) return;
          flashCursor('copied!');
          toast(`copied <b>${person.email}</b>`);
          pulse('is-copied', 1500);
        });
        break;
      case 'key':
        pulse('is-down', 160);
        toast(about.toasts.key);
        break;
      case 'chai': {
        sips += 1;
        pulse('is-sip', 3600);
        const tea = el.querySelector<SVGCircleElement>('[data-chai-tea]');
        if (tea) {
          const r = sips >= 5 ? 27 : 27 - sips * 5;
          gsap.to(tea, { attr: { r: Math.max(4, r) }, duration: 0.6, ease: 'power2.out' });
        }
        toast(sips >= 5 ? about.toasts.chaiEmpty : about.toasts.chai(sips));
        if (sips >= 5) sips = 0;
        break;
      }
      case 'frame':
        toast(about.toasts.frame);
        break;
      case 'plant':
        pulse('is-water', 800);
        toast(about.toasts.plant);
        break;
      case 'patch':
        toast(about.toasts.patch);
        break;
      case 'headphones':
        pulse('is-play', 1500);
        toast(about.toasts.headphones);
        break;
      case 'note':
        gsap.fromTo(el, { rotation: it.r - 4 }, { rotation: it.r, duration: 0.8, ease: 'elastic.out(1.2, .4)' });
        break;
      default:
        break;
    }
  }

  /* ───────── keyboard: click keys or type on your own keyboard ───────── */
  const press = (code: string) => {
    const k = qs(`.kb__k[data-code="${code}"]`, desk);
    if (!k) return;
    k.classList.add('is-down');
    window.setTimeout(() => k.classList.remove('is-down'), 130);
  };
  on(desk, 'click', (e) => {
    const k = (e.target as HTMLElement).closest<HTMLElement>('.kb__k:not(.kb__k--gone)');
    if (!k || !term) return;
    press(k.dataset.code!);
    const code = k.dataset.code!;
    if (code === 'Backspace') term.backspace();
    else if (code === 'Enter') term.enter();
    else if (k.dataset.ch !== undefined) term.type(k.dataset.ch);
  });
  let deskOnScreen = false;
  ScrollTrigger.create({ trigger: desk, start: 'top bottom', end: 'bottom top', onToggle: (s) => (deskOnScreen = s.isActive) });
  on(window, 'keydown', (e) => {
    if (!deskOnScreen) return;
    const k = qs(`.kb__k[data-code="${e.code}"]`, desk);
    k?.classList.add('is-down');
  });
  on(window, 'keyup', (e) => {
    const k = qs(`.kb__k[data-code="${e.code}"]`, desk);
    k?.classList.remove('is-down');
  });

  /* ───────── ambience ───────── */
  const palm = qs('.desk__palm', desk);
  if (palm && !reducedMotion())
    gsap.to(palm, { rotation: 2.4, x: -8, y: 3, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '100% 0%' });
  const win = qs('.desk__win', desk);
  if (win)
    gsap.fromTo(win, { x: 60, y: -34 }, { x: 18, y: 0, ease: 'none', scrollTrigger: { trigger: desk, start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ───────── boot ───────── */
  layout();
  knoll(false);
  void mat;

  // items drop onto the desk the first time it scrolls in
  const all = items.map((i) => i.el);
  gsap.set(all, { autoAlpha: 0, '--drop': 1.14 });
  ScrollTrigger.create({
    trigger: desk,
    start: 'top 75%',
    once: true,
    onEnter: () =>
      gsap.to(all, { autoAlpha: 1, '--drop': 1, duration: 0.7, ease: 'back.out(2)', stagger: 0.045 }),
  });

  onResize(() => {
    layout();
    if (mode === 'knoll') knoll(false);
    else {
      const W = desk.clientWidth;
      items.forEach((it) => {
        it.x = clamp(it.x, 0, Math.max(0, W - it.el.offsetWidth));
        apply(it);
      });
    }
    ScrollTrigger.refresh();
  });
}

function lerpV(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
