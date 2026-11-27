import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa } from './utils';
import { journey } from '@/lib/content';

const LANE: Record<string, number> = { main: 0, work: -1, side: 1 };

/** Horizontal "git log --graph": pinned, HEAD moves through the commits as you scroll. */
export function initJourney() {
  const gxEl = qs('[data-gx]');
  if (!gxEl) return;
  const gx: HTMLElement = gxEl;
  const view = qs('.gx__view', gx)!;
  const track = qs('[data-gx-track]', gx)!;
  const graph = qs('[data-gx-graph]', gx)!;
  const ph = qs('.gx__ph', gx)!;
  const cms = qsa('[data-cm]', gx);
  const next = qs('[data-cm-next]', gx)!;
  const n = cms.length;
  const hud = {
    ver: qs('[data-gx-ver]', gx)!,
    date: qs('[data-gx-date]', gx)!,
    type: qs('[data-gx-type]', gx)!,
    num: qs('[data-gx-n]', gx)!,
    bar: qs('[data-gx-bar]', gx)!,
    year: qs('[data-gx-year]', gx)!,
  };
  gx.style.height = '100svh';

  let g = 260;
  let p0 = 600;
  let width = 4000;
  let reveal: SVGSVGElement | null = null;
  let active = -1;

  function build() {
    const fs = parseFloat(getComputedStyle(track).fontSize);
    g = 18 * fs;
    const L = 3.1 * fs;
    const vw = view.clientWidth;
    const vh = view.clientHeight;
    p0 = Math.round(vw * (vw < 700 ? 0.5 : 0.36));
    width = Math.round(p0 + n * g + vw * 0.7);
    const y0 = vh * 0.47;
    const x = (i: number) => p0 + i * g;

    track.style.setProperty('--p0', `${p0}px`);
    track.style.width = `${width}px`;
    ph.style.left = `${p0}px`;
    gx.style.setProperty('--phx', `${p0}px`);

    const lanes = cms.map((c) => c.dataset.lane || 'main');
    const lastMain = lanes.lastIndexOf('main');
    const f = (v: number) => v.toFixed(1);
    const paths: string[] = [];
    const labels: string[] = [];
    paths.push(`<path d="M${f(x(0) - 0.9 * g)} ${f(y0)}L${f(x(lastMain))} ${f(y0)}" data-lane="main"/>`);
    paths.push(`<path d="M${f(x(lastMain))} ${f(y0)}L${f(x(n))} ${f(y0)}" data-lane="main" class="is-next"/>`);
    labels.push(`<text x="${f(x(0) - 0.9 * g + 6)}" y="${f(y0 - 10)}" class="lbl-main" text-anchor="start">${journey.lanes.main}</text>`);

    // consecutive commits on the same side lane share one branch
    let i = 0;
    while (i < n) {
      const lane = lanes[i];
      if (lane === 'main') {
        i++;
        continue;
      }
      let j = i;
      while (j + 1 < n && lanes[j + 1] === lane) j++;
      const y1 = y0 + LANE[lane] * L;
      const s = x(i) - 0.46 * g;
      const e = x(j) + 0.46 * g;
      const d =
        `M${f(s)} ${f(y0)}C${f(s + 0.253 * g)} ${f(y0)} ${f(x(i) - 0.252 * g)} ${f(y1)} ${f(x(i) - 0.046 * g)} ${f(y1)}` +
        `L${f(x(j) + 0.047 * g)} ${f(y1)}C${f(x(j) + 0.254 * g)} ${f(y1)} ${f(x(j) + 0.207 * g)} ${f(y0)} ${f(e)} ${f(y0)}`;
      paths.push(`<path d="${d}" data-lane="${lane}"/>`);
      labels.push(
        `<text x="${f(x(i) - 16)}" y="${f(lane === 'work' ? y1 - 10 : y1 + 18)}" class="lbl-${lane}" text-anchor="end">${lane === 'work' ? journey.lanes.work : journey.lanes.side}</text>`,
      );
      i = j + 1;
    }

    const ghost = paths.map((p) => p.replace(/ data-lane="\w+"| class="is-next"/g, '')).join('');
    const h = Math.round(vh);
    graph.innerHTML =
      `<svg class="gx__svg" width="${width}" height="${h}" viewBox="0 0 ${width} ${h}"><g class="gx__ghost">${ghost}</g></svg>` +
      `<svg class="gx__svg" data-gx-reveal width="${width}" height="${h}" viewBox="0 0 ${width} ${h}"><g class="gx__live">${paths.join('')}${labels.join('')}</g></svg>`;
    reveal = graph.querySelector('[data-gx-reveal]');
    if (reveal) reveal.style.clipPath = `inset(0px ${width - p0}px 0px 0px)`;
  }

  function setActive(i: number) {
    if (i === active) return;
    const dir = i > active ? 1 : -1;
    active = i;
    cms.forEach((c, k) => c.classList.toggle('is-on', k <= i));
    next.classList.toggle('is-on', i >= n);
    const c = cms[Math.min(i, n - 1)];
    const isNext = i >= n;
    const v = isNext ? (next.querySelector('.cm__v')?.textContent || '').replace(/^v/, '') : c.dataset.v!;
    const date = isNext ? 'soon' : c.dataset.date!;
    const type = isNext ? 'unreleased' : c.dataset.type!;
    gsap.fromTo(hud.ver, { yPercent: 70 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' });
    hud.ver.textContent = v;
    hud.date.textContent = date;
    hud.type.textContent = type;
    hud.type.dataset.type = type;
    hud.num.textContent = String(Math.min(i, n - 1) + 1).padStart(2, '0');
    hud.year.textContent = date;
  }

  build();
  setActive(0);
  ScrollTrigger.addEventListener('refreshInit', build);

  const st = ScrollTrigger.create({
    trigger: gx,
    start: 'top top',
    end: () => `+=${Math.round(n * g * 1.1)}`,
    pin: true,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (s) => {
      const t = s.progress * n * g;
      gsap.set([track, graph], { x: -t });
      if (reveal) reveal.style.clipPath = `inset(0px ${Math.max(0, width - (p0 + t))}px 0px 0px)`;
      gsap.set(hud.bar, { scaleX: Math.min(1, (t / g + 1) / n) });
      setActive(Math.min(n, Math.round(t / g + 0.15)));
    },
  });
  st.refresh();
}
