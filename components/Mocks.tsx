// "Live mocks": small HTML recreations of app screens (sample data), animated in lib/behaviors/mocks.ts

export function MockMentor() {
  return (
    <div className="mock mock--mentor" data-mock="mentor">
      <div className="mwin">
        <div className="mwin__bar">
          <span className="dots3"><i /><i /><i /></span>
          <span>#my-mentor · 1:1 chat</span>
        </div>
        <div className="mwin__body">
          <div className="sl-msg">
            <span className="sl-av sl-av--a">M</span>
            <div>
              <b>Your mentor</b>
              <p>how did sunday’s mock go? no judgement.</p>
            </div>
          </div>
          <div className="sl-msg sl-msg--me">
            <span className="sl-av sl-av--me">ME</span>
            <div>
              <b>You</b>
              <p className="sl-out">
                <span className="sl-raw">umm physics was ok but i left organic for “later” and later never came</span>
                <span className="sl-clean">214/300. Organic needs work. 1:1 at 7 pm, plan updated.</span>
                <span className="caret" />
              </p>
            </div>
          </div>
        </div>
        <div className="mwin__input">Message your mentor</div>
      </div>
      <div className="sr-pill">
        <span className="sr-pill__mic">
          <svg viewBox="0 0 24 24">
            <rect x="8.5" y="3" width="7" height="11.5" rx="3.5" />
            <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="sr-wave">
          {Array.from({ length: 14 }, (_, i) => <i key={i} />)}
        </span>
        <span className="sr-pill__k">
          hold <kbd>●</kbd> to ask a doubt
        </span>
      </div>
      <div className="sr-tag">
        next 1:1 <b>7 pm</b>
      </div>
    </div>
  );
}

export function MockParents() {
  return (
    <div className="mock mock--web" data-mock="parents">
      <div className="bw">
        <div className="bw__bar">
          <span className="dots3"><i /><i /><i /></span>
          <span className="bw__url">
            <svg viewBox="0 0 16 16">
              <path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <rect x="3" y="7" width="10" height="7" rx="2" />
            </svg>
            <span className="bw__url-t">parent-app/home</span>
          </span>
        </div>
        <div className="bw__page">
          <div className="bw__logo" />
          <div className="bw__search">
            <span className="bw__q" />
            <span className="caret" />
          </div>
          <ul className="bw__res">
            <li>
              <i />
              <span>
                <b>Aarav · this week</b>
                <em>31h studied · attendance 96% · mock 214/300 ↑18</em>
              </span>
            </li>
            <li>
              <i />
              <span>
                <b>Mentor note</b>
                <em>organic needs 2 more DPPs. on it.</em>
              </span>
            </li>
            <li>
              <i />
              <span>
                <b>Alerts</b>
                <em>none this week · streak: 42 days</em>
              </span>
            </li>
          </ul>
        </div>
        <div className="bw__cursor">
          <svg viewBox="0 0 24 24">
            <path d="M5 3l14 8-6.2 1.6L9.6 19z" fill="#7b5cff" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <span className="bw__ripple" />
          <span className="bw__tag">parent</span>
        </div>
      </div>
      <div className="bw-term">
        <div className="bw-term__bar">parent app · sample data</div>
        <ol className="bw-term__log">
          <li><span>›</span> open <q>dashboard</q> <b>✓</b></li>
          <li><span>›</span> click <q>[search] reports</q> <b>✓</b></li>
          <li><span>›</span> type <q>&quot;this week&quot;</q> <b>✓</b></li>
          <li><span>›</span> open <q>[report] Aarav</q> <b>✓</b></li>
        </ol>
      </div>
    </div>
  );
}

export function MockScore() {
  return (
    <div className="mock mock--score" data-mock="score">
      <div className="rf">
        <div className="rf__head">
          <span className="rf__id">Sunday mock · #14 · sample</span>
          <span className="rf__st" data-st>grading</span>
        </div>
        <div className="rf__amt">
          <small>Σ</small>
          <span data-amt>214/300</span>
        </div>
        <div className="rf__meta">
          <span>phy 78</span>
          <span>chem 61</span>
          <span>maths 75</span>
        </div>
      </div>
      <ol className="rf-steps">
        <li><i /><div><b>Paper submitted</b><span>auto-graded · 90 questions</span></div></li>
        <li><i /><div><b>Chapter heatmap</b><span>mechanics green · organic red</span></div></li>
        <li><i /><div><b>Silly mistakes: 7</b><span>−28 marks · all fixable</span></div></li>
        <li><i /><div><b>Time analysis</b><span>41% of time on 12% of marks</span></div></li>
        <li><i /><div><b>Predicted percentile</b><span>97.1 · higher once the 7 are fixed</span></div></li>
      </ol>
    </div>
  );
}

