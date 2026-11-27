import gsap from 'gsap';
import { qs, on, isFinePointer, copyText, toast, every, kolkataTime, qsa } from './utils';
import { brand as person, hero } from '@/lib/content';

/** Custom dot cursor that grows into a label over anything with data-cursor. */
export function initCursor() {
  const c = qs('.cursor');
  const label = qs('.cursor__label');
  if (!c || !label || !isFinePointer()) return;
  document.documentElement.classList.add('has-cursor');

  let x = -100;
  let y = -100;
  let cx = x;
  let cy = y;
  let flashUntil = 0;
  const pos = { set: gsap.quickSetter(c, 'css') };

  on(window, 'pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    c.classList.add('is-on');
  });
  on(document, 'pointerleave', () => c.classList.remove('is-on'));
  on(window, 'blur', () => c.classList.remove('is-on'));
  on(window, 'pointerdown', () => c.classList.add('is-down'));
  on(window, 'pointerup', () => c.classList.remove('is-down'));

  on(document, 'pointerover', (e) => {
    if (performance.now() < flashUntil) return;
    const t = e.target as HTMLElement;
    const el = t.closest<HTMLElement>('[data-cursor]');
    const text = !el && t.closest('input, textarea, [contenteditable]');
    c.classList.toggle('is-text', !!text);
    if (el && el.dataset.cursor) {
      label.textContent = el.dataset.cursor;
      c.classList.add('is-label');
    } else {
      c.classList.remove('is-label');
    }
  });

  const tick = () => {
    cx += (x - cx) * 0.24;
    cy += (y - cy) * 0.24;
    pos.set({ transform: `translate3d(${cx}px, ${cy}px, 0)` });
  };
  gsap.ticker.add(tick);

  // let other modules flash a message on the cursor ("copied!")
  window.addEventListener('cursor:flash', ((e: CustomEvent<string>) => {
    label.textContent = e.detail;
    c.classList.add('is-label');
    flashUntil = performance.now() + 1100;
    window.setTimeout(() => {
      const hovered = document.querySelectorAll(':hover');
      const last = hovered[hovered.length - 1] as HTMLElement | undefined;
      const el = last?.closest<HTMLElement>('[data-cursor]');
      if (el?.dataset.cursor) label.textContent = el.dataset.cursor;
      else c.classList.remove('is-label');
    }, 1150);
  }) as EventListener);
}

export function flashCursor(text: string) {
  window.dispatchEvent(new CustomEvent('cursor:flash', { detail: text }));
}

/** Copy-email buttons, clocks and the "save" file button in the hero bar. */
export function initSmallBits() {
  on(document, 'click', async (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-copy-email]');
    if (!btn) return;
    const ok = await copyText(person.email);
    flashCursor(ok ? 'copied!' : 'hmm, try again');
    toast(ok ? `copied <b>${person.email}</b>` : person.email);
    const span = btn.querySelector('span');
    if (span && ok) {
      const old = span.textContent;
      span.textContent = 'copied ✓';
      window.setTimeout(() => (span.textContent = old), 1600);
    }
  });

  const clocks = qsa('[data-clock]');
  const tickClock = () => clocks.forEach((t) => (t.textContent = kolkataTime()));
  tickClock();
  every(10_000, tickClock);

  // "timetable_final_FINAL_v7.pdf" → every click saves a new version
  let v = 7;
  qsa('[data-file]').forEach((b) =>
    on(b, 'click', () => {
      v += 1;
      qsa('[data-file-v]').forEach((el) => {
        el.textContent = String(v);
        gsap.fromTo(el, { yPercent: -60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' });
      });
      flashCursor(`saved v${v}`);
      toast(`saved as <b>${hero.file.name}${v}${hero.file.ext}</b>${v > 11 ? ' · this timetable is final. really.' : ''}`);
    }),
  );
}
