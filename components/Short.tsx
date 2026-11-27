import { shortVersion as s, receipts, receiptsCopy } from '@/lib/content';

const W = ({ t }: { t: string }) => (
  <span className="mfw" aria-hidden="true" style={{ position: 'relative', display: 'inline-block' }}>
    {t}
  </span>
);

function words(list: string[]) {
  return list.map((t, i) => (
    <span key={i}>
      <W t={t} />{' '}
    </span>
  ));
}

export function Short() {
  const label = `${s.pre.join(' ')} ${s.a} ${s.or} ${s.b}. ${s.mid.join(' ')} ${s.plus} ${s.minus} ${s.after.join(' ')} ${s.last.join(' ')}`;
  return (
    <section className="mf" aria-label="The short version">
      <div className="wrap mf__in">
        <span className="eyebrow">the short version</span>
        <p className="mf__text" data-mf aria-label={label}>
          {words(s.pre)}
          <span className="mf__d">
            <W t={s.a} />
          </span>{' '}
          <W t={s.or} />{' '}
          <span className="mf__c">
            <W t={s.b} />
          </span>
          <W t="." /> {words(s.mid)}
          <span className="mf__diff" aria-label={s.diffLabel}>
            <b>
              <W t={s.plus} />
            </b>
            <i>
              <W t={s.minus} />
            </i>
          </span>{' '}
          {words(s.after)}
          <span className="mf__f" style={{ ['--u' as string]: 0 }}>
            {s.last.map((t, i) => (
              <span key={i}>
                <W t={t} />
                {i < s.last.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </p>
        <p className="mf__sub" data-mf-sub>
          <span>{s.sub}</span>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 2.5v10m0 0-4-4m4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
      </div>
    </section>
  );
}

export function Receipts() {
  return (
    <section className="receipts wrap" id="receipts" aria-labelledby="receipts-t">
      <div className="receipts__head">
        <h2 id="receipts-t" className="eyebrow">
          {receiptsCopy.title}
        </h2>
        <p className="receipts__aside">{receiptsCopy.aside}</p>
      </div>
      <ul className="receipts__list">
        {receipts.map((r) => (
          <li className="rc" data-reveal="" key={r.label}>
            <div className="rc__n">
              <span className="rc__pre">{r.pre}</span>
              <span data-count={r.n}>0</span>
              <span className="rc__suf">{r.suf}</span>
            </div>
            <p className="rc__l">{r.label}</p>
            <p className="rc__f">{r.foot}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
