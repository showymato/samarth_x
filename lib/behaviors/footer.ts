import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qs, qsa, on, onResize, clamp, rand, pick, copyText, toast, reducedMotion, site } from './utils';
import { flashCursor } from './cursor';
import { brand as person, footer as copy } from '@/lib/content';

/* ───────── page curl: the sheet peels up to reveal the footer ───────── */
function initCurl() {
  const sheet = qs('.sheet');
  const spacer = qs('.foot-spacer');
  const shade = qs<SVGSVGElement>('[data-curl-shade]');
  const flap = qs<SVGSVGElement>('[data-curl-flap]');
  if (!sheet || !spacer || !shade || !flap) return;
  const body = qs<SVGPathElement>('[data-curl-body]', shade)!;
  const hole = qs<SVGPathElement>('[data-curl-hole]', shade)!;
  const maskRect = qs<SVGRectElement>('[data-curl-maskrect]', shade)!;
  const filter = qs<SVGFilterElement>('#curl-drop', shade)!;
  const mask = qs<SVGMaskElement>('#curl-hole', shade)!;
  const flapPath = qs<SVGPathElement>('[data-curl-flap-path]', flap)!;
  const grad = qs<SVGLinearGradientElement>('[data-curl-grad]', flap)!;

  const curlMax = () => Math.min(210, sheet.offsetWidth * 0.22);
  let W = 0;
  let H = 0;
  let last = -1;
  const f = (n: number) => n.toFixed(1);

  const draw = (s: number) => {
    if (Math.abs(s - last) < 0.3 && W === sheet.offsetWidth && H === sheet.offsetHeight) return;
    last = s;
    W = sheet.offsetWidth;
    H = sheet.offsetHeight;
    const sy = s * 0.877;
    const r = Math.min(44, W * 0.04);
    const A = [W, H - sy];
    const B = [W - s, H];
    const C3 = [W - s * 0.431, H - s * 0.377];
    const outline = (top: number) =>
      `M 0 ${f(top)} L ${f(W)} ${f(top)} L ${f(A[0])} ${f(A[1])} Q ${f(C3[0])} ${f(C3[1])} ${f(B[0])} ${f(B[1])} L ${f(r)} ${f(H)} Q 0 ${f(H)} 0 ${f(H - r)} Z`;
    sheet.style.clipPath = `path("${outline(0)}")`;

    const R = Math.max(190, s * 1.7);
    const top = H - R;
    [shade, flap].forEach((svg) => {
      svg.setAttribute('viewBox', `0 ${f(top)} ${f(W)} ${f(R)}`);
      svg.style.height = `${f(R)}px`;
    });
    const fx = -60;
    const fw = W + 120;
    const fh = R + 140;
    [filter, mask].forEach((el) => {
      el.setAttribute('x', String(fx));
      el.setAttribute('y', f(top));
      el.setAttribute('width', String(fw));
      el.setAttribute('height', f(fh));
    });
    maskRect.setAttribute('x', String(fx));
    maskRect.setAttribute('y', f(top));
    maskRect.setAttribute('width', String(fw));
    maskRect.setAttribute('height', f(fh));
    body.setAttribute('d', outline(top));
    hole.setAttribute('d', outline(top));

    const F = [W - s * 0.868, H - s * 0.991];
    const c1 = [W - s * 0.455, H - s * 0.784];
    const c2 = [W - s * 0.805, H - s * 0.479];
    flapPath.setAttribute(
      'd',
      `M ${f(A[0])} ${f(A[1])} Q ${f(c1[0])} ${f(c1[1])} ${f(F[0])} ${f(F[1])} Q ${f(c2[0])} ${f(c2[1])} ${f(B[0])} ${f(B[1])} Q ${f(C3[0])} ${f(C3[1])} ${f(A[0])} ${f(A[1])} Z`,
    );
    grad.setAttribute('x1', f(W - s * 0.5));
    grad.setAttribute('y1', f(H - s * 0.44));
    grad.setAttribute('x2', f(F[0]));
    grad.setAttribute('y2', f(F[1]));
  };

  const foot = qs('.foot');
  // progress-based (not onToggle) so a jump straight to the bottom still activates it
  const setActive = (p: number) => foot?.classList.toggle('is-active', p > 0);
  const st = ScrollTrigger.create({
    trigger: spacer,
    start: 'top bottom',
    end: 'bottom bottom',
    onUpdate: (self) => {
      draw(34 + self.progress * curlMax());
      setActive(self.progress);
    },
    onRefresh: (self) => setActive(self.progress),
  });
  draw(34);
  onResize(() => {
    last = -1;
    draw(34 + st.progress * curlMax());
  });
}

