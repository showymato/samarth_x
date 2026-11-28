import gsap from 'gsap';
import { qs, qsa, on, site, whileVisible } from './utils';

/* ───────── shared: score + best (saved in localStorage when it's available) ───────── */
function scoreboard(card: HTMLElement, key: string, lowerIsBetter = false) {
  const scoreEl = qs('[data-score]', card)!;
  const bestEl = qs('[data-best]', card)!;
  const storeKey = `arcade-${key}`;
  let best = 0;
  try {
    best = Number(localStorage.getItem(storeKey) || 0);
  } catch {
    best = 0;
  }
  bestEl.textContent = best ? String(best) : '–';
  return {
    set(n: number | string) {
      scoreEl.textContent = String(n);
    },
    finish(n: number) {
      const better = n > 0 && (!best || (lowerIsBetter ? n < best : n > best));
      if (better) {
        best = n;
        bestEl.textContent = String(n);
        try {
          localStorage.setItem(storeKey, String(n));
        } catch {
          /* private mode: keep it in memory */
        }
        gsap.fromTo(bestEl, { scale: 1.6, color: '#12a150' }, { scale: 1, color: 'inherit', duration: 0.8, ease: 'back.out(3)' });
      }
      return better;
    },
  };
}

const hint = (card: HTMLElement, text: string) => {
  const el = qs('[data-hint]', card)!;
  el.textContent = text;
  gsap.fromTo(el, { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' });
};

/* ───────── 1. whack-a-bug ───────── */
function whackABug(card: HTMLElement) {
  const holes = qsa<HTMLButtonElement>('.wb__hole', card);
  const timeEl = qs('[data-time]', card)!;
  const btn = qs<HTMLButtonElement>('[data-start]', card)!;
  const sb = scoreboard(card, 'bugs');
  let score = 0;
  let running = false;
  let end = 0;
  let spawnT = 0;
  let raf = 0;
  const up = new Set<number>();

  const hide = (i: number) => {
    up.delete(i);
    holes[i].classList.remove('is-up', 'is-hit');
  };
  const spawn = () => {
    if (!running) return;
    const free = holes.map((_, i) => i).filter((i) => !up.has(i));
    if (free.length) {
      const i = free[Math.floor(Math.random() * free.length)];
      up.add(i);
      holes[i].classList.add('is-up');
      const life = Math.max(420, 950 - score * 22);
      window.setTimeout(() => up.has(i) && !holes[i].classList.contains('is-hit') && hide(i), life);
    }
    spawnT = window.setTimeout(spawn, Math.max(260, 700 - score * 14));
  };
  const tick = () => {
    const left = Math.max(0, end - performance.now());
    timeEl.textContent = `${(left / 1000).toFixed(1)}s`;
    if (left <= 0) return stop();
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    window.clearTimeout(spawnT);
    cancelAnimationFrame(raf);
    holes.forEach((_, i) => hide(i));
    card.classList.remove('is-live');
    btn.textContent = 'again';
    const better = sb.finish(score);
    hint(card, score === 0 ? 'zero squashed. the reels won this round.' : `${score} distractions squashed.${better ? ' new best!' : ''} back to the desk.`);
  };
  on(btn, 'click', () => {
    if (running) return;
    score = 0;
    sb.set(0);
    running = true;
    card.classList.add('is-live');
    btn.textContent = 'go!';
    end = performance.now() + 20000;
    hint(card, 'go go go. they’re fast. like reels.');
    spawn();
    tick();
  });
  holes.forEach((h, i) =>
    on(h, 'click', () => {
      if (!running || !up.has(i) || h.classList.contains('is-hit')) return;
      h.classList.add('is-hit');
      score += 1;
      sb.set(score);
      window.setTimeout(() => hide(i), 260);
    }),
  );
  whileVisible(card, () => {}, () => running && stop());
}

/* ───────── 2. memory match ───────── */
const PROPS = ['⚛️', '🧪', '🧬', '📐', '🔭', '🧲'];

function memory(card: HTMLElement) {
  const board = qs('[data-mm]', card)!;
  const btn = qs<HTMLButtonElement>('[data-start]', card)!;
  const sb = scoreboard(card, 'memory', true);
  let open: HTMLElement[] = [];
  let moves = 0;
  let found = 0;
  let lock = false;

  const deal = () => {
    const deck = [...PROPS, ...PROPS].sort(() => Math.random() - 0.5);
    board.innerHTML = deck
      .map(
        (e) =>
          `<button class="mm__card" type="button" data-v="${e}" data-cursor="flip" aria-label="card"><span class="mm__in"><span class="mm__back">✦</span><span class="mm__face">${e}</span></span></button>`,
      )
      .join('');
    open = [];
    moves = 0;
    found = 0;
    lock = false;
    sb.set(0);
    gsap.fromTo(qsa('.mm__card', board), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.03 });
  };
  deal();
  on(board, 'click', (e) => {
    const c = (e.target as HTMLElement).closest<HTMLElement>('.mm__card');
    if (!c || lock || c.classList.contains('is-open') || c.classList.contains('is-done')) return;
    c.classList.add('is-open');
    open.push(c);
    if (open.length < 2) return;
    moves += 1;
    sb.set(moves);
    const [a, b] = open;
    if (a.dataset.v === b.dataset.v) {
      a.classList.add('is-done');
      b.classList.add('is-done');
      open = [];
      found += 1;
      if (found === PROPS.length) {
        const better = sb.finish(moves);
        hint(card, `lab cleared! ${moves} moves.${better ? ' new best!' : ''}`);
        btn.textContent = 'again';
      }
    } else {
      lock = true;
      window.setTimeout(() => {
        a.classList.remove('is-open');
        b.classList.remove('is-open');
        open = [];
        lock = false;
      }, 750);
    }
  });
  on(btn, 'click', () => {
    deal();
    btn.textContent = 'shuffle';
    hint(card, 'find all six pairs in as few moves as you can.');
  });
}

/* ───────── 3. number guess (the python project, in the browser) ───────── */
function numberGuess(card: HTMLElement) {
  const out = qs('[data-ng-out]', card)!;
  const form = qs<HTMLFormElement>('[data-ng-form]', card)!;
  const input = qs<HTMLInputElement>('input', form)!;
  const btn = qs<HTMLButtonElement>('[data-start]', card)!;
  const sb = scoreboard(card, 'guess', true);
  let target = 0;
  let tries = 0;
  let live = false;

  const print = (html: string, cls = '') => {
    const p = document.createElement('p');
    if (cls) p.className = cls;
    p.innerHTML = html;
    out.appendChild(p);
    out.scrollTop = out.scrollHeight;
  };
  const start = () => {
    out.innerHTML = '';
    target = 1 + Math.floor(Math.random() * 100);
    tries = 0;
    live = true;
    sb.set(0);
    input.disabled = false;
    input.value = '';
    print('<span class="dim">$ python3 integer_q.py</span>');
    print('integer-type question: the answer is between <b>1</b> and <b>100</b>.');
    print('you have <b>7</b> tries. no negative marking.');
    input.focus({ preventScroll: true });
    btn.textContent = 'restart';
  };
  on(btn, 'click', start);
  on(form, 'submit', (e) => {
    e.preventDefault();
    if (!live) return start();
    const n = Number(input.value.trim());
    input.value = '';
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      print('<span class="err">ValueError:</span> please enter a whole number from 1 to 100.');
      return;
    }
    tries += 1;
    sb.set(tries);
    print(`<span class="dim">&gt;&gt;&gt;</span> ${n}`);
    if (n === target) {
      live = false;
      input.disabled = true;
      const better = sb.finish(tries);
      print(`<span class="ok">correct!</span> it was <b>${target}</b>. ${tries} ${tries === 1 ? 'try' : 'tries'}.${better ? ' new best!' : ''}`);
      hint(card, tries <= 3 ? 'suspiciously good. save some for the real paper.' : 'nice. binary search would be proud.');
      btn.textContent = 'again';
      return;
    }
    const left = 7 - tries;
    if (left <= 0) {
      live = false;
      input.disabled = true;
      print(`<span class="err">out of tries.</span> it was <b>${target}</b>. into the error log it goes.`);
      btn.textContent = 'again';
      return;
    }
    const far = Math.abs(n - target) > 25 ? ' (not even close)' : Math.abs(n - target) <= 5 ? ' (so close!)' : '';
    print(`${n > target ? 'too high' : 'too low'}${far}. <span class="dim">${left} ${left === 1 ? 'try' : 'tries'} left</span>`);
  });
}

