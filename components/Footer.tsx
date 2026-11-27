import { footer, brand as person, hero } from '@/lib/content';
import { ext } from './Work';

// Distractions for the footer squash game. Same 40×40 box as the old bug sprite.
const INK = '#1d1d1b';
const DISTRACTIONS = [
  // phone, lit up
  <svg viewBox="0 0 40 40" aria-hidden="true" key="phone">
    <rect x="11" y="4" width="18" height="32" rx="4" fill="#ff3b30" stroke={INK} strokeWidth="2" />
    <rect x="14" y="9" width="12" height="20" rx="1.5" fill="#fff" stroke={INK} strokeWidth="1.5" />
    <circle cx="20" cy="32.5" r="1.4" fill={INK} />
    <path d="M6 10 3 8M6 18H2M34 10l3-2M34 18h4" stroke={INK} strokeWidth="2" strokeLinecap="round" />
  </svg>,
  // reels: a play button
  <svg viewBox="0 0 40 40" aria-hidden="true" key="reels">
    <rect x="5" y="7" width="30" height="26" rx="8" fill="#ff4f9a" stroke={INK} strokeWidth="2" />
    <path d="M5 15h30M14 7l4 8M24 7l4 8" stroke={INK} strokeWidth="2" />
    <path d="M17 19.5v8.5l7.5-4.2z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>,
  // notification bell
  <svg viewBox="0 0 40 40" aria-hidden="true" key="bell">
    <path d="M20 6a9 9 0 0 1 9 9v7l4 5H7l4-5v-7a9 9 0 0 1 9-9z" fill="#ffe45c" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M16.5 31a3.5 3.5 0 0 0 7 0" fill="none" stroke={INK} strokeWidth="2" />
    <circle cx="30" cy="9" r="5" fill="#ff3b30" stroke={INK} strokeWidth="2" />
  </svg>,
  // the "5 min" bubble
  <svg viewBox="0 0 40 40" aria-hidden="true" key="five">
    <path d="M6 9a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H17l-7 6v-6a4 4 0 0 1-4-4z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <text x="20" y="20.5" textAnchor="middle" fontFamily="Geist Mono, monospace" fontSize="9.5" fontWeight="600" fill={INK}>5 min</text>
  </svg>,
];

