export const LA_TIMEZONE = 'America/Los_Angeles';

/** Format a forecast calendar date (YYYY-MM-DD, already a Los Angeles date) without letting
 *  the browser's own timezone shift it. `new Date('2026-10-15')` would be UTC midnight and
 *  show as Oct 14 in California, so the date is pinned to noon UTC and formatted in UTC. */
export function formatForecastDate(isoDate: string | null): string | null {
  if (!isoDate) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/** Today's calendar date in Berkeley. Only meaningful for live data; sample data is never re-dated. */
export function todayInLosAngeles(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: LA_TIMEZONE }).format(now);
}
