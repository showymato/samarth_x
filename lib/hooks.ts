'use client';
// Small hooks shared by the interactive #start and #pricing previews. No dependencies.
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const RM = '(prefers-reduced-motion: reduce)';
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(RM);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(RM).matches,
    () => false,
  );
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animates a number towards `target`. A new target retargets from the current value (never queues). */
export function useTween(target: number, ms = 600) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    if (reduce || ms <= 0) {
      cur.current = target;
      setV(target);
      return;
    }
    const from = cur.current;
    if (from === target) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      cur.current = from + (target - from) * easeOut(k);
      setV(cur.current);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, reduce]);
  return v;
}

/** true once the element has entered the viewport (entrance animations run once, then stay put). */
export function useInViewOnce<T extends Element>(margin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, margin]);
  return [ref, seen] as const;
}

/** setTimeout that is cleared on unmount and whenever a new sequence starts. */
export function useSequence() {
  const ids = useRef<number[]>([]);
  useEffect(() => () => ids.current.forEach(clearTimeout), []);
  return {
    clear() {
      ids.current.forEach(clearTimeout);
      ids.current = [];
    },
    at(ms: number, fn: () => void) {
      ids.current.push(window.setTimeout(fn, ms));
    },
  };
}

export const inrFmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