export default function Footer() {
  return (
    <>
      <div className="curl" aria-hidden="true">
        <svg className="curl__shade" preserveAspectRatio="none" data-curl-shade>
          <defs>
            <filter id="curl-drop" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="15" />
              <feOffset dy="14" />
              <feComponentTransfer>
                <feFuncA type="linear" slope=".3" />
              </feComponentTransfer>
            </filter>
            <mask id="curl-hole" maskUnits="userSpaceOnUse">
              <rect fill="#fff" data-curl-maskrect />
              <path fill="#000" data-curl-hole />
            </mask>
          </defs>
          <g mask="url(#curl-hole)">
            <path filter="url(#curl-drop)" data-curl-body />
          </g>
        </svg>
        <svg className="curl__flap" preserveAspectRatio="none" data-curl-flap>
          <defs>
            <linearGradient id="curl-shine" gradientUnits="userSpaceOnUse" data-curl-grad>
              <stop offset="0" stopColor="#d4d1c7" />
              <stop offset=".4" stopColor="#ecebe5" />
              <stop offset=".85" stopColor="#fbf5f6" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <path fill="url(#curl-shine)" data-curl-flap-path />
        </svg>
      </div>
      <div className="foot-spacer" aria-hidden="true" />

      <footer className="foot" id="contact">
        <div className="foot__inner">
          <div className="foot__top">
            <p className="foot__status">
              <i className="hx__dot" aria-hidden="true" />
              {hero.status}
            </p>
            <p className="foot__time">
              {person.city} <time data-clock>10:00</time>
            </p>
          </div>
          <div className="foot__main">
            <a className="foot__hire" href="#pricing" data-cursor="enroll">
              <span>{footer.hire}</span>
              <span className="eyes">
                <span className="eye" />
                <span className="eye" />
              </span>
            </a>
            <h2 className="foot__title">
              {footer.title1}
              <br />
              {footer.title2pre} <span className="serif">{footer.title2serif}</span> {footer.title2post}
            </h2>
            <button className="foot__mail" type="button" data-foot-mail data-cursor="copy">
              <span className="foot__mail-t">{person.email}</span>
              <span className="foot__mail-k" data-foot-mail-k>
                click to copy
              </span>
            </button>
          </div>
          <nav className="foot__grid" aria-label="Elsewhere">
            {footer.cols.map((c) => (
              <div className="foot__col" key={c.h}>
                <h3>{c.h}</h3>
                {c.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    {...(l.ext ? ext(l.href) : l.href.startsWith('#') ? { 'data-foot-jump': '' } : {})}
                    data-cursor={l.cursor}
                  >
                    {l.label}
                    <i>{l.ext ? '↗' : l.href.startsWith('#') ? '↑' : '↗'}</i>
                  </a>
                ))}
              </div>
            ))}
          </nav>
          <div className="foot__bottom">
            <p>{footer.copyright}</p>
            <p className="foot__bugs">
              <span data-duck-say>{footer.bugsSay}</span>{' '}
              <span className="foot__score">
                {footer.bugsCount} <b data-bugs-count>0</b>
              </span>
            </p>
          </div>
        </div>
        <div className="bugs" aria-label="Distractions. Click to squash.">
          {Array.from({ length: 5 }, (_, i) => (
            <button className="bug" type="button" aria-label="squash this distraction" data-cursor="squash" key={i}>
              {DISTRACTIONS[i % DISTRACTIONS.length]}
            </button>
          ))}
        </div>
        <button className="foot__duck" type="button" aria-label="Rubber duck. Throw it, or click for study advice." data-cursor="throw me">
          <svg viewBox="0 0 120 110" aria-hidden="true">
            <use href="#duck-sym" />
          </svg>
          <span className="foot__duck-say" role="status" />
        </button>
      </footer>

      <nav className="dock" aria-label="Sections">
        <div className="dock__items">
          <span className="dock__pill" aria-hidden="true" />
          {footer.dock.map((d) => (
            <button type="button" data-dock={d.id} key={d.id}>
              {d.label}
            </button>
          ))}
        </div>
        <span className="dock__sep" aria-hidden="true" />
        <a className="dock__cta" href="#pricing" data-cursor="enroll">
          {footer.dockCta}{' '}
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <button className="dock__mail" type="button" data-copy-email data-cursor="copy">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1.5" y="3" width="13" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="m2 4 6 5 6-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span>{footer.dockMail}</span>
        </button>
      </nav>

      <div className="lightbox" role="dialog" aria-modal="true" aria-label="Viewer" hidden>
        <button className="lightbox__close" type="button" data-cursor="close" aria-label="Close">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <button className="lightbox__nav lightbox__nav--prev" type="button" data-cursor="prev" aria-label="Previous">
          ←
        </button>
        <figure className="lightbox__fig">
          <img alt="" />
          <figcaption />
        </figure>
        <button className="lightbox__nav lightbox__nav--next" type="button" data-cursor="next" aria-label="Next">
          →
        </button>
      </div>

      <div className="cursor" aria-hidden="true">
        <span className="cursor__dot" />
        <span className="cursor__label" />
      </div>
      <div className="toast" role="status" aria-live="polite" />

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="duck-sym" viewBox="0 0 120 110">
          <path d="M14 70c0-18 16-28 36-28h18c22 0 40 6 40 26 0 20-20 32-48 32S14 90 14 70z" fill="#ffd21f" />
          <path d="M100 52c6-6 10-14 10-14s2 12-4 22z" fill="#ffd21f" />
          <circle cx="50" cy="36" r="24" fill="#ffd52b" />
          <path d="M26 38c-8 0-16 2-20 6 6 4 14 5 22 3z" fill="#ff7a1f" />
          <circle cx="44" cy="30" r="5" fill="#141414" />
          <circle cx="42.4" cy="28.4" r="1.7" fill="#fff" />
        </symbol>
      </svg>
    </>
  );
}
