import gsap from 'gsap';
import { qs, qsa, whileVisible, rand } from './utils';

type Loop = gsap.core.Timeline;

function loopWhileVisible(el: HTMLElement, make: () => Loop) {
  const tl = make();
  tl.pause();
  whileVisible(el, () => tl.play(), () => tl.pause());
}

/* Mentor chat: a messy reply gets cleaned up while the voice-doubt pill is live */
function mentor(mock: HTMLElement) {
  const out = qs('.sl-out', mock)!;
  const mic = qs('.sr-pill__mic', mock)!;
  const bars = qsa('.sr-wave i', mock);
  loopWhileVisible(mock, () => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    tl.add(() => {
      out.classList.remove('is-clean');
      mock.classList.remove('is-done');
    })
      .add(() => mic.classList.add('is-live'), 0.5)
      .to(bars, {
        scaleY: () => rand(0.3, 1),
        duration: 0.14,
        ease: 'sine.inOut',
        stagger: { each: 0.02, from: 'random', repeat: 13, yoyo: true },
      }, 0.5)
      .to(bars, { scaleY: 0.2, duration: 0.25 }, 2.8)
      .add(() => mic.classList.remove('is-live'), 2.8)
      .add(() => out.classList.add('is-clean'), 2.9)
      .add(() => mock.classList.add('is-done'), 3.3)
      .to({}, { duration: 2.8 });
    return tl;
  });
}

/* Parent app: a "parent" cursor searches this week's report and opens it */
function parents(mock: HTMLElement) {
  const bw = qs('.bw', mock)!;
  const cursor = qs('.bw__cursor', mock)!;
  const ripple = qs('.bw__ripple', mock)!;
  const search = qs('.bw__search', mock)!;
  const q = qs('.bw__q', mock)!;
  const url = qs('.bw__url-t', mock)!;
  const res = qsa('.bw__res li', mock);
  const log = qsa('.bw-term__log li', mock);
  const center = (el: HTMLElement, fx = 0.5, fy = 0.5) => ({
    x: el.offsetLeft + el.offsetWidth * fx,
    y: el.offsetTop + el.offsetHeight * fy,
  });
  const click = () => {
    ripple.classList.remove('is-on');
    void ripple.offsetWidth;
    ripple.classList.add('is-on');
  };
  const text = 'this week';
  loopWhileVisible(mock, () => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
    tl.add(() => {
      q.textContent = '';
      url.textContent = 'parent-app/home';
      search.classList.remove('is-focus');
      res.forEach((r) => r.classList.remove('is-hit'));
      log.forEach((l) => l.classList.remove('is-on', 'is-ok'));
      gsap.set(cursor, { x: bw.offsetWidth * 0.8, y: bw.offsetHeight * 0.86 });
    })
      .add(() => log[0].classList.add('is-on'), 0.3)
      .add(() => log[0].classList.add('is-ok'), 0.8)
      .to(cursor, { x: () => center(search, 0.3).x, y: () => center(search, 0.3).y, duration: 0.9, ease: 'power3.inOut' }, 0.9)
      .add(() => {
        click();
        search.classList.add('is-focus');
        log[1].classList.add('is-on', 'is-ok');
      }, 1.85)
      .add(() => log[2].classList.add('is-on'), 2.1);
    text.split('').forEach((_, i) => tl.add(() => (q.textContent = text.slice(0, i + 1)), 2.2 + i * 0.09));
    tl.add(() => log[2].classList.add('is-ok'), 2.2 + text.length * 0.09)
      .to(cursor, { x: () => center(res[0], 0.35).x, y: () => center(res[0], 0.5).y, duration: 0.8, ease: 'power3.inOut' }, 3.1)
      .add(() => {
        click();
        res[0].classList.add('is-hit');
        search.classList.remove('is-focus');
        log[3].classList.add('is-on');
      }, 3.95)
      .add(() => {
        url.textContent = 'parent-app/reports/this-week';
        log[3].classList.add('is-ok');
      }, 4.3)
      .to({}, { duration: 2.4 });
    return tl;
  });
}

/* Mock result: analysis steps tick off, the score counts up, status flips to analysed */
function score(mock: HTMLElement) {
  const rf = qs('.rf', mock)!;
  const st = qs('[data-st]', mock)!;
  const amt = qs('[data-amt]', mock)!;
  const steps = qsa('.rf-steps li', mock);
  const o = { v: 0 };
  loopWhileVisible(mock, () => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
    tl.add(() => {
      rf.classList.remove('is-done');
      st.classList.remove('is-ok');
      st.textContent = 'grading';
      steps.forEach((s) => s.classList.remove('is-on', 'is-done'));
      o.v = 0;
      amt.textContent = '0/300';
    }).to(o, { v: 214, duration: 0.9, ease: 'power2.out', onUpdate: () => (amt.textContent = `${o.v.toFixed(0)}/300`) }, 0.2);
    steps.forEach((s, i) => {
      tl.add(() => s.classList.add('is-on'), 0.9 + i * 0.62).add(() => {
        s.classList.remove('is-on');
        s.classList.add('is-done');
      }, 0.9 + i * 0.62 + 0.42);
    });
    tl.add(() => {
      st.textContent = 'analysed';
      st.classList.add('is-ok');
      rf.classList.add('is-done');
    }, 0.9 + steps.length * 0.62)
      .to({}, { duration: 2.6 });
    return tl;
  });
}

