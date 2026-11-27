import { loader, play } from '@/lib/content';

/** Halftone "DPI" loading screen. Animated by lib/behaviors/loader.ts */
export default function Loader() {
  const n = play.tiles.length;
  return (
    <div className="ld is-ink" aria-hidden="true">
      <canvas className="ld__cv" />
      <div className="ld__bar">
        <span className="ld__dpi">
          <b data-ld-dpi>{String(loader.steps[0][0]).padStart(3, '0')}</b> DPI
        </span>
        <span className="ld__msg" data-ld-msg>
          {loader.steps[0][1]}
        </span>
        <span className="ld__count">
          {loader.counterLabel}{' '}
          <b data-ld-count>
            0/{n}
          </b>
        </span>
      </div>
    </div>
  );
}
