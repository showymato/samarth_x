import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, on, scrollToTarget, reducedMotion } from './utils';

/* ───────── "the short version": words light up as you scroll (pinned) ───────── */
export function initShort() {
  const mf = qs('.mf');
  if (!mf) return;
  const words = qsa('.mfw', mf);
  const chip = qs('.mf__c', mf);
  const diff = qs('.mf__diff', mf);
  const fri = qs('.mf__f', mf);
  const sub = qs('[data-mf-sub]', mf);
  gsap.set(words, { opacity: 0.12 });
  gsap.set([chip, diff], { rotation: -8, scale: 0.6 });
  gsap.set(sub, { autoAlpha: 0, y: 12 });

  const mm = gsap.matchMedia();
  mm.add(
    { desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' },
    (c) => {
      const desktop = c.conditions?.desktop;
      const tl = gsap.timeline({
        scrollTrigger: desktop
          ? { trigger: mf, start: 'top top', end: '+=110%', pin: true, scrub: 0.6 }
          : { trigger: mf, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
      });
      const chipAt = words.indexOf(qs('.mfw', chip!)!);
      const diffAt = words.indexOf(qs('.mfw', diff!)!);
      tl.to(words, { opacity: 1, ease: 'none', stagger: 0.1, duration: 0.3 }, 0)
        .to(chip, { rotation: -3, scale: 1, ease: 'back.out(3)', duration: 0.35 }, chipAt * 0.1)
        .to(diff, { rotation: 4, scale: 1, ease: 'back.out(3)', duration: 0.35 }, diffAt * 0.1)
        .to(fri, { '--u': 1, ease: 'power2.out', duration: 0.4 }, words.length * 0.1 - 0.1)
        .to(sub, { autoAlpha: 1, y: 0, duration: 0.3 }, words.length * 0.1);
    },
  );
}

/* ───────── generic reveals, split titles and counters ───────── */
function splitLines(h: HTMLElement) {
  const holder = qs('[data-lines]', h);
  if (!holder) return;
  if (!(h as HTMLElement & { _src?: string })._src) (h as HTMLElement & { _src?: string })._src = holder.innerHTML;
  holder.innerHTML = (h as HTMLElement & { _src?: string })._src!;
  // wrap each word (keep inline elements like the mini photo intact)
  const tokens: HTMLElement[] = [];
  let pendingSpace = false;
  const walk = (node: Node, cls: string) => {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const parts = (n.textContent || '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) pendingSpace = true;
          else {
            const s = document.createElement('span');
            s.className = cls;
            s.textContent = p;
            s.style.display = 'inline-block';
            s.dataset.sp = pendingSpace ? '1' : '';
            pendingSpace = false;
            frag.appendChild(s);
            frag.appendChild(document.createTextNode(' '));
            tokens.push(s);
          }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) {
        const el = n as HTMLElement;
        if (el.tagName === 'IMG') {
          el.dataset.sp = pendingSpace ? '1' : '';
          pendingSpace = false;
          tokens.push(el);
          return;
        }
        walk(el, [cls, el.className].filter(Boolean).join(' '));
        // unwrap the styled span so each word carries its class
        el.replaceWith(...Array.from(el.childNodes));
      }
    });
  };
  walk(holder, '');
  // group by line
  const lines: HTMLElement[][] = [];
  let lastTop = -1;
  tokens.forEach((t) => {
    const top = Math.round(t.offsetTop + (t.tagName === 'IMG' ? -4 : 0));
    if (lines.length === 0 || Math.abs(top - lastTop) > 8) {
      lines.push([t]);
      lastTop = top;
    } else lines[lines.length - 1].push(t);
  });
  holder.innerHTML = '';
  lines.forEach((ln) => {
    const mask = document.createElement('div');
    mask.className = 'sl-mask';
    mask.setAttribute('aria-hidden', 'true');
    Object.assign(mask.style, { position: 'relative', display: 'block', overflow: 'clip' });
    const sl = document.createElement('div');
    sl.className = 'sl';
    Object.assign(sl.style, { position: 'relative', display: 'block' });
    let prev: HTMLElement | null = null;
    ln.forEach((t, i) => {
      const space = i > 0 && t.dataset.sp === '1' ? ' ' : '';
      t.style.display = '';
      // words that share a style merge into one span so highlights stay continuous
      if (prev && t.tagName === 'SPAN' && prev.tagName === 'SPAN' && t.className && t.className === prev.className) {
        prev.textContent += space + t.textContent;
        return;
      }
      if (space) sl.appendChild(document.createTextNode(space));
      sl.appendChild(t);
      prev = t;
    });
    mask.appendChild(sl);
    holder.appendChild(mask);
  });
}

