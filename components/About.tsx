import { about, brand as person } from '@/lib/content';

const ROWS: [string, string?, number?][][] = [
  [['Escape', undefined, 1], ['Digit1', '1'], ['Digit2', '2'], ['Digit3', '3'], ['Digit4', '4'], ['Digit5', '5'], ['Digit6', '6'], ['Digit7', '7'], ['Digit8', '8'], ['Digit9', '9'], ['Digit0', '0'], ['Minus', '-'], ['Equal', '='], ['Backspace', undefined, 2]],
  [['Tab', undefined, 1.5], ['KeyQ', 'q'], ['KeyW', 'w'], ['KeyE', 'e'], ['KeyR', 'r'], ['KeyT', 't'], ['KeyY', 'y'], ['KeyU', 'u'], ['KeyI', 'i'], ['KeyO', 'o'], ['KeyP', 'p'], ['BracketLeft', '['], ['BracketRight', ']'], ['Backslash', '\\', 1.5]],
  [['CapsLock', undefined, 1.75], ['KeyA', 'a'], ['KeyS', 's'], ['KeyD', 'd'], ['KeyF', 'f'], ['KeyG', 'g'], ['KeyH', 'h'], ['KeyJ', 'j'], ['KeyK', 'k'], ['KeyL', 'l'], ['Semicolon', ';'], ['Quote', "'"], ['Enter', undefined, 2.25]],
  [['ShiftLeft', undefined, 2.25], ['KeyZ', 'z'], ['KeyX', 'x'], ['KeyC', 'c'], ['KeyV', 'v'], ['KeyB', 'b'], ['KeyN', 'n'], ['KeyM', 'm'], ['Comma', ','], ['Period', '.'], ['Slash', '/'], ['ShiftRight', undefined, 2.75]],
  [['ControlLeft', undefined, 1.25], ['AltLeft', undefined, 1.25], ['MetaLeft', undefined, 1.25], ['Space', ' ', 6.25], ['MetaRight', undefined, 1.25], ['AltRight', undefined, 1.25], ['Fn', undefined, 1.25], ['ControlRight', undefined, 1.25]],
];
const MOD_LABEL: Record<string, string> = {
  Backspace: 'delete', Tab: 'tab', CapsLock: 'caps', Enter: 'return', ShiftLeft: 'shift', ShiftRight: 'shift',
  ControlLeft: 'ctrl', ControlRight: 'ctrl', AltLeft: 'opt', AltRight: 'opt', MetaLeft: 'cmd', MetaRight: 'cmd', Fn: 'fn', Space: '',
};

