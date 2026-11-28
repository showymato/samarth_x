'use client';
// SamarthX One: three billing cycles as interactive membership passes.
// Every amount is derived from the prices in lib/content.ts (P via plans.cycles). Stages shown in
// the previews are illustrative preparation stages, not schedules or promised outcomes.
import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { plans } from '@/lib/content';
import { useInViewOnce, useReducedMotion, useTween, inrFmt } from '@/lib/hooks';
import { Segmented, CtaArrow } from './StartCards';

type View = (typeof plans.views)[number]['id'];
type Cycle = (typeof plans.cycles)[number];

const monthly = plans.cycles.find((c) => c.months === 1)!.price;
const money = (c: Cycle) => {
  const list = monthly * c.months; // the same months paid monthly
  return { list, eff: c.price / c.months, saved: list - c.price, perDay: c.price / (c.months === 1 ? 30 : c.months === 12 ? 365 : 90) };
};
const billedLine = (c: Cycle) =>
  c.months === 1 ? `you pay ${inrFmt(c.price)} every month` : `you pay ${inrFmt(c.price)} every ${c.months === 12 ? 'year' : `${c.months} months`}`;

/* ───────── price block: the payable amount is always on screen ───────── */
function Price({ c, view }: { c: Cycle; view: View }) {
  const m = money(c);
  const reduce = useReducedMotion();
  const big = view === 'total' ? c.price : view === 'monthly' ? m.eff : m.saved;
  const v = useTween(big, reduce ? 0 : 420);
  const unit = view === 'total' ? c.per : view === 'monthly' ? (c.months === 1 ? '/mo' : '/mo effective') : ' saved';
  const note =
    view === 'total'
      ? c.months === 1
        ? `≈ ${inrFmt(m.perDay)} a day, over a 30-day month`
        : `≈ ${inrFmt(m.eff)}/mo effective`
      : view === 'monthly'
        ? c.months === 1
          ? 'billed monthly'
          : `not billed monthly: one payment of ${inrFmt(c.price)}`
        : c.months === 1
          ? 'the base price. pay as you go.'
          : `vs ${c.months} monthly payments of ${inrFmt(monthly)} (${inrFmt(m.list)})`;
  return (
    <div className="pp">
      <p className="pp__big">
        <span className="pp__n">{inrFmt(v)}</span>
        <span className="pp__u">{unit}</span>
      </p>
      <p className="pp__pay">{billedLine(c)}</p>
      <p key={view} className="pp__note">{note}</p>
    </div>
  );
}

/* ───────── shared: a proportional savings comparison ───────── */
function Savings({ c, seen }: { c: Cycle; seen: boolean }) {
  const m = money(c);
  const ratio = c.price / m.list;
  return (
    <div className="sv" aria-label={`${c.months} monthly payments ${inrFmt(m.list)}; ${c.cycle.toLowerCase()} billing ${inrFmt(c.price)}; difference ${inrFmt(m.saved)}`}>
      <div className="sv__row">
        <span>{c.months} × monthly</span>
        <span className="sv__track"><i style={{ ['--w' as string]: seen ? 1 : 0 } as CSSProperties} /></span>
        <b>{inrFmt(m.list)}</b>
      </div>
      <div className="sv__row is-plan">
        <span>{c.cycle.toLowerCase()}</span>
        <span className="sv__track">
          <i style={{ ['--w' as string]: seen ? ratio : 0 } as CSSProperties} />
          <em style={{ ['--l' as string]: ratio } as CSSProperties} />
        </span>
        <b>{inrFmt(c.price)}</b>
      </div>
      <p className="sv__diff">
        difference <b>{inrFmt(m.saved)}</b> · ≈ {inrFmt(m.eff)}/mo effective
      </p>
    </div>
  );
}