export function initReveals() {
  qsa('[data-split-lines]').forEach((h) => splitLines(h));

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
  });

  qsa('[data-split]').forEach((h) => {
    const lines = qsa('.sl', h);
    ScrollTrigger.create({
      trigger: h,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(qsa('.sl', h), { yPercent: 0, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }),
    });
    gsap.set(lines, { yPercent: 110 });
  });

  qsa('[data-count]').forEach((el) => {
    const n = Number(el.dataset.count);
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(o, {
          v: n,
          duration: reducedMotion() ? 0 : 1.6 + Math.min(1, n / 2000),
          ease: 'power3.out',
          onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('en-US')),
        }),
    });
  });
}

/* ───────── stacked project cards ───────── */
export function initStack() {
  const items = qsa('.stack__item');
  items.forEach((item) => {
    const bits = qsa('.pc__title, .pc__blurb, .pc__tags, .pc__links', item);
    ScrollTrigger.create({
      trigger: item,
      start: 'top 70%',
      once: true,
      onEnter: () => gsap.to(bits, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
    });
  });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 961px)', () => {
    items.forEach((item, i) => {
      const next = items[i + 1];
      if (!next) return;
      const pc = qs('.pc', item)!;
      const shade = qs('.pc__shade', item)!;
      gsap.timeline({
        scrollTrigger: {
          trigger: next,
          start: 'top bottom',
          end: () => `top ${80 + (i + 1) * 16}px`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
        .to(pc, { scale: 0.94 - (items.length - 2 - i) * 0.02, ease: 'none' }, 0)
        .to(shade, { opacity: 0.45, ease: 'none' }, 0);
    });
  });

  // work ⇄ play lever
  const lever = qs('.lever');
  if (lever) {
    const opts = qsa('.lever__opt', lever);
    const setPlay = (play: boolean) => {
      lever.classList.toggle('is-play', play);
      opts[0].classList.toggle('is-on', !play);
      opts[1].classList.toggle('is-on', play);
    };
    on(qs('.lever__stick', lever)!, 'click', () => {
      const play = !lever.classList.contains('is-play');
      setPlay(play);
      window.setTimeout(() => scrollToTarget(play ? '#play' : '#work'), 250);
    });
    ScrollTrigger.create({
      trigger: '#play',
      start: 'top 60%',
      end: 'max',
      onUpdate: (s) => setPlay(s.progress > 0),
      onRefresh: (s) => setPlay(s.progress > 0),
    });
  }
}

/* ───────── npm install, typed when it scrolls in ───────── */
export function initNpm() {
  const npm = qs('[data-npm]');
  if (!npm) return;
  const cmd = qs('[data-npm-cmd]', npm)!;
  const text = cmd.dataset.text || '';
  const outs = qsa('[data-npm-out] p, .npm__run', npm);
  ScrollTrigger.create({
    trigger: npm,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      text.split('').forEach((_, i) => tl.add(() => (cmd.textContent = text.slice(0, i + 1)), i * 0.055));
      tl.to(outs, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.35 }, '+=0.45');
    },
  });
}

/* ───────── floating dock ───────── */
export function initDock() {
  const dock = qs('.dock');
  if (!dock) return;
  const pill = qs('.dock__pill', dock)!;
  const btns = qsa<HTMLButtonElement>('[data-dock]', dock);
  let active: HTMLElement | null = null;

  const movePill = () => {
    btns.forEach((b) => b.classList.toggle('is-on', b === active));
    pill.classList.toggle('is-on', !!active);
    if (active) {
      pill.style.width = `${active.offsetWidth}px`;
      pill.style.transform = `translateX(${active.offsetLeft}px)`;
    }
  };
  btns.forEach((b) => {
    on(b, 'click', () => scrollToTarget(`#${b.dataset.dock}`));
    ScrollTrigger.create({
      trigger: `#${b.dataset.dock}`,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (s) => {
        if (s.isActive) active = b;
        else if (active === b) active = null;
        movePill();
      },
    });
  });

  ScrollTrigger.create({
    trigger: '.hx',
    start: 'bottom 60%',
    endTrigger: '.foot-spacer',
    end: 'top 70%',
    onToggle: (s) => dock.classList.toggle('is-on', s.isActive),
  });
}

/* ───────── in-page links use the smooth scroller ───────── */
export function initAnchors() {
  on(document, 'click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href')!;
    if (id === '#') return;
    e.preventDefault();
    scrollToTarget(id);
  });
}
