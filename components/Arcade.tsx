// "The arcade": four tiny playable games in the play section. Logic lives in lib/behaviors/arcade.ts
import { play } from '@/lib/content';

const Bug = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <g fill="none" stroke="#1d1d1b" strokeWidth="2" strokeLinecap="round">
      <path d="M13 14 7 10M27 14l6-4M12 21H5M28 21h7M13 28l-6 4M27 28l6 4M16 9l-2-4M24 9l2-4" />
    </g>
    <ellipse cx="20" cy="22" rx="9" ry="11" fill="#ff3b30" stroke="#1d1d1b" strokeWidth="2" />
    <path d="M20 11v22" stroke="#1d1d1b" strokeWidth="2" />
    <circle cx="20" cy="11" r="5" fill="#1d1d1b" />
    <circle cx="16" cy="19" r="2" fill="#1d1d1b" />
    <circle cx="24" cy="25" r="2" fill="#1d1d1b" />
  </svg>
);

function Card({
  id,
  accent,
  title,
  tag,
  hint,
  children,
}: {
  id: string;
  accent: string;
  title: string;
  tag: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <article className="game" data-game={id} style={{ ['--accent' as string]: accent }}>
      <header className="game__top">
        <div>
          <span className="game__tag">{tag}</span>
          <h4 className="game__title">{title}</h4>
        </div>
        <dl className="game__score">
          <div>
            <dt>score</dt>
            <dd data-score>0</dd>
          </div>
          <div>
            <dt>best</dt>
            <dd data-best>0</dd>
          </div>
        </dl>
      </header>
      <div className="game__stage">{children}</div>
      <footer className="game__foot">
        <p className="game__hint" data-hint>
          {hint}
        </p>
        <button className="game__btn" type="button" data-start data-cursor="play">
          play
        </button>
      </footer>
    </article>
  );
}

export default function Arcade() {
  return (
    <div className="wrap arc" id="arcade">
      <div className="arc__head">
        <h3 className="eyebrow">{play.arcadeTitle}</h3>
        <p>{play.arcadeHead}</p>
      </div>
      <div className="arc__grid">
        <Card id="bugs" accent="#ff4f9a" tag="20 seconds" title="whack-a-distraction" hint="squash the distractions before they eat your evening.">
          <div className="wb" data-wb>
            {Array.from({ length: 9 }, (_, i) => (
              <button className="wb__hole" type="button" key={i} data-cursor="squash" aria-label="hole">
                <span className="wb__bug">
                  <Bug />
                </span>
              </button>
            ))}
            <span className="wb__time" data-time>
              20.0s
            </span>
          </div>
        </Card>

        <Card id="memory" accent="#f5c400" tag="lab kit" title="memory match" hint="find all six pairs in as few moves as you can.">
          <div className="mm" data-mm />
        </Card>

        <Card id="guess" accent="#8b5cf6" tag="integer-type question" title="guess the answer" hint="the answer is an integer from 1 to 100. 7 tries. no negative marking.">
          <div className="ng" data-ng>
            <div className="ng__bar">
              <span className="dots3">
                <i />
                <i />
                <i />
              </span>
              <span>integer_q.py</span>
            </div>
            <div className="ng__out" data-ng-out />
            <form className="ng__line" data-ng-form>
              <span>&gt;&gt;&gt;</span>
              <input inputMode="numeric" autoComplete="off" placeholder="type a number" aria-label="Your guess" disabled />
            </form>
          </div>
        </Card>

        <Card id="dodge" accent="#ff6b1a" tag="arrow keys · or tap left/right" title="focus lane" hint="dodge the cones. they’re distractions. it only gets faster.">
          <canvas className="rd" data-rd width="520" height="420" aria-label="Focus lane: a dodging game" />
        </Card>
      </div>
    </div>
  );
}