function Keyboard() {
  return (
    <div className="kb">
      {ROWS.map((row, r) => (
        <div className="kb__row" key={r}>
          {row.map(([code, ch, u]) => {
            if (code === 'Escape')
              return (
                <span className="kb__k kb__k--gone" data-code="Escape" style={{ ['--u' as string]: 1 }} key={code}>
                  <i>on the desk</i>
                </span>
              );
            const mod = code in MOD_LABEL || code === 'Backslash';
            return (
              <span
                key={code}
                className={mod ? 'kb__k kb__k--mod' : 'kb__k'}
                data-code={code}
                {...(ch !== undefined ? { 'data-ch': ch } : {})}
                style={{ ['--u' as string]: u ?? 1 }}
              >
                {code in MOD_LABEL ? MOD_LABEL[code] : ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const PhoneIcon = ({ k }: { k: string }) => {
  if (k === 'mentor')
    return (
      <i className="ph__ic ph__ic--mentor">
        <svg viewBox="0 0 20 20">
          <path d="M4 4.5h12a1.5 1.5 0 0 1 1.5 1.5v6.5A1.5 1.5 0 0 1 16 14H9l-3.6 2.8V14H4a1.5 1.5 0 0 1-1.5-1.5V6A1.5 1.5 0 0 1 4 4.5z" fill="#fff" />
        </svg>
      </i>
    );
  if (k === 'streak')
    return (
      <i className="ph__ic ph__ic--streak">
        <svg viewBox="0 0 20 20">
          <path d="M10 2.5c.6 3-2 4.2-2 7a2 2 0 0 0 4 .3c1.4 1 2.2 2.4 2.2 3.8A4.2 4.2 0 0 1 10 17.8a4.2 4.2 0 0 1-4.2-4.2c0-4.4 4.6-6 4.2-11.1z" fill="#fff" />
        </svg>
      </i>
    );
  return (
    <i className="ph__ic ph__ic--check">
      <svg viewBox="0 0 20 20">
        <path d="M4.5 10.4 8.2 14l7.3-8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </i>
  );
};

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-t">
      <div className="wrap about__head">
        <span className="eyebrow">off the record</span>
        <h2
          id="about-t"
          className="about__title"
          data-split=""
          data-split-lines=""
          aria-label={about.titleAria}
        >
          <span data-lines>
            and for the <span className="hot">{about.titleHot}</span>
            {about.titleRest}{' '}
            <span className="muted">{about.titleMutedPre}</span>{' '}
            <img className="about__mini" src={person.photo} alt="" width={44} height={44} />
            <span className="muted">)</span>
          </span>
        </h2>
      </div>

      <div className="wrap about__scene">
        <div className="desk__head">
          <p className="note about__note">
            {about.note1}
            <code>help</code>
            {about.note2}
            <code>{about.noteCmd}</code>.
            <br />
            {about.note3}
          </p>
          <div className="desk__ctl" role="group" aria-label="Desk mode">
            <button type="button" className="is-on" data-desk-knoll data-cursor="tidy">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="3" />
                <path d="M8 1.2v1.7M8 13.1v1.7M1.2 8h1.7M13.1 8h1.7M3.2 3.2l1.2 1.2M11.6 11.6l1.2 1.2M3.2 12.8l1.2-1.2M11.6 4.4l1.2-1.2" />
              </svg>
              {about.modes.day}
            </button>
            <button type="button" data-desk-mess data-cursor="chaos">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path className="fill" d="M13.6 9.8A5.8 5.8 0 0 1 6.2 2.4a5.8 5.8 0 1 0 7.4 7.4z" />
              </svg>
              {about.modes.night}
            </button>
          </div>
        </div>

        <div className="desk" data-desk>
          <div className="desk__mat" aria-hidden="true" />
          <span className="desk__stain" aria-hidden="true" />

          <div className="scr" data-scr>
            <div className="term" data-term>
              <div className="term__bar">
                <span className="dots3"><i /><i /><i /></span>
                <span>{person.host}: ~</span>
              </div>
              <div className="term__body" data-lenis-prevent="">
                <div className="nf">
                  <pre className="nf__art" aria-hidden="true">{`   ___
   | |
   | |
  /   \\
 /_____\\  ✦`}</pre>
                  <div className="nf__info">
                    {about.neofetch.map(([k, v]) => (
                      <div className="nf__row" key={k}>
                        <span className="nf__k">{k}</span>
                        <span className="nf__v">{v}</span>
                      </div>
                    ))}
                    <div className="nf__sw">
                      {['#1e1420', '#8b5cf6', '#ffb8dc', '#ff4f9a', '#ff6b1a', '#12a150'].map((c) => (
                        <i key={c} style={{ ['--c' as string]: c }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="term__out" aria-live="polite" />
                <form className="term__line" data-term-form>
                  <span className="term__ps">{person.host}:~$</span>
                  <input aria-label="Terminal input" autoComplete="off" spellCheck={false} autoCapitalize="off" />
                </form>
              </div>
            </div>
          </div>

          <div className="dk dk--kbd" data-type="kbd" tabIndex={0} role="button" data-cursor="type" aria-label="Keyboard. Its keys type into the terminal.">
            <Keyboard />
          </div>

          <div className="dk dk--note dk--yellow" data-type="note" tabIndex={0} role="button" data-cursor="drag" aria-label="Sticky note">
            <b>TODO</b>
            {about.todo.map((t) => (
              <span key={t}>
                <br />
                {t}
              </span>
            ))}
          </div>

          <div className="dk dk--phone" data-type="phone" tabIndex={0} role="button" data-cursor="buzz" aria-label="Phone with notifications. Click for the next one.">
            <div className="ph">
              <span className="ph__isl" />
              <div className="ph__time">
                <small>{about.phoneHeader}</small>
                <b data-ph-time>9:41</b>
              </div>
              <ul className="ph__n" aria-live="polite">
                {about.phone.slice(0, 3).map((n, i) => (
                  <li data-game={n.key} key={i}>
                    <PhoneIcon k={n.key} />
                    <p>
                      <b>{n.app}</b>
                      <em>{n.when}</em>
                      <span>{n.text}</span>
                    </p>
                  </li>
                ))}
              </ul>
              <span className="ph__bar" />
            </div>
          </div>

          <div className="dk dk--badge" data-type="badge" tabIndex={0} role="button" data-cursor="streak" aria-label={about.badgeAria}>
            <div>
              <b>{about.badge[0]}</b>
              <span>{about.badge[1]}</span>
            </div>
          </div>

          <div
            className="dk dk--polaroid dk--wide"
            data-type="polaroid"
            tabIndex={0}
            role="button"
            data-full={person.photo}
            data-cap={about.polaroidMe}
            data-cursor="open"
            aria-label={`Photo: ${about.polaroidMe}`}
          >
            <img src={person.photo} alt="" loading="lazy" draggable={false} />
            <span>{about.polaroidMe}</span>
          </div>
          <div
            className="dk dk--polaroid dk--wide"
            data-type="polaroid"
            tabIndex={0}
            role="button"
            data-full={about.polaroidDeskSrc}
            data-cap={about.polaroidDesk}
            data-cursor="open"
            aria-label={`Photo: ${about.polaroidDesk}`}
          >
            <img src={about.polaroidDeskSrc} alt="" loading="lazy" draggable={false} />
            <span>{about.polaroidDesk}</span>
          </div>

          <div className="dk dk--card" data-type="card" tabIndex={0} role="button" data-cursor="copy" aria-label="Business card. Click to copy the email.">
            <b>{about.card[0]}</b>
            <span>
              {about.card[1]}
              <br />
              {about.card[2]}
            </span>
            <em>{person.email}</em>
          </div>

          <div className="dk dk--key" data-type="key" tabIndex={0} role="button" data-cursor="press" aria-label="Escape key">
            esc<em>least used key</em>
          </div>

          <div className="dk dk--chai" data-type="chai" tabIndex={0} role="button" data-cursor="sip" aria-label="Cup of chai">
            <svg viewBox="0 0 112 112">
              <defs>
                <radialGradient id="ch-s" cx=".42" cy=".38" r=".7"><stop offset="0" stopColor="#fffdf8" /><stop offset=".72" stopColor="#f1ebe0" /><stop offset="1" stopColor="#dcd3c3" /></radialGradient>
                <radialGradient id="ch-c" cx=".38" cy=".34" r=".8"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#e6dfd1" /></radialGradient>
                <radialGradient id="ch-t" cx=".42" cy=".4" r=".66"><stop offset="0" stopColor="#dcab76" /><stop offset=".62" stopColor="#bb7d40" /><stop offset="1" stopColor="#8e5625" /></radialGradient>
              </defs>
              <circle cx="54" cy="58" r="48" fill="url(#ch-s)" />
              <circle cx="54" cy="58" r="38" fill="none" stroke="#8c7350" strokeOpacity=".13" strokeWidth="2" />
              <path d="M86 50.5h8.5a8 8 0 0 1 0 16H86" fill="none" stroke="#ece5d8" strokeWidth="7" strokeLinecap="round" />
              <path d="M86 50.5h8.5a8 8 0 0 1 0 16H86" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".7" />
              <circle cx="54" cy="58" r="33" fill="url(#ch-c)" />
              <circle cx="54" cy="58" r="33" fill="none" stroke="#000" strokeOpacity=".07" />
              <circle cx="54" cy="58" r="27" fill="url(#ch-t)" data-chai-tea />
              <path d="M42 55c5-7 18-7 22 1s-6 12-12 8" fill="none" stroke="#f4dcbb" strokeWidth="2" strokeLinecap="round" opacity=".45" />
              <ellipse cx="45" cy="48" rx="8" ry="3.6" fill="#fff" opacity=".32" transform="rotate(-28 45 48)" />
              <g transform="rotate(-24 22 92)">
                <ellipse cx="22" cy="92" rx="6.5" ry="3.6" fill="#8faa5c" />
                <path d="M16.5 92h11" stroke="#6f8a40" strokeWidth="1" />
              </g>
              <g className="steam" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".85">
                <path d="M44 40c-4 5 4 8 0 14M56 36c-4 5 4 8 0 14M68 40c-4 5 4 8 0 14" />
              </g>
            </svg>
          </div>

          <div className="dk dk--frame" data-type="frame" tabIndex={0} role="button" data-cursor="yes, you too" aria-label={about.frame.aria}>
            <div className="fr__art">
              <code>{about.frame.code}</code>
              <b>{about.frame.b}</b>
              <p>{about.frame.p}</p>
            </div>
            <span className="fr__plate">{about.frame.plate}</span>
          </div>

          <div className="dk dk--plant" data-type="plant" tabIndex={0} role="button" data-cursor="water" aria-label="A succulent in a pot">
            <svg viewBox="0 0 120 120">
              <defs>
                <radialGradient id="pl-pot" cx=".38" cy=".32" r=".75"><stop offset="0" stopColor="#eba17a" /><stop offset=".7" stopColor="#c7683e" /><stop offset="1" stopColor="#a5502c" /></radialGradient>
                <linearGradient id="pl-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9d9a4" /><stop offset=".5" stopColor="#78ad7c" /><stop offset="1" stopColor="#3f7a55" /></linearGradient>
                <linearGradient id="pl-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfe6b6" /><stop offset="1" stopColor="#5f9a6c" /></linearGradient>
                <linearGradient id="pl-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e4f2cc" /><stop offset="1" stopColor="#7fb784" /></linearGradient>
              </defs>
              <circle cx="60" cy="60" r="52" fill="url(#pl-pot)" />
              <circle cx="60" cy="60" r="45" fill="#5a3e2b" />
              <circle cx="60" cy="60" r="45" fill="none" stroke="#3a2516" strokeOpacity=".5" strokeWidth="3" />
              <g fill="#efe9dc" opacity=".8">
                <circle cx="30" cy="70" r="1.6" /><circle cx="84" cy="40" r="1.3" /><circle cx="88" cy="76" r="1.5" /><circle cx="40" cy="32" r="1.2" /><circle cx="62" cy="96" r="1.4" />
              </g>
              <g className="pl__leaves" stroke="#2d5c3d" strokeOpacity=".28" strokeWidth=".8">
                <g fill="url(#pl-a)">
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => (
                    <path key={a} transform={`rotate(${a} 60 60)`} d="M60 60C45 45.7 51.8 24.7 60 19C68.3 24.7 75 45.7 60 60Z" />
                  ))}
                </g>
                <g fill="url(#pl-b)">
                  {[20, 65, 110, 155, 200, 245, 290, 335].map((a) => (
                    <path key={a} transform={`rotate(${a} 60 60)`} d="M60 60C47.5 49.2 53.1 33.3 60 29C66.9 33.3 72.5 49.2 60 60Z" />
                  ))}
                </g>
                <g fill="url(#pl-c)">
                  {[8, 68, 128, 188, 248, 308].map((a) => (
                    <path key={a} transform={`rotate(${a} 60 60)`} d="M60 60C50.5 53 54.8 42.8 60 40C65.2 42.8 69.5 53 60 60Z" />
                  ))}
                </g>
                <g fill="url(#pl-c)">
                  {[45, 135, 225, 315].map((a) => (
                    <path key={a} transform={`rotate(${a} 60 60)`} d="M60 60C54 56.2 56.7 50.5 60 49C63.3 50.5 66 56.2 60 60Z" />
                  ))}
                </g>
              </g>
            </svg>
          </div>

          <div className="dk dk--note dk--pink" data-type="note" tabIndex={0} role="button" data-cursor="drag" aria-label="Sticky note">
            {about.pinkNote[0]}
            <small>{about.pinkNote[1]}</small>
          </div>

          <div className="dk dk--nasa" data-type="patch" tabIndex={0} role="button" data-cursor="🏆" aria-label={`Patch: ${about.patch[0]}`}>
            <svg viewBox="0 0 130 130">
              <defs>
                <path id="pt-top" d="M21 65a44 44 0 0 1 88 0" />
                <path id="pt-bot" d="M13 65a52 52 0 0 0 104 0" />
              </defs>
              <circle cx="65" cy="65" r="63" fill="#f7f2e7" />
              <circle cx="65" cy="65" r="60.5" fill="none" stroke="#e2d9c6" strokeWidth="5" strokeDasharray="1.4 1.3" />
              <circle cx="65" cy="65" r="57" fill="#15306c" />
              <circle cx="65" cy="65" r="54" fill="none" stroke="#fff" strokeOpacity=".38" strokeDasharray="3 2.4" />
              <circle cx="65" cy="66" r="31" fill="#1f4ba8" />
              <circle cx="65" cy="66" r="31" fill="none" stroke="#0e2352" strokeOpacity=".5" strokeWidth="1.5" />
              <g fill="#fff">
                <circle cx="49" cy="52" r="1.2" /><circle cx="82" cy="80" r="1" /><circle cx="52" cy="84" r=".9" />
                <path d="M82 44l1.6 4.4 4.4 1.6-4.4 1.6L82 56l-1.6-4.4-4.4-1.6 4.4-1.6z" />
              </g>
              <path d="M56 54h18v8a9 9 0 0 1-18 0z" fill="#ffd166" />
              <path d="M56 56.5h-4.5a4.5 4.5 0 0 0 4.8 5M74 56.5h4.5a4.5 4.5 0 0 1-4.8 5" fill="none" stroke="#ffd166" strokeWidth="2.4" />
              <path d="M65 71v6M59 80h12" stroke="#ffd166" strokeWidth="3" strokeLinecap="round" />
              <text className="pt__t">
                <textPath href="#pt-top" startOffset="50%" textAnchor="middle">{about.patch[0]}</textPath>
              </text>
              <text className="pt__t">
                <textPath href="#pt-bot" startOffset="50%" textAnchor="middle">{about.patch[1]}</textPath>
              </text>
            </svg>
          </div>

          <div className="dk dk--controller" data-type="headphones" tabIndex={0} role="button" data-cursor="play" aria-label={about.headphonesAria}>
            <svg viewBox="0 0 150 96">
              <path d="M30 70V54a45 45 0 0 1 90 0v16" fill="none" stroke="#1d1d22" strokeWidth="9" strokeLinecap="round" />
              <path d="M34 52a41 41 0 0 1 82 0" fill="none" stroke="#3a3a44" strokeWidth="2.5" />
              <rect x="14" y="52" width="30" height="40" rx="13" fill="#1d1d22" />
              <rect x="106" y="52" width="30" height="40" rx="13" fill="#1d1d22" />
              <rect x="20" y="58" width="18" height="28" rx="9" fill="#ff4f9a" />
              <rect x="112" y="58" width="18" height="28" rx="9" fill="#ff4f9a" />
              <g className="hp__notes" fill="#8b5cf6">
                <circle cx="68" cy="44" r="4" /><rect x="71" y="26" width="2" height="18" /><path d="M71 26l9 3v4l-9-3z" />
              </g>
            </svg>
          </div>

          <div className="desk__sun" aria-hidden="true">
            <i className="desk__win" />
            <i className="desk__palm" />
          </div>
          <div className="desk__night" aria-hidden="true" />
          <span className="desk__glow" aria-hidden="true" />
          <button className="desk__lamp" type="button" data-desk-lamp data-cursor="click" aria-pressed="false" aria-label={about.lampAria}>
            <i />
          </button>
          <p className="desk__clock">
            <b data-desk-time>{about.time.day[0]}</b>
            <span data-desk-ampm>{about.time.day[1]}</span>
            <span aria-hidden="true">·</span>
            <span data-desk-mood>{about.mood.day}</span>
          </p>
          <p className="desk__status" aria-live="polite">
            <span>{about.deskStatus}</span>
            <span data-desk-status className="is-tidy">
              knolled ✓ · 0.0° tilt · 0px off grid
            </span>
          </p>
        </div>
      </div>

      <div className="wrap about__stack">
        <div className="about__stack-head">
          <h3 className="eyebrow">
            {about.stackTitle} {about.stackSerif}
          </h3>
          <p className="muted">{about.stackSub}</p>
        </div>
        <div className="skills">
          {about.stack.map((s) => (
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
      </div>
    </section>
  );
}
