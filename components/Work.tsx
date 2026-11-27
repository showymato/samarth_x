import { work, brand } from '@/lib/content';
import { MockMentor, MockParents, MockScore, MockFlight, MockChat, MockEditor } from './Mocks';

export const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function SplitTitle({ id, className, label, children }: { id: string; className: string; label: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className={className} data-split="" aria-label={label}>
      <div className="sl-mask" aria-hidden="true" style={{ position: 'relative', display: 'block', textAlign: 'start', overflow: 'clip' }}>
        <div className="sl" aria-hidden="true" style={{ position: 'relative', display: 'block', textAlign: 'start' }}>
          {children}
        </div>
      </div>
    </h2>
  );
}

export function Rich({ parts }: { parts: (string | { b: string })[] }) {
  return (
    <>
      {parts.map((p, i) => (typeof p === 'string' ? <span key={i}>{p}</span> : <b key={i}>{p.b}</b>))}
    </>
  );
}

const mocks = { mentor: MockMentor, parents: MockParents, score: MockScore, flight: MockFlight, chat: MockChat, editor: MockEditor };

// in-page anchors stay in the tab; everything else opens a new one
export const ext = (href: string) => (href.startsWith('#') || href.startsWith('tel:') ? {} : { target: '_blank', rel: 'noopener' });

export default function Work() {
  const n = work.stack.length;
  return (
    <section className="work" id="work" aria-labelledby="work-t">
      <div className="wrap work__head">
        <div>
          <span className="eyebrow">{work.eyebrow}</span>
          <SplitTitle id="work-t" className="sec-title" label={`${work.titlePre} ${work.titleSerif}`}>
            {work.titlePre} <span className="serif">{work.titleSerif}</span>
          </SplitTitle>
        </div>
        <div className="lever" role="group" aria-label={`Jump between ${work.lever.a} and ${work.lever.b}`}>
          <a href="#work" className="lever__opt is-on" data-lever="work">
            {work.lever.a}
          </a>
          <button className="lever__stick" type="button" aria-label={`Toggle ${work.lever.a} and ${work.lever.b}`} data-cursor="flip">
            <i />
          </button>
          <a href="#play" className="lever__opt lever__opt--play" data-lever="play">
            {work.lever.b}
          </a>
        </div>
      </div>
      <p className="wrap sec-lede work__lede" data-reveal="">
        <Rich parts={work.lede} />
      </p>

      <div className="stack wrap">
        {work.stack.map((c, i) => {
          const M = mocks[c.mock];
          return (
            <article className="stack__item" id={c.id} key={c.id} style={{ ['--accent' as string]: c.accent, ['--i' as string]: i }}>
              <div className="pc">
                <div className="pc__vis">
                  <M />
                  {c.sticker && (
                    <figure className="pc__sticker pc__sticker--me" aria-hidden="true">
                      <img src={brand.photo} alt="" width={76} height={76} loading="lazy" />
                      <figcaption>{c.sticker}</figcaption>
                    </figure>
                  )}
                </div>
                <div className="pc__info">
                  <div className="pc__top">
                    <span className="pc__idx">
                      {String(i + 1).padStart(2, '0')}
                      <i>/{String(n).padStart(2, '0')}</i>
                    </span>
                    <span className="pc__brand">
                      <span className="pc__role">{c.role}</span>
                    </span>
                  </div>
                  <h3 className="pc__title">{c.title}</h3>
                  <p className="pc__blurb">{c.blurb}</p>
                  <ul className="pc__tags">
                    {c.tags.map((t) => (
                      <li className="chip" key={t}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="pc__links">
                    {c.links.map((l) =>
                      l.href ? (
                        <a
                          key={l.label}
                          className={l.main ? 'pc__link pc__link--main' : 'pc__link'}
                          href={l.href}
                          {...ext(l.href)}
                          data-cursor="open"
                        >
                          {l.label} <Arrow />
                        </a>
                      ) : (
                        <span key={l.label} className="pc__link pc__link--soon">
                          {l.label}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <span className="pc__shade" aria-hidden="true" />
              </div>
            </article>
          );
        })}
      </div>

      <div className="wrap bench">
        <div className="bench__head">
          <h3 className="eyebrow">{work.bench.title}</h3>
          <p>{work.bench.head}</p>
        </div>
        <div className="bench__grid">
          {work.bench.cards.map((c) => {
            const M = mocks[c.mock];
            return (
              <article className="bench__card" id={c.id} key={c.id} style={{ ['--accent' as string]: c.accent }} data-reveal="">
                <div className="bench__vis">
                  <M />
                </div>
                <div className="bench__info">
                  <span className="bench__role">{c.role}</span>
                  <h3 className="bench__title">{c.title}</h3>
                  <p className="bench__blurb">{c.blurb}</p>
                  <ul className="bench__tags">
                    {c.tags.map((t) => (
                      <li className="chip" key={t}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="pc__links">
                    {c.links.map((l) => (
                      <a className="pc__link" href={l.href} {...ext(l.href)} data-cursor="open" key={l.label}>
                        {l.label} <Arrow />
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="wrap more">
        <div className="more__head">
          <h3 className="eyebrow">{work.more.title}</h3>
          <p>{work.more.head}</p>
        </div>
        <ul className="more__list">
          {work.more.rows.map((r, i) => (
            <li className="more__row" data-reveal="" key={r.n}>
              <a href="#pricing" data-cursor="add">
                <span className="more__i">{String(i + 1).padStart(2, '0')}</span>
                <span className="more__n">{r.n}</span>
                <span className="more__w">{r.w}</span>
                <span className="more__s">{r.s}</span>
                <span className="more__a">
                  <Arrow />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