/* ───────── 01 · monthly: a 30-day calendar ───────── */
const LEAD = 2; // the illustrative month starts on a Wednesday
function MonthCal() {
  const [day, setDay] = useState(12);
  const wk = plans.monthlyWeeks.find((w) => day >= w.from && day <= w.to)!;
  const idx = day - 1 + LEAD;
  const pick = (n: number) => setDay(Math.min(30, Math.max(1, n)));
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
    if (e.key in map) { e.preventDefault(); pick(day + map[e.key]); focusDay(e, day + map[e.key]); }
    if (e.key === 'Home') { e.preventDefault(); pick(1); focusDay(e, 1); }
    if (e.key === 'End') { e.preventDefault(); pick(30); focusDay(e, 30); }
  };
  return (
    <div className="mc">
      <div className="mc__head">
        <span>month 01 · 30 days</span>
        <span>week {plans.monthlyWeeks.indexOf(wk) + 1} of 5</span>
      </div>
      <div className="mc__grid" role="grid" aria-label="Illustrative 30-day month" onKeyDown={onKey}
        style={{ ['--c' as string]: idx % 7, ['--r' as string]: Math.floor(idx / 7) } as CSSProperties}>
        <span className="mc__sel" aria-hidden="true" />
        {Array.from({ length: LEAD }, (_, i) => <span key={`b${i}`} className="mc__pad" aria-hidden="true" />)}
        {Array.from({ length: 30 }, (_, i) => {
          const n = i + 1;
          const inWk = n >= wk.from && n <= wk.to;
          return (
            <button
              key={n}
              type="button"
              role="gridcell"
              aria-selected={n === day}
              tabIndex={n === day ? 0 : -1}
              data-day={n}
              className={`mc__d${n === day ? ' is-on' : ''}${inWk ? ' is-wk' : ''}`}
              style={{ ['--j' as string]: i } as CSSProperties}
              onClick={() => pick(n)}
              data-cursor="pick"
              aria-label={`Day ${n}`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mc__plan" aria-live="polite">
        <p className="mc__when">day {String(day).padStart(2, '0')} · {wk.from}–{wk.to}</p>
        <p key={wk.k} className="mc__k">{wk.k}</p>
        <p key={`${wk.k}-d`} className="mc__txt">{wk.d}</p>
      </div>
    </div>
  );
}
function focusDay(e: KeyboardEvent, n: number) {
  const grid = e.currentTarget as HTMLElement;
  requestAnimationFrame(() => grid.querySelector<HTMLButtonElement>(`[data-day="${Math.min(30, Math.max(1, n))}"]`)?.focus());
}

/* ───────── 02 · quarterly: a 90-day roadmap ───────── */
function QuarterRoad({ c, seen }: { c: Cycle; seen: boolean }) {
  const [m, setM] = useState(1); // 1..3
  const st = plans.quarterMonths[m - 1];
  return (
    <div className="qr">
      <div className="qr__road">
        <input
          className="qr__rng"
          type="range"
          min={1}
          max={3}
          step={1}
          value={m}
          onChange={(e) => setM(+e.target.value)}
          aria-label="Illustrative month of the term"
          aria-valuetext={`month ${m}: ${st.k}`}
          data-cursor="drag"
        />
        <span className="qr__line" aria-hidden="true"><i style={{ ['--p' as string]: (m - 1) / 2 } as CSSProperties} /></span>
        {plans.quarterMonths.map((q, i) => (
          <span
            key={q.k}
            aria-hidden="true"
            className={i + 1 <= m ? 'qr__ms is-on' : 'qr__ms'}
            style={{ ['--x' as string]: i / 2 } as CSSProperties}
          >
            <i />
            <span>m{String(i + 1).padStart(2, '0')}</span>
          </span>
        ))}
      </div>
      <div className="qr__panel" aria-live="polite">
        <p key={st.k} className="mc__k">{st.k}</p>
        <ul key={`l${m}`} className="qr__items">
          {st.items.map((t, i) => (
            <li key={t} style={{ animationDelay: `${i * 60}ms` }}>{t}</li>
          ))}
        </ul>
      </div>
      <Savings c={c} seen={seen} />
    </div>
  );
}

/* ───────── 03 · annual: a 12-month ring in four phases ───────── */
const R = 46, CX = 60, CY = 60;
const arc = (a0: number, a1: number) => {
  const p = (a: number) => [CX + R * Math.sin(a), CY - R * Math.cos(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};
const SEG = (Math.PI * 2) / 12, GAP = 0.05;
function YearRing({ c, seen }: { c: Cycle; seen: boolean }) {
  const [ph, setPh] = useState(0); // 0..3
  const phase = plans.yearPhases[ph];
  const angle = (ph * 3 + 1.5) * 30; // middle of the phase, degrees
  return (
    <div className="yr">
      <div className="yr__top">
        <div className="yr__ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                className={`yr__seg${Math.floor(i / 3) === ph ? ' is-on' : ''}${Math.floor(i / 3) < ph ? ' is-past' : ''}`}
                d={arc(i * SEG + GAP, (i + 1) * SEG - GAP)}
                onClick={() => setPh(Math.floor(i / 3))}
                style={{ ['--j' as string]: i } as CSSProperties}
              />
            ))}
            <path className="yr__trail" d={arc(GAP, Math.max(GAP + 0.01, (ph * 3 + 1.5) * SEG))} pathLength={100} />
            <g className="yr__dot" style={{ transform: `rotate(${angle}deg)` }}>
              <circle cx={CX} cy={CY - R} r="4.2" />
            </g>
          </svg>
          <div className="yr__mid">
            <span>phase 0{ph + 1}</span>
            <b key={phase.k}>{phase.k}</b>
            <em>m{String(ph * 3 + 1).padStart(2, '0')}–{String(ph * 3 + 3).padStart(2, '0')}</em>
          </div>
        </div>
        <div className="yr__side">
          <div className="yr__phases" role="radiogroup" aria-label="Illustrative preparation phases"
            onKeyDown={(e) => {
              const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
              if (!d) return;
              e.preventDefault();
              const n = (ph + d + 4) % 4;
              setPh(n);
              const g = e.currentTarget;
              requestAnimationFrame(() => g.querySelectorAll<HTMLButtonElement>('button')[n]?.focus());
            }}>
            {plans.yearPhases.map((p, i) => (
              <button key={p.k} type="button" role="radio" aria-checked={i === ph} tabIndex={i === ph ? 0 : -1}
                className={i === ph ? 'yr__ph is-on' : 'yr__ph'} onClick={() => setPh(i)} data-cursor="select">
                <i>0{i + 1}</i>
                {p.k}
              </button>
            ))}
          </div>
          <p key={phase.k} className="yr__d" aria-live="polite">{phase.d}</p>
        </div>
      </div>
      <Savings c={c} seen={seen} />
    </div>
  );
}

/* ───────── a pass ───────── */
function Pass({ c, i, view, children }: { c: Cycle; i: number; view: View; children: ReactNode }) {
  return (
    <article className="xp xc" id={`plan-${c.id}`} style={{ ['--accent' as string]: c.accent, ['--i' as string]: i } as CSSProperties}>
      <div className="xp__head">
        <p className="xc__no">
          <span>{c.eyebrow}</span>
        </p>
        <span className="xp__cycle">{c.cycle}</span>
      </div>
      <Price c={c} view={view} />
      <div className="xc__canvas xp__canvas">
        {children}
        <span className="xc__sample">illustrative journey · not a schedule</span>
      </div>
      <div className="xc__info">
        <h3 className="xc__title">{c.headline}</h3>
        <p className="xc__blurb">{c.desc}</p>
        <div className="xc__ctas">
          <a className="xc__cta" href={c.href} target="_blank" rel="noopener" data-cursor="enroll">
            {c.cta} <CtaArrow />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function PlanCards() {
  const [view, setView] = useState<View>('total');
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  const [mo, qu, an] = plans.cycles;
  return (
    <div ref={ref} className={seen ? 'xplans is-in' : 'xplans'}>
      <div className="xplans__bar">
        <Segmented label="Show prices as" value={view} options={plans.views.map((v) => ({ id: v.id, label: v.label }))} onChange={setView} />
        <p className="xplans__same">
          <i aria-hidden="true">✓</i> {plans.sameValue}
        </p>
      </div>
      <div className="xgrid xgrid--plans">
        <Pass c={mo} i={0} view={view}><MonthCal /></Pass>
        <Pass c={qu} i={1} view={view}><QuarterRoad c={qu} seen={seen} /></Pass>
        <Pass c={an} i={2} view={view}><YearRing c={an} seen={seen} /></Pass>
      </div>
    </div>
  );
}