export function MockFlight() {
  return (
    <div className="mock mock--map" data-mock="flight">
      <div className="cw">
        <div className="cw__bar">
          <span className="cw__live"><i />live</span>
          <span>Olympiad roadmap · stages</span>
          <span className="cw__t">10:00</span>
        </div>
        <svg className="cw__map" viewBox="0 0 360 214" aria-hidden="true">
          <defs>
            <pattern id="cw-grid" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M12 0H0V12" fill="none" stroke="#e7e4da" strokeWidth=".6" />
            </pattern>
          </defs>
          <rect width="360" height="214" fill="url(#cw-grid)" />
          <path className="cw__walk" d="M34 107H118" />
          <path className="cw__walk" d="M150 96 C190 70 220 58 262 52" />
          <path className="cw__walk" d="M150 118 C190 144 220 156 262 162" />
          <path id="cw-p1" className="cw__route" d="M34 107H134C176 84 214 60 280 52" />
          <path id="cw-p2" className="cw__route cw__route--alt" d="M34 107H134C176 130 214 154 280 162" />
          <g className="cw__zone" transform="translate(18 92)"><rect width="30" height="30" rx="9" /><text x="15" y="19.5">S</text></g>
          <g className="cw__zone cw__zone--big" transform="translate(112 82)"><rect width="46" height="50" rx="12" /><text x="23" y="29">1</text></g>
          <g className="cw__zone cw__zone--watch" data-zone transform="translate(186 50)"><rect width="34" height="30" rx="9" /><text x="17" y="19.5" data-los>2</text></g>
          <g className="cw__zone" transform="translate(266 30)"><rect width="56" height="44" rx="12" /><text x="28" y="26">3</text></g>
          <g className="cw__zone cw__zone--alt" transform="translate(186 136)"><rect width="34" height="30" rx="9" /><text x="17" y="19.5">2b</text></g>
          <g className="cw__zone" transform="translate(266 140)"><rect width="56" height="44" rx="12" /><text x="28" y="26">3b</text></g>
          <g className="cw__dots cw__dots--a">{Array.from({ length: 8 }, (_, i) => <circle r="3.2" key={i} />)}</g>
          <g className="cw__dots cw__dots--b">{Array.from({ length: 8 }, (_, i) => <circle r="3.2" key={i} />)}</g>
        </svg>
        <div className="cw__alert" data-state="ok">
          <span className="cw__msg">✓ on track · stage 1 → 2 → 3 · weakest topic C</span>
        </div>
        <ol className="cw__los">
          {[['#12a150', 'A'], ['#7cc242', 'B'], ['#f2c230', 'C'], ['#ff9a1f', 'D'], ['#ff6b1a', 'E'], ['#ff3b30', 'F']].map(([c, l]) => (
            <li key={l} style={{ ['--c' as string]: c }}>{l}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function MockChat() {
  return (
    <div className="mock mock--chat" data-mock="chat">
      <div className="tc">
        <aside className="tc__side">
          <div className="tc__me">NEET drills</div>
          <ul>
            <li className="is-on">
              <span className="tc__av" style={{ ['--c' as string]: '#7b5cff' }}>B<i className="on" /></span>
              <span><b>Biology</b><em>thinking…</em></span>
            </li>
            <li>
              <span className="tc__av" style={{ ['--c' as string]: '#ff6b1a' }}>C<i className="on" /></span>
              <span><b>Chemistry</b><em>NCERT p.142 😬</em></span>
              <span className="tc__badge">3</span>
            </li>
            <li>
              <span className="tc__av" style={{ ['--c' as string]: '#12a150' }}>P<i /></span>
              <span><b>Physics</b><em>seen</em></span>
            </li>
          </ul>
        </aside>
        <div className="tc__main">
          <div className="tc__msgs">
            <p className="tc__b tc__b--in">which organelle is the cell’s “suicide bag”?</p>
            <p className="tc__b tc__b--out">mitochondria</p>
            <p className="tc__b tc__b--in tc__b--new">
              close. lysosomes. NCERT XI, ch 8.<span className="tc__react">😂</span>
            </p>
            <p className="tc__typing"><span className="dots3"><i /><i /><i /></span></p>
          </div>
          <div className="tc__input">Type your answer</div>
        </div>
      </div>
    </div>
  );
}

export function MockEditor() {
  return (
    <div className="mock mock--editor" data-mock="editor">
      <div className="ed">
        <div className="ed__tabs">
          <span className="is-on">dpp_14_q3.md</span>
          <span>error_log.md</span>
          <span className="ed__users">
            <i style={{ ['--c' as string]: '#ff4f9a' }}>Y</i>
            <i style={{ ['--c' as string]: '#8b5cf6' }}>M</i>
          </span>
        </div>
        <pre className="ed__code">
          <code>
            <span className="ln">1</span><span className="k">#</span> DPP 14 · Q3 · rotation{'\n'}
            <span className="ln">2</span>given: disc, mass <span className="f">M</span>, radius <span className="f">R</span>, force <span className="f">F</span> at rim{'\n'}
            <span className="ln">3</span><span className="f">τ</span> = F · R{'\n'}
            <span className="ln">4</span><span className="f">I</span> = <span className="s">½</span> · M · R²<span className="cur cur--b" data-name="mentor" />{'\n'}
            <span className="ln">5</span><span className="f">α</span> = τ / I{'\n'}
            <span className="ln">6</span>{'  '}<span className="ghost">= <span className="s">2</span>F / (M · R)  <span className="k">✓ units: rad/s²</span></span><span className="cur cur--a" data-name="you" />{'\n'}
            <span className="ln">7</span>{'\n'}
            <span className="ln">8</span><span className="k">#</span> error log: forgot the <span className="s">½</span>. again.
          </code>
        </pre>
        <div className="ed__ai">
          <b>✦ mentor hint</b> next step · press <kbd>Tab</kbd>
        </div>
      </div>
    </div>
  );
}
