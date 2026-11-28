'use client';
// #start: three interactive product previews (diagnostic · scholarship · predictor).
// Every value shown is sample data or comes from confirmed content; nothing is collected or sent.
import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { start, funnel, predictor as predictorCfg } from '@/lib/content';
import { useInViewOnce, useReducedMotion, useSequence, useTween } from '@/lib/hooks';
import { estimate, EXAMS, type Exam } from '@/lib/predictor';

const ext = (href: string) => (href.startsWith('#') || href.startsWith('tel:') ? {} : { target: '_blank', rel: 'noopener' });

export const CtaArrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Card({
  id, accent, no, eyebrow, title, blurb, meta, children, ctas, i,
}: {
  id: string; accent: string; no: string; eyebrow: string; title: string; blurb: string; meta: string[];
  children: ReactNode; ctas: ReactNode; i: number;
}) {
  return (
    <article className="xc" id={id} style={{ ['--accent' as string]: accent, ['--i' as string]: i } as CSSProperties}>
      <div className="xc__canvas">
        {children}
      </div>
      <div className="xc__info">
        <p className="xc__no">
          <span>{no}</span>
          <span className="xc__eyebrow">{eyebrow}</span>
        </p>
        <h3 className="xc__title">{title}</h3>
        <p className="xc__blurb">{blurb}</p>
        <ul className="xc__meta">
          {meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <div className="xc__ctas">{ctas}</div>
      </div>
    </article>
  );
}

/** a segmented control whose indicator slides between options */
export function Segmented<T extends string>({
  label, value, options, onChange, cursor = 'switch',
}: {
  label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; cursor?: string;
}) {
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  const move = (d: number) => onChange(options[(idx + d + options.length) % options.length].id);
  return (
    <div
      className="seg"
      role="radiogroup"
      aria-label={label}
      style={{ ['--n' as string]: options.length, ['--k' as string]: idx } as CSSProperties}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      }}
    >
      <span className="seg__ind" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={o.id === value}
          tabIndex={o.id === value ? 0 : -1}
          className={o.id === value ? 'seg__opt is-on' : 'seg__opt'}
          onClick={() => onChange(o.id)}
          data-cursor={cursor}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const Sample = ({ children }: { children?: ReactNode }) => <span className="xc__sample">{children ?? start.sampleNote}</span>;

/* ───────────────────────── 01 · diagnostic ───────────────────────── */
type Phase = 'ready' | 'analysing' | 'insights';
const ANALYSE_MS = 1300;

function Diagnostic() {
  const d = start.diagnostic;
  const [exam, setExam] = useState<'jee' | 'neet'>('jee');
  const [phase, setPhase] = useState<Phase>('ready');
  const [active, setActive] = useState(1);
  const [run, setRun] = useState(0); // remounts the reveal pieces on every replay
  const seq = useSequence();
  const reduce = useReducedMotion();
  const subjects = d.exams[exam].subjects;
  const shown = phase !== 'ready';
  const ring = useTween(phase === 'ready' ? 0 : 90, reduce ? 0 : ANALYSE_MS);

  const preview = () => {
    seq.clear();
    setRun((r) => r + 1);
    setPhase('analysing');
    seq.at(reduce ? 0 : ANALYSE_MS, () => setPhase('insights'));
  };
  const s = subjects[active];

  return (
    <div className={`dg dg--${phase}`}>
      <div className="dg__bar">
        <Segmented
          label="Sample exam"
          value={exam}
          options={(['jee', 'neet'] as const).map((k) => ({ id: k, label: d.exams[k].label }))}
          onChange={(v) => setExam(v)}
        />
        <div className="dg__prog" aria-hidden="true">
          <svg viewBox="0 0 36 36">
            <circle className="dg__ring-bg" cx="18" cy="18" r="15" />
            <circle className="dg__ring" cx="18" cy="18" r="15" pathLength={90} style={{ strokeDashoffset: 90 - ring }} />
          </svg>
          <span>
            <b>{Math.round(ring)}</b>/90
          </span>
        </div>
      </div>

      <div className="dg__rows" role="tablist" aria-label="Sample subjects" style={{ ['--k' as string]: active } as CSSProperties}>
        <span className="dg__hl" aria-hidden="true" />
        {subjects.map((x, i) => (
          <SubjectRow key={x.k} i={i} name={x.k} value={x.v} shown={shown} on={i === active} onSelect={() => setActive(i)} />
        ))}
        {phase === 'analysing' && <span key={run} className="dg__scan" aria-hidden="true" />}
      </div>

      <div className="dg__insight" aria-live="polite">
        {phase === 'insights' ? (
          <div key={`${run}-${exam}-${active}`} className="dg__ins">
            <p className="dg__ins-h">
              <i aria-hidden="true">✦</i> mentor note · {s.k.toLowerCase()}
            </p>
            <p className="dg__ins-t">
              <Words text={s.insight} />
            </p>
            <p className="dg__ins-n">
              <Words text={s.next} delay={0.25} />
            </p>
          </div>
        ) : (
          <p className="dg__ins-wait">{phase === 'analysing' ? `${d.analysing}…` : 'pick a subject, then run the preview.'}</p>
        )}
      </div>

      <div className="dg__foot">
        <Sample />
        <button type="button" className="xbtn" onClick={preview} data-cursor="preview">
          {phase === 'insights' ? (
            <>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8a5 5 0 1 0 1.6-3.7M3 3v3h3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {d.replay}
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.5v9l7-4.5z" fill="currentColor" /></svg>
              {d.preview}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SubjectRow({ i, name, value, shown, on, onSelect }: { i: number; name: string; value: number; shown: boolean; on: boolean; onSelect: () => void }) {
  const reduce = useReducedMotion();
  const v = useTween(shown ? value : 0, reduce ? 0 : 900);
  return (
    <button
      type="button"
      role="tab"
      aria-selected={on}
      className={on ? 'dg__row is-on' : 'dg__row'}
      style={{ ['--d' as string]: `${i * 110}ms`, ['--v' as string]: v / 100 } as CSSProperties}
      onClick={onSelect}
      data-cursor="select"
      aria-label={`${name}${shown ? `, sample score ${value}%` : ''}`}
    >
      <span className="dg__name">{name}</span>
      <span className="dg__track" aria-hidden="true">
        <span className="dg__fill" />
      </span>
      <span className="dg__val" aria-hidden="true">{shown ? `${Math.round(v)}%` : '–'}</span>
    </button>
  );
}

function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="wd" style={{ animationDelay: `${delay + i * 0.035}s` }}>
          {w}{' '}
        </span>
      ))}
    </>
  );
}