/* Olympiad roadmap: dots move along the stages, a weak topic builds at stage 2, the plan reroutes */
function flight(mock: HTMLElement) {
  const cw = qs('.cw', mock)!;
  const p1 = qs<SVGPathElement>('#cw-p1', mock)!;
  const p2 = qs<SVGPathElement>('#cw-p2', mock)!;
  const dotsA = qsa<SVGCircleElement>('.cw__dots--a circle', mock);
  const dotsB = qsa<SVGCircleElement>('.cw__dots--b circle', mock);
  const zone = qs('[data-zone]', mock)!;
  const alert = qs('.cw__alert', mock)!;
  const msg = qs('.cw__msg', mock)!;
  const clock = qs('.cw__t', mock)!;
  const L1 = p1.getTotalLength();
  const L2 = p2.getTotalLength();
  const prog = { a: 0, b: 0 };
  const place = () => {
    dotsA.forEach((d, i) => {
      const t = ((prog.a + i / dotsA.length) % 1) * L1;
      const pt = p1.getPointAtLength(t);
      d.setAttribute('transform', `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`);
    });
    dotsB.forEach((d, i) => {
      const t = ((prog.b + i / dotsB.length) % 1) * L2;
      const pt = p2.getPointAtLength(t);
      d.setAttribute('transform', `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`);
    });
  };
  place();
  let minutes = 0;
  const set = (state: string, text: string) => {
    alert.dataset.state = state;
    msg.textContent = text;
  };
  loopWhileVisible(mock, () => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(prog, { a: '+=1.6', b: '+=1.6', duration: 11, ease: 'none', onUpdate: place }, 0)
      .add(() => {
        cw.classList.remove('is-alt');
        zone.classList.remove('is-warn', 'is-bad');
        set('ok', '✓ on track · stage 1 → 2 → 3 · weakest topic C');
        minutes += 1;
        clock.textContent = `10:${String(minutes % 60).padStart(2, '0')}`;
      }, 0)
      .add(() => {
        zone.classList.add('is-warn');
        set('warn', '⚠ combinatorics gap building before stage 2 · grade D');
      }, 3)
      .add(() => {
        zone.classList.replace('is-warn', 'is-bad');
        set('bad', '✕ stage 2 drops to grade E · re-planning');
      }, 5.4)
      .add(() => {
        cw.classList.add('is-alt');
        set('fix', '↺ re-planned via 2b: proof drills · weakest B');
      }, 6.8);
    return tl;
  });
}

/* NEET drill chat: bubbles pop in, typing dots, a reaction */
function chat(mock: HTMLElement) {
  const bubbles = qsa('.tc__b', mock);
  const typing = qs('.tc__typing', mock)!;
  const react = qs('.tc__react', mock)!;
  const status = qs('.tc__side li.is-on em', mock)!;
  loopWhileVisible(mock, () => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.add(() => {
      bubbles.slice(1).forEach((b) => b.classList.add('is-off'));
      react.classList.add('is-off');
      typing.classList.add('is-off');
      status.textContent = 'thinking…';
    })
      .add(() => bubbles[1].classList.remove('is-off'), 1.0)
      .add(() => typing.classList.remove('is-off'), 1.6)
      .add(() => {
        typing.classList.add('is-off');
        bubbles[2].classList.remove('is-off');
        status.textContent = 'close, not quite 😬';
      }, 2.8)
      .add(() => react.classList.remove('is-off'), 3.4)
      .add(() => typing.classList.remove('is-off'), 4.2)
      .to({}, { duration: 2.6 });
    return tl;
  });
}

/* DPP notes: the mentor's hint gets accepted with Tab */
function editor(mock: HTMLElement) {
  const ghost = qs('.ghost', mock)!;
  const ai = qs('.ed__ai', mock)!;
  const curB = qs('.cur--b', mock)!;
  loopWhileVisible(mock, () => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.add(() => {
      ghost.classList.remove('is-in');
      ai.classList.remove('is-off');
    })
      .to(curB, { opacity: 0.2, duration: 0.4, repeat: 3, yoyo: true }, 0.3)
      .add(() => {
        ghost.classList.add('is-in');
        ai.classList.add('is-off');
      }, 2.1)
      .to({}, { duration: 2.6 });
    return tl;
  });
}

const RUNNERS: Record<string, (el: HTMLElement) => void> = { mentor, parents, score, flight, chat, editor };

export function initMocks() {
  qsa('[data-mock]').forEach((m) => RUNNERS[m.dataset.mock!]?.(m));
}
