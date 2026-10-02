const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isKnownDate(d: string | undefined): d is string {
  return !!d && ISO_DATE.test(d);
}

/** 2026-10-14 → 2026.10.14, unknown → null */
export function formatDate(d: string | undefined): string | null {
  return isKnownDate(d) ? d.replace(/-/g, '.') : null;
}

/** 2026-10-14 → 10.14, unknown → null */
export function formatShortDate(d: string | undefined): string | null {
  return isKnownDate(d) ? d.slice(5).replace('-', '.') : null;
}

/** Week range. Same year: 2026.10.12 – 10.18. Any unknown end: “Dates TBC”. */
export function formatRange(start: string, end: string): string {
  if (!isKnownDate(start) || !isKnownDate(end)) return 'Dates TBC';
  if (start.slice(0, 4) === end.slice(0, 4)) return `${formatDate(start)} – ${formatShortDate(end)}`;
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  );
}

/** Absolute URL for print output. */
export function absoluteUrl(url: string): string {
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return url;
  }
}