/* ───────── eyes that follow the pointer ───────── */
function initEyes() {
  const eyes = qsa('.foot__hire .eye');
  on(window, 'pointermove', (e) => {
    if (!qs('.foot')?.classList.contains('is-active')) return;
    eyes.forEach((eye) => {
      const r = eye.getBoundingClientRect();
      const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
      const d = Math.min(5, Math.hypot(e.clientX - r.left, e.clientY - r.top) / 30);
      eye.style.setProperty('--px', `${Math.cos(a) * d}px`);
      eye.style.setProperty('--py', `${Math.sin(a) * d}px`);
    });
  });
}

/* ───────── bugs to squash + a throwable rubber duck ───────── */
type Bug = { el: HTMLElement; x: number; y: number; a: number; v: number; dead: boolean };

function initBugsAndDuck() {
  const foot = qs('.foot');
  if (!foot) return;
  const say = qs('[data-duck-say]', foot)!;
  const count = qs('[data-bugs-count]', foot)!;
  let squashed = 0;
  const bugs: Bug[] = qsa('.bug', foot).map((el) => ({ el, x: 0, y: 0, a: 0, v: 0, dead: false }));

  const spawn = (b: Bug) => {
    const W = foot.clientWidth;
    const H = foot.clientHeight;
    b.x = rand(W * 0.05, W * 0.9);
    b.y = rand(H * 0.25, H * 0.8);
    b.a = rand(0, Math.PI * 2);
    b.v = rand(0.5, 1.2);
    b.dead = false;
    b.el.classList.remove('is-dead');
    gsap.fromTo(b.el, { opacity: 0 }, { opacity: 1, duration: 0.4 });
  };
  bugs.forEach(spawn);

  const kill = (b: Bug) => {
    if (b.dead) return;
    b.dead = true;
    b.el.classList.add('is-dead');
    squashed += 1;
    count.textContent = String(squashed);
    gsap.fromTo(count, { scale: 1.6 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
    gsap.to(b.el, { opacity: 0, delay: 0.8, duration: 0.5 });
    if (bugs.every((x) => x.dead)) {
      say.textContent = copy.allSquashed;
      window.setTimeout(() => {
        say.textContent = copy.respawn;
        bugs.forEach(spawn);
      }, 4200);
    }
  };
  bugs.forEach((b) => on(b.el, 'click', () => kill(b)));

  // duck
  const duck = qs('.foot__duck', foot)!;
  const bubble = qs('.foot__duck-say', duck)!;
  const d = { x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0, free: false, drag: false };
  let base: DOMRect | null = null;
  let start = { x: 0, y: 0, px: 0, py: 0, t: 0, moved: false };
  let bubbleTimer = 0;
  const speak = (t: string) => {
    bubble.textContent = t;
    bubble.classList.add('is-on');
    window.clearTimeout(bubbleTimer);
    bubbleTimer = window.setTimeout(() => bubble.classList.remove('is-on'), 2600);
  };
  on(duck, 'pointerdown', (e) => {
    base = base || duck.getBoundingClientRect();
    d.drag = true;
    d.free = false;
    duck.classList.add('is-drag');
    duck.setPointerCapture(e.pointerId);
    start = { x: d.x, y: d.y, px: e.clientX, py: e.clientY, t: performance.now(), moved: false };
  });
  on(duck, 'pointermove', (e) => {
    if (!d.drag) return;
    const nx = start.x + e.clientX - start.px;
    const ny = start.y + e.clientY - start.py;
    if (!start.moved && Math.hypot(nx - start.x, ny - start.y) > 4) start.moved = true;
    d.vx = (nx - d.x) * 0.9;
    d.vy = (ny - d.y) * 0.9;
    d.x = nx;
    d.y = ny;
    d.r += d.vx * 0.6;
  });
  const drop = () => {
    if (!d.drag) return;
    d.drag = false;
    duck.classList.remove('is-drag');
    if (!start.moved) {
      speak(pick(copy.duck));
      gsap.fromTo(duck.querySelector('svg'), { scaleY: 0.85, scaleX: 1.1 }, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1.2,.4)' });
      return;
    }
    d.free = true;
    d.vr = d.vx * 0.8;
  };
  on(duck, 'pointerup', drop);
  on(duck, 'pointercancel', drop);
  onResize(() => {
    base = null;
    d.x = 0;
    d.y = 0;
    d.free = false;
  });

  const tick = () => {
    if (!foot.classList.contains('is-active') || document.hidden) return;
    const W = foot.clientWidth;
    const H = foot.clientHeight;
    // bugs wander
    if (!reducedMotion())
      bugs.forEach((b) => {
        if (b.dead) return;
        b.a += rand(-0.18, 0.18);
        b.x += Math.cos(b.a) * b.v;
        b.y += Math.sin(b.a) * b.v;
        if (b.x < 10 || b.x > W - 44) b.a = Math.PI - b.a;
        if (b.y < H * 0.12 || b.y > H - 70) b.a = -b.a;
        b.x = clamp(b.x, 10, W - 44);
        b.y = clamp(b.y, H * 0.12, H - 70);
        b.el.style.transform = `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) rotate(${((b.a * 180) / Math.PI + 90).toFixed(1)}deg)`;
      });
    // duck physics
    if (d.free && base) {
      const fr = foot.getBoundingClientRect();
      const minX = fr.left - base.left;
      const maxX = fr.right - base.right;
      const minY = fr.top - base.top;
      const maxY = fr.bottom - base.bottom + 40;
      d.vy += 0.6;
      d.x += d.vx;
      d.y += d.vy;
      d.r += d.vr;
      if (d.x < minX) { d.x = minX; d.vx *= -0.6; d.vr *= -0.6; }
      if (d.x > maxX) { d.x = maxX; d.vx *= -0.6; d.vr *= -0.6; }
      if (d.y < minY) { d.y = minY; d.vy *= -0.5; }
      if (d.y > maxY) {
        d.y = maxY;
        d.vy *= -0.45;
        d.vx *= 0.86;
        d.vr *= 0.8;
        if (Math.abs(d.vy) < 1.2) d.vy = 0;
      }
      if (Math.abs(d.vx) < 0.05 && d.vy === 0 && d.y === maxY) d.free = false;
      // squash any bug the duck lands on
      const dr = duck.getBoundingClientRect();
      bugs.forEach((b) => {
        if (b.dead) return;
        const br = b.el.getBoundingClientRect();
        if (br.right > dr.left && br.left < dr.right && br.bottom > dr.top && br.top < dr.bottom) {
          kill(b);
          speak(copy.duckGot);
        }
      });
    }
    duck.style.transform = `translate3d(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px, 0) rotate(${(d.r % 360).toFixed(1)}deg)`;
  };
  gsap.ticker.add(tick);
  site.cleanups.push(() => gsap.ticker.remove(tick));

  // footer email copy
  const mail = qs('[data-foot-mail]', foot)!;
  const mailK = qs('[data-foot-mail-k]', foot)!;
  on(mail, 'click', async () => {
    const ok = await copyText(person.email);
    if (!ok) return;
    flashCursor('copied!');
    toast(`copied <b>${person.email}</b>`);
    mail.classList.add('is-copied');
    mailK.textContent = 'copied ✓';
    window.setTimeout(() => {
      mail.classList.remove('is-copied');
      mailK.textContent = 'click to copy';
    }, 1800);
  });
}

export function initFooter() {
  initCurl();
  initEyes();
  initBugsAndDuck();
}
