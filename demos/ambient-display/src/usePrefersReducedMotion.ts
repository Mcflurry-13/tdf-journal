import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** OS setting, or ?motion=reduce to check the reduced state without changing system settings. */
export function usePrefersReducedMotion(): boolean {
  const forced = new URLSearchParams(window.location.search).get('motion') === 'reduce';
  const [reduced, setReduced] = useState(() => forced || window.matchMedia(QUERY).matches);

  useEffect(() => {
    if (forced) return;
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [forced]);

  return reduced;
}