/* ───────────────────────── 02 · scholarship ───────────────────────── */
const tiers = funnel.scholarshipTiers; // highest band first
const tierFor = (score: number) => Math.max(0, tiers.findIndex((t) => score >= t.min));

function Scholarship() {
  const c = start.scholarship;
  const [score, setScore] = useState(82);
  const t = tierFor(score);
  const tier = tiers[t];
  const off = useTween(tier.off, 450);
  const shownScore = useTween(score, 250);
  const [sweep, setSweep] = useState(0);
  const sid = useId();
  useEffect(() => setSweep((n) => n + 1), [t]);
  const bands = [...tiers].reverse(); // low → high, left → right
  const everyone = tier.min === 0;

  return (
    <div className="sp">
      <div className="tk" data-tier={t}>
        <div className="tk__main">
          <p className="tk__k">
            <span>scholarship pass</span>
            <span className="tk__dot" aria-hidden="true" />
          </p>
          <p className="tk__off" aria-live="polite">
            <b>{Math.round(off)}</b>
            <span>% off</span>
          </p>
          <p className="tk__ap">{c.applies}</p>
          <p className="tk__band">band · {tier.score}</p>
        </div>
        <div className="tk__perf" aria-hidden="true" />
        <div className="tk__stub">
          <span className="tk__sk">score</span>
          <b className="tk__sv">{Math.round(shownScore)}</b>
          <span className="tk__sk">%</span>
        </div>
        {sweep > 1 && <span key={sweep} className="tk__sweep" aria-hidden="true" />}
      </div>

      <div className="sp__ctl">
        <label className="sp__lab" htmlFor={sid}>
          <span>{c.slider}</span>
          <b>{score}%</b>
        </label>
        <input
          id={sid}
          className="rng"
          type="range"
          min={0}
          max={100}
          step={1}
          value={score}
          onChange={(e) => setScore(+e.target.value)}
          aria-valuetext={`${score}%, ${tier.off}% off in this illustration`}
          style={{ ['--p' as string]: score / 100 } as CSSProperties}
          data-cursor="drag"
        />
        <div className="sp__bands" role="radiogroup" aria-label="Score bands" style={{ ['--n' as string]: bands.length, ['--k' as string]: bands.length - 1 - t } as CSSProperties}>
          <span className="seg__ind" aria-hidden="true" />
          {bands.map((b) => {
            const on = b === tier;
            return (
              <button
                key={b.score}
                type="button"
                role="radio"
                aria-checked={on}
                className={on ? 'sp__band is-on' : 'sp__band'}
                onClick={() => setScore(b.min === 0 ? Math.min(score, 59) : b.min + (b.min === 90 ? 5 : 7))}
                data-cursor="select"
              >
                <span>{b.min === 0 ? 'all' : b.score}</span>
                <b>{b.off}%</b>
              </button>
            );
          })}
        </div>
        <p className="sp__msg" aria-live="polite">
          {c.message(tier.off, everyone)}
        </p>
      </div>

      <div className="sp__foot">
        <Sample>{funnel.scholarshipConfirmed ? start.sampleNote : `illustrative · ${c.pending}`}</Sample>
      </div>
    </div>
  );
}

