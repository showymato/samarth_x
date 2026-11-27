// Pricing + FAQ. Composed only from existing classes and tokens:
// bench cards (with a receipts-style number in the visual), the skills grid,
// chips and the project-card links. No new styles.
import { plans, faq, cta, brand, start } from '@/lib/content';
import { SplitTitle, Arrow, ext } from './Work';

export function Start() {
  return (
    <section className="work" id="start" aria-labelledby="start-t">
      <div className="wrap work__head">
        <div>
          <span className="eyebrow">{start.eyebrow}</span>
          <SplitTitle id="start-t" className="sec-title" label={`${start.title} ${start.titleSerif}`}>
            {start.title} <span className="serif">{start.titleSerif}</span>
          </SplitTitle>
        </div>
      </div>
      <p className="wrap sec-lede work__lede" data-reveal="">
        {start.lede}
      </p>
      <div className="wrap bench">
        <div className="bench__grid">
          {start.cards.map((c) => (
            <article className="bench__card" id={c.id} key={c.id} style={{ ['--accent' as string]: c.accent }} data-reveal="">
              <div className="bench__vis">
                <div className="rc__n" style={{ position: 'relative' }}>
                  <span className="rc__pre">{c.big.pre}</span>
                  <span>{c.big.n}</span>
                  <span className="rc__suf">{c.big.suf}</span>
                </div>
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
                    <a
                      key={l.label}
                      className={'main' in l && l.main ? 'pc__link pc__link--main' : 'pc__link'}
                      href={l.href}
                      {...ext(l.href)}
                      data-cursor="start"
                    >
                      {l.label} <Arrow />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section className="work" id="pricing" aria-labelledby="pricing-t">
      <div className="wrap work__head">
        <div>
          <span className="eyebrow">{plans.eyebrow}</span>
          <SplitTitle id="pricing-t" className="sec-title" label={`${plans.titlePre} ${plans.titleSerif}`}>
            {plans.titlePre} <span className="serif">{plans.titleSerif}</span>
          </SplitTitle>
        </div>
      </div>
      <p className="wrap sec-lede work__lede" data-reveal="">
        {plans.lede}
      </p>

      <div className="wrap bench">
        <div className="bench__head">
          <h3 className="eyebrow">billing cycle</h3>
          <p>{plans.parents}</p>
        </div>
        <div className="bench__grid">
          {plans.cycles.map((c) => (
            <article className="bench__card" id={`plan-${c.id}`} key={c.id} style={{ ['--accent' as string]: c.accent }} data-reveal="">
              <div className="bench__vis">
                <div className="rc__n" style={{ position: 'relative' }}>
                  <span className="rc__pre">₹</span>
                  <span>{c.price.toLocaleString('en-IN')}</span>
                  <span className="rc__suf">{c.per}</span>
                </div>
              </div>
              <div className="bench__info">
                <span className="bench__role">
                  {c.cycle} · {c.badge}
                </span>
                <h3 className="bench__title">{c.line}</h3>
                <p className="bench__blurb">{c.sub}. Every feature below, nothing held back.</p>
                <div className="pc__links">
                  <a className="pc__link pc__link--main" href={c.href} {...ext(c.href)} data-cursor="enroll">
                    {c.cta} <Arrow />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="more" id="starter">
          <div className="receipts__head">
            <h3 className="eyebrow">{plans.starterTitle}</h3>
            <p className="receipts__aside">{plans.starterSub}</p>
          </div>
          <ul className="receipts__list">
            {plans.starter.map((o) => (
              <li className="rc" data-reveal="" key={o.id} id={`offer-${o.id}`}>
                <div className="rc__n">
                  <span className="rc__pre">₹</span>
                  <span data-count={o.price}>{o.price}</span>
                  <span className="rc__suf">{o.suf}</span>
                </div>
                <p className="rc__l">{o.name}</p>
                <p className="rc__f">{o.line}</p>
                <div className="pc__links">
                  <a className="pc__link" href={o.href} {...ext(o.href)} data-cursor="start">
                    {o.cta} <Arrow />
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <p className="rc__f">{plans.trialNote}</p>
        </div>
        <ul className="pc__tags" aria-label="Good to know">
          {plans.trust.map((t) => (
            <li className="chip" key={t}>
              ✓ {t}
            </li>
          ))}
          <li className="chip">{plans.note}</li>
        </ul>
      </div>

      <div className="wrap about__stack">
        <div className="about__stack-head">
          <h3 className="eyebrow">{plans.includedTitle}</h3>
          <p className="muted">{plans.includedSub}</p>
        </div>
        <div className="skills">
          {plans.included.map((s) => (
            <div className="sk" data-reveal="" key={s.k}>
              <span className="sk__k">{s.k}</span>
              <ul>
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pc__links">
          <a className="pc__link pc__link--main" href={cta.diagnosticHref} {...ext(cta.diagnosticHref)} data-cursor="free">
            {cta.diagnostic} <Arrow />
          </a>
          <a className="pc__link" href={brand.phoneHref} data-cursor="call">
            {cta.parentCall} <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="work" id="faq" aria-labelledby="faq-t">
      <div className="wrap work__head">
        <div>
          <span className="eyebrow">{faq.eyebrow}</span>
          <SplitTitle id="faq-t" className="sec-title" label={`${faq.title} ${faq.titleSerif}`}>
            {faq.title} <span className="serif">{faq.titleSerif}</span>
          </SplitTitle>
        </div>
      </div>
      <p className="wrap sec-lede work__lede" data-reveal="">
        {faq.lede}
      </p>
      <div className="wrap bench">
        <div className="bench__grid">
          {faq.items.map((f, i) => (
            <article className="bench__card" key={f.q} style={{ ['--accent' as string]: '#8b5cf6' }} data-reveal="">
              <div className="bench__info">
                <span className="bench__role">Q.{String(i + 1).padStart(2, '0')}</span>
                <h3 className="bench__title">{f.q}</h3>
                <p className="bench__blurb">{f.a}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="pc__links">
          <a className="pc__link pc__link--main" href="#pricing" data-cursor="enroll">
            {cta.primary} <Arrow />
          </a>
          <a className="pc__link" href={brand.phoneHref} data-cursor="call">
            {cta.parentCall} <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

