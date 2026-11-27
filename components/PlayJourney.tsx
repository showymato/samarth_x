import { play, journey } from '@/lib/content';
import { SplitTitle, Rich, ext } from './Work';
import Arcade from './Arcade';

export function Play() {
  const counts: Record<string, number> = { all: play.tiles.length };
  play.tiles.forEach((t) => t.tags.split(',').forEach((k) => (counts[k] = (counts[k] || 0) + 1)));
  return (
    <section className="play" id="play" aria-labelledby="play-t">
      <div className="wrap play__head">
        <div>
          <span className="eyebrow">{play.eyebrow}</span>
          <SplitTitle id="play-t" className="sec-title" label={`${play.titlePre} ${play.titleSerif}*`}>
            {play.titlePre} <span className="serif">{play.titleSerif}</span>
            <span className="play__ast">*</span>
          </SplitTitle>
          <p className="play__allegedly note">{play.aside}</p>
        </div>
        <div className="play__side" data-reveal="">
          <p className="sec-lede">{play.lede}</p>
          <a className="play__be" href={play.ctaHref} {...ext(play.ctaHref)} data-cursor="follow">
            <span>{play.cta}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
      <div className="pm" aria-hidden="true" data-marquee>
        <div className="pm__track">
          {[0, 1].map((r) => (
            <span className="pm__set" key={r}>
              {play.marquee.map((w, i) => (
                <span className={['pm__item', 'pm__item is-out', 'pm__item is-serif'][i % 3]} key={w + r}>
                  {w}
                  <span className="pm__star">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="wrap">
        <div className="pills" role="toolbar" aria-label="Filter">
          {play.filters.map((f, i) => (
            <button className={i === 0 ? 'pill is-on' : 'pill'} type="button" data-f={f.key} key={f.key}>
              {f.label}
              <sup>{counts[f.key] || 0}</sup>
            </button>
          ))}
        </div>
        <div className="gallery is-rows" data-gallery>
          {play.tiles.map((t) => (
            <figure className="tile" data-tags={t.tags} data-full={t.src} data-kind="img" data-cap={t.cap} key={t.src}>
              <button className="tile__open" type="button" data-cursor="view" aria-label={`Open ${t.cap}`}>
                <img src={t.src} alt={t.cap} width={t.w} height={t.h} decoding="async" loading="lazy" />
                <figcaption className="tile__cap">
                  <span>{t.cap}</span>
                  <small>{t.year}</small>
                </figcaption>
              </button>
            </figure>
          ))}
        </div>
      </div>
      <Arcade />
    </section>
  );
}

const noteIcon = { add: ['+', 'added'], chg: ['~', 'changed'], bug: ['!', 'known issue'] } as const;

function sha(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

export function Journey() {
  const cs = journey.commits;
  const laneN = { main: 0, work: -1, side: 1 };
  return (
    <section className="journey" id="timeline" aria-labelledby="tl-t">
      <div className="wrap jr__head">
        <div>
          <span className="eyebrow">{journey.eyebrow}</span>
          <SplitTitle id="tl-t" className="sec-title" label={`${journey.titlePre} ${journey.titleSerif} ${journey.titlePost}`}>
            {journey.titlePre} <span className="serif">{journey.titleSerif}</span> {journey.titlePost}
          </SplitTitle>
        </div>
        <p className="sec-lede" data-reveal="">
          <Rich parts={journey.lede} />
        </p>
      </div>

      <div className="gx gx--h" data-gx>
        <div className="gx__hud" aria-hidden="true">
          <div className="wrap gx__hud-in">
            <div className="gx__now">
              <span className="gx__head">HEAD →</span>
              <div className="gx__ver">
                <span className="gx__vv">v</span>
                <span className="gx__num" data-gx-ver>
                  {cs[0].v.slice(1)}
                </span>
              </div>
              <p className="gx__meta">
                <span data-gx-date>{cs[0].date}</span>
                <span className="gx__pill" data-gx-type data-type={cs[0].type}>
                  {cs[0].type}
                </span>
              </p>
            </div>
            <div className="gx__side">
              <ul className="gx__legend">
                <li className="is-main">{journey.lanes.main}</li>
                <li className="is-work">{journey.lanes.work}</li>
                <li className="is-side">{journey.lanes.side}</li>
              </ul>
              <p className="gx__count">
                commit <b data-gx-n>01</b>/<span data-gx-total>{String(cs.length).padStart(2, '0')}</span>
              </p>
              <div className="gx__bar">
                <i data-gx-bar />
              </div>
            </div>
          </div>
        </div>
        <div className="gx__view">
          <span className="gx__year" data-gx-year aria-hidden="true">
            {cs[0].date}
          </span>
          <div className="gx__graph" data-gx-graph aria-hidden="true" />
          <div className="gx__track" data-gx-track>
            <ol className="gx__list">
              {cs.map((c, i) => (
                <li
                  key={c.v}
                  className={`cm cm--${c.type === 'pre-release' ? 'pre' : c.type} cm--${c.lane} ${i % 2 ? 'cm--down' : 'cm--up'}${i === 0 ? ' is-on' : ''}`}
                  data-cm=""
                  data-lane={c.lane}
                  data-v={c.v.slice(1)}
                  data-date={c.date}
                  data-type={c.type}
                  style={{ ['--i' as string]: i, ['--lane' as string]: laneN[c.lane] }}
                >
                  <span className="cm__node" aria-hidden="true" />
                  <span className="cm__stem" aria-hidden="true" />
                  <article className="cm__card">
                    <div className="cm__top">
                      <span className="cm__v">
                        {c.v}
                        {c.vSmall && <small>{c.vSmall}</small>}
                      </span>
                      <span className="cm__type">{c.type}</span>
                      <code className="cm__sha">{sha(c.v + c.title)}</code>
                    </div>
                    <h3 className="cm__title">{c.title}</h3>
                    <p className="cm__org">
                      {c.org} <span>· {c.date}</span>
                    </p>
                    <ul className="cm__notes">
                      {c.notes.map(([k, t]) => (
                        <li className={`cm__n cm__n--${k}`} key={t}>
                          <i aria-label={noteIcon[k][1]}>{noteIcon[k][0]}</i>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
              <li
                className={`cm cm--next cm--main ${cs.length % 2 ? 'cm--down' : 'cm--up'}`}
                data-cm-next=""
                style={{ ['--i' as string]: cs.length, ['--lane' as string]: 0 }}
              >
                <span className="cm__node" aria-hidden="true" />
                <span className="cm__stem" aria-hidden="true" />
                <article className="cm__card">
                  <div className="cm__top">
                    <span className="cm__v">{journey.next.v}</span>
                    <span className="cm__type">unreleased</span>
                    <code className="cm__sha">???????</code>
                  </div>
                  <h3 className="cm__title">{journey.next.title}</h3>
                  <p className="cm__org">
                    branch: <span>{journey.next.branch}</span>
                  </p>
                  <ul className="cm__notes">
                    {journey.next.notes.map(([k, t]) => (
                      <li className={`cm__n cm__n--${k}`} key={t}>
                        <i aria-label={noteIcon[k][1]}>{noteIcon[k][0]}</i>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <a className="cm__mr" href={journey.next.href} data-cursor="merge">
                    {journey.next.cta}{' '}
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </article>
              </li>
            </ol>
          </div>
          <div className="gx__ph" aria-hidden="true">
            <span>HEAD</span>
          </div>
          <p className="gx__hint" aria-hidden="true">
            scroll to move HEAD <i>→</i>
          </p>
        </div>
      </div>

      <div className="wrap">
        <div className="npm" data-npm>
          <div className="npm__bar">
            <span className="dots3"><i /><i /><i /></span>
            <span>{journey.npm.bar}</span>
          </div>
          <div className="npm__body">
            <p className="npm__cmd">
              <span className="npm__ps">$</span> <span data-npm-cmd data-text={journey.npm.cmd} />
              <i className="npm__caret" />
            </p>
            <div className="npm__out" data-npm-out>
              <p>
                {journey.npm.out1[0]}
                <b>{journey.npm.out1[1]}</b>
                {journey.npm.out1[2]}
              </p>
              <p>
                {journey.npm.out2[0]}
                <b className="ok">{journey.npm.out2[1]}</b>
                {journey.npm.out2[2]}
              </p>
              <p className="dim">
                {journey.npm.out3pre}
                <code>{journey.npm.out3}</code>
                {journey.npm.out3post}
              </p>
            </div>
            <a className="npm__run" href={journey.npm.href} data-cursor="enroll">
              {journey.npm.out3}{' '}
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