/* ───────────────────────── 03 · predictor ───────────────────────── */
type PStage = 'idle' | 'running' | 'done';

function Predictor() {
  const c = start.predictor;
  const [exam, setExam] = useState<Exam>('jee');
  const [score, setScore] = useState<number>(EXAMS.jee.start);
  const [stage, setStage] = useState<PStage>('idle');
  const [lit, setLit] = useState(0); // nodes switched on, 0..3
  const [run, setRun] = useState(0);
  const seq = useSequence();
  const reduce = useReducedMotion();
  const cfg = EXAMS[exam];
  const result = useMemo(() => estimate(exam, score), [exam, score]);
  const rankT = useTween(result.rank ?? 0, 700);
  const sid = useId();

  const reset = () => {
    seq.clear();
    setStage('idle');
    setLit(0);
  };
  const switchExam = (e: Exam) => {
    reset();
    setExam(e);
    setScore(EXAMS[e].start);
  };
  const explore = () => {
    seq.clear();
    setRun((r) => r + 1);
    setStage('running');
    setLit(1);
    const step = reduce ? 0 : 380;
    seq.at(step, () => setLit(2));
    seq.at(step * 2, () => setLit(3));
    seq.at(step * 2 + (reduce ? 0 : 200), () => setStage('done'));
  };
  const fmtScore = exam === 'jee' ? score.toFixed(1) : String(score);
  const hasData = result.rank !== null;

  return (
    <div className={`pr pr--${stage}`}>
      <div className="pr__top">
        <Segmented label="Exam" value={exam} options={[{ id: 'jee', label: EXAMS.jee.label }, { id: 'neet', label: EXAMS.neet.label }]} onChange={switchExam} />
      </div>

      <div className="pr__in">
        <label className="sp__lab" htmlFor={sid}>
          <span key={exam} className="pr__unit">example {cfg.unit}</span>
          <b>{fmtScore}</b>
        </label>
        <input
          id={sid}
          className="rng"
          type="range"
          min={cfg.min}
          max={cfg.max}
          step={cfg.step}
          value={score}
          onChange={(e) => {
            setScore(+e.target.value);
            if (stage !== 'idle') reset();
          }}
          aria-valuetext={`${fmtScore} ${cfg.unit}`}
          style={{ ['--p' as string]: (score - cfg.min) / (cfg.max - cfg.min) } as CSSProperties}
          data-cursor="drag"
        />
      </div>

      <div className="pw" aria-hidden="true" data-lit={lit}>
        <svg className="pw__svg" viewBox="0 0 300 64" preserveAspectRatio="none">
          <path className="pw__path" d="M30 32 C80 6 110 6 150 32" />
          <path className="pw__path" d="M150 32 C190 58 220 58 270 32" />
          <path key={`a${run}`} className={lit >= 2 ? 'pw__sig is-go' : 'pw__sig'} d="M30 32 C80 6 110 6 150 32" pathLength={100} />
          <path key={`b${run}`} className={lit >= 3 ? 'pw__sig is-go' : 'pw__sig'} d="M150 32 C190 58 220 58 270 32" pathLength={100} />
        </svg>
        {c.nodes.map((n, i) => (
          <span key={n} className={lit > i ? 'pw__node is-on' : 'pw__node'} style={{ ['--x' as string]: `${[10, 50, 90][i]}%` } as CSSProperties}>
            <i>{i + 1}</i>
            <em>{n}</em>
          </span>
        ))}
      </div>

      <div className="pr__res" aria-live="polite">
        <div className="pr__res-in">
          {stage === 'done' ? (
            <div key={run} className="pr__card">
              <p className="pr__row">
                <span>{cfg.label}</span>
                <b>{fmtScore} {exam === 'jee' ? '%ile' : '/ 720'}</b>
              </p>
              <p className="pr__row">
                <span>estimated rank</span>
                <b className={hasData ? '' : 'is-pending'}>{hasData ? `≈ ${Math.round(rankT).toLocaleString('en-IN')}` : c.noData}</b>
              </p>
              {hasData && result.colleges.length ? (
                <ul className="pr__cols">
                  {result.colleges.map((x) => (
                    <li key={x.name}>
                      <span>{x.name}</span>
                      <em>closing {x.closing.toLocaleString('en-IN')}</em>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="pr__note">{c.noDataNote}</p>
              )}
            </div>
          ) : (
            <p className="pr__wait">{stage === 'running' ? 'tracing the path…' : 'set an example score, then explore.'}</p>
          )}
        </div>
      </div>

      <div className="dg__foot">
        <Sample>{hasData ? `${c.disclaimer} ${result.year ?? predictorCfg.year} data` : 'illustrative · nothing sent'}</Sample>
        {stage === 'done' ? (
          <button type="button" className="xbtn" onClick={reset} data-cursor="reset">
            {c.restart}
          </button>
        ) : (
          <button type="button" className="xbtn" onClick={explore} data-cursor="explore">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {c.explore}
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── the grid ───────────────────────── */
export default function StartCards() {
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  const d = start.diagnostic, s = start.scholarship, p = start.predictor;
  return (
    <div ref={ref} className={seen ? 'xgrid is-in' : 'xgrid'}>
      <Card {...d} i={0} meta={d.meta} ctas={
        <a className="xc__cta" href={d.href} {...ext(d.href)} data-cursor="free">
          {d.cta} <CtaArrow />
        </a>
      }>
        <Diagnostic />
      </Card>
      <Card {...s} i={1} meta={s.meta} ctas={
        <a className="xc__cta" href={s.href} {...ext(s.href)} data-cursor="register">
          {s.cta} <CtaArrow />
        </a>
      }>
        <Scholarship />
      </Card>
      <Card {...p} i={2} meta={p.meta} ctas={
        <>
          <a className="xc__cta" href={p.href} data-cursor="terminal">
            {p.cta} <CtaArrow />
          </a>
          <a className="xc__alt" href={p.whatsapp.href} {...ext(p.whatsapp.href)} data-cursor="chat">
            {p.whatsapp.label} <CtaArrow />
          </a>
        </>
      }>
        <Predictor />
      </Card>
    </div>
  );
}
