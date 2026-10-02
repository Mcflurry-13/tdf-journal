/** Minimal path router — no dependency. Hash links (#entry) stay native. */
import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function currentPath() {
  const p = window.location.pathname;
  return (p.startsWith(BASE) ? p.slice(BASE.length) : p) || '/';
}

export function usePath() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return path;
}

export function navigate(to: string) {
  window.history.pushState(null, '', BASE + to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={BASE + to} onClick={handle} {...rest} />;
}