/* ───────── 4. focus lane: dodge the distractions (canvas) ───────── */
function dodge(card: HTMLElement) {
  const cv = qs<HTMLCanvasElement>('[data-rd]', card)!;
  const btn = qs<HTMLButtonElement>('[data-start]', card)!;
  const ctx = cv.getContext('2d')!;
  const sb = scoreboard(card, 'dodge');
  const W = cv.width;
  const H = cv.height;
  const lanes = 4;
  const laneW = (W - 60) / lanes;
  const laneX = (l: number) => 30 + laneW * l + laneW / 2;
  type Cone = { x: number; y: number };
  let car = { x: laneX(1), tx: laneX(1), lane: 1 };
  let cones: Cone[] = [];
  let speed = 3;
  let dist = 0;
  let road = 0;
  let spawnIn = 0;
  let running = false;
  let crashed = false;
  let raf = 0;
  let last = 0;
  let visible = true;

  const move = (d: number) => {
    if (!running) return;
    car.lane = Math.max(0, Math.min(lanes - 1, car.lane + d));
    car.tx = laneX(car.lane);
  };

  const drawCar = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#131313';
    ctx.beginPath();
    ctx.roundRect(-22, -34, 44, 68, 12);
    ctx.fill();
    ctx.fillStyle = '#ff6b1a';
    ctx.beginPath();
    ctx.roundRect(-18, -30, 36, 60, 10);
    ctx.fill();
    ctx.fillStyle = '#8fb4ff';
    ctx.beginPath();
    ctx.roundRect(-13, -14, 26, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#131313';
    [-26, 26].forEach((wx) => [-20, 20].forEach((wy) => ctx.fillRect(wx - 4, wy - 9, 8, 18)));
    ctx.strokeStyle = '#131313';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(10, -30);
    ctx.lineTo(14, -46);
    ctx.stroke();
    ctx.fillStyle = '#d7f75b';
    ctx.beginPath();
    ctx.arc(14, -48, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  const drawCone = (c: Cone) => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.fillStyle = '#ff6b1a';
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(16, 18);
    ctx.lineTo(-16, 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(-9, -2, 18, 6);
    ctx.fillStyle = '#131313';
    ctx.fillRect(-20, 16, 40, 6);
    ctx.restore();
  };
  const draw = () => {
    ctx.fillStyle = '#2b2b2f';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1f1f22';
    ctx.fillRect(0, 0, 22, H);
    ctx.fillRect(W - 22, 0, 22, H);
    ctx.fillStyle = '#ffe45c';
    for (let y = -40 + (road % 40); y < H; y += 40) {
      ctx.fillRect(14, y, 8, 20);
      ctx.fillRect(W - 22, y, 8, 20);
    }
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    for (let l = 1; l < lanes; l++) {
      const x = 30 + laneW * l;
      for (let y = -60 + (road % 60); y < H; y += 60) ctx.fillRect(x - 2, y, 4, 30);
    }
    cones.forEach(drawCone);
    drawCar(car.x, H - 70);
    ctx.fillStyle = '#fff';
    ctx.font = '600 16px "Geist Mono", monospace';
    ctx.fillText(`${Math.floor(dist)} m`, 34, 30);
    if (!running) {
      ctx.fillStyle = 'rgba(19,19,19,.62)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = '600 28px "Geist", sans-serif';
      ctx.fillText(crashed ? 'crashed. that was a reel.' : 'press play to focus', W / 2, H / 2 - 6);
      ctx.font = '400 15px "Geist Mono", monospace';
      ctx.fillStyle = '#d7f75b';
      ctx.fillText(crashed ? `${Math.floor(dist)} m · press again` : '← → / A D / tap the sides', W / 2, H / 2 + 24);
      ctx.textAlign = 'left';
    }
  };
  const step = (t: number) => {
    const dt = Math.min(3, (t - last) / 16.67 || 1);
    last = t;
    if (running && visible) {
      speed = Math.min(12, speed + 0.0028 * dt);
      dist += speed * dt * 0.1;
      road += speed * dt;
      car.x += (car.tx - car.x) * Math.min(1, 0.28 * dt);
      spawnIn -= dt;
      if (spawnIn <= 0) {
        const lane = Math.floor(Math.random() * lanes);
        cones.push({ x: laneX(lane), y: -30 });
        if (Math.random() < Math.min(0.45, speed / 25)) {
          const l2 = (lane + 1 + Math.floor(Math.random() * (lanes - 1))) % lanes;
          cones.push({ x: laneX(l2), y: -30 - Math.random() * 40 });
        }
        spawnIn = Math.max(16, 55 - speed * 3.2);
      }
      cones.forEach((c) => (c.y += speed * dt));
      cones = cones.filter((c) => c.y < H + 40);
      const cy = H - 70;
      if (cones.some((c) => Math.abs(c.x - car.x) < 34 && Math.abs(c.y - cy) < 46)) {
        running = false;
        crashed = true;
        card.classList.remove('is-live');
        const score = Math.floor(dist);
        sb.set(score);
        const better = sb.finish(score);
        hint(card, `${score} m of focus before the crash.${better ? ' new best!' : ''}`);
        btn.textContent = 'again';
        gsap.fromTo(cv, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2,.3)' });
      } else sb.set(Math.floor(dist));
    }
    draw();
    raf = requestAnimationFrame(step);
  };
  const start = () => {
    car = { x: laneX(1), tx: laneX(1), lane: 1 };
    cones = [];
    speed = 3;
    dist = 0;
    spawnIn = 20;
    running = true;
    crashed = false;
    card.classList.add('is-live');
    btn.textContent = 'focusing…';
    hint(card, 'dodge the cones. they’re distractions. it only gets faster.');
    cv.focus({ preventScroll: true });
  };
  on(btn, 'click', start);
  cv.tabIndex = 0;
  on(window, 'keydown', (e) => {
    if (!running) return;
    const k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') {
      move(-1);
      e.preventDefault();
    } else if (k === 'arrowright' || k === 'd') {
      move(1);
      e.preventDefault();
    }
  });
  on(cv, 'pointerdown', (e) => {
    if (!running) return start();
    const r = cv.getBoundingClientRect();
    move(e.clientX - r.left < r.width / 2 ? -1 : 1);
  });
  whileVisible(
    card,
    () => {
      visible = true;
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    },
    () => {
      visible = false;
      cancelAnimationFrame(raf);
      raf = 0;
      if (running) {
        running = false;
        crashed = false;
        card.classList.remove('is-live');
        btn.textContent = 'play';
        draw();
      }
    },
  );
  draw();
  site.cleanups.push(() => cancelAnimationFrame(raf));
}

export function initArcade() {
  const arc = qs('#arcade');
  if (!arc) return;
  const map: Record<string, (c: HTMLElement) => void> = { bugs: whackABug, memory, guess: numberGuess, dodge };
  qsa('.game', arc).forEach((c) => map[c.dataset.game!]?.(c));
}
