import { loader, brand } from '@/lib/content';

/**
 * Opening sequence, "find your way". Animated by lib/behaviors/loader.ts, styled in app/loader.css.
 * Server-rendered: the paper and the corner labels, so the page never flashes before JS runs.
 * Built at runtime (they need the hero's measurements): the two paths and the wordmark copy.
 */
export default function Loader() {
  return (
    <div className="ld">
      <div className="ld__bg" aria-hidden="true" />
      <svg className="ld__paths" data-ld-paths aria-hidden="true">
        <circle className="ld__iris" data-ld-iris r="0" />
        <path className="ld__path ld__path--mentor" data-ld-b strokeWidth={1.6} />
        <path className="ld__path ld__path--you" data-ld-a strokeWidth={2.2} />
      </svg>
      <div className="ld__word" data-ld-word aria-hidden="true" />
      <p className="ld__tag" data-ld-tag aria-hidden="true">
        {loader.tagline.map((t) => (
          <span className="ld__m" key={t}>
            <span>
              {t.replace(/\.$/, '')}
              <b>.</b>
            </span>
          </span>
        ))}
      </p>
      <p className="ld__c ld__c--tl" aria-hidden="true">
        <span>{brand.name}</span> <i>/</i> {loader.line}
      </p>
      <p className="ld__c ld__c--br" role="status">
        <i className="ld__pulse" aria-hidden="true" />
        <span data-ld-status>{loader.status.loading}</span>
      </p>
      <button className="ld__enter" type="button" data-ld-enter tabIndex={-1}>
        {loader.enter} →
      </button>
    </div>
  );
}
