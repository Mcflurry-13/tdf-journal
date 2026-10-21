// Quality → angle / light mapping. Copied from flower.ino (the source of truth),
// see INTEGRATION_NOTES.txt §2. Angles are nominal servo commands, not measurements.

export const CLOSED_DEG = 5;
export const OPEN_DEG = 165;
export const SPAN_DEG = OPEN_DEG - CLOSED_DEG; // 160
export const MOVE_MS = 3000;
export const HOLD_MS = 1500;

export type LightTier = 'yellow' | 'orange' | 'red';

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** smoothstep(t) = t²(3 − 2t), the firmware's interpolation. */
export const smoothstep = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

export const scoreFromQuality = (q: number) => q * 100;

/** peak = 5 + min(q / 0.60, 1) × 160. 39 → 109°, ≥ 60 → 165°. */
export const peakFromQuality = (q: number) => CLOSED_DEG + Math.min(clamp01(q) / 0.6, 1) * SPAN_DEG;

/** q < .33 yellow, q < .67 orange, otherwise red. */
export const tierFromQuality = (q: number): LightTier => (q < 0.33 ? 'yellow' : q < 0.67 ? 'orange' : 'red');

/** Visual openness of the petals, 0 closed … 1 fully open: (commandAngle − 5) / 160. */
export const visualOpen = (deg: number) => clamp01((deg - CLOSED_DEG) / SPAN_DEG);

/** Firmware light "opening": relative to *today's* peak, so the light is brightest at this
 *  run's maximum and off when closed. Zero span (score 0) → 0. */
export const lightOpening = (deg: number, peak: number) => {
  const span = peak - CLOSED_DEG;
  return span > 0 ? clamp01((deg - CLOSED_DEG) / span) : 0;
};

/** Firmware brightness total = round((16 + 35q) × opening²), max 51 at q = 1.
 *  Returned here as 0..1 of that maximum. The UI turns it into a glow; it is not a measured lux value. */
export const lightLevel = (deg: number, peak: number, q: number) => {
  const opening = lightOpening(deg, peak);
  return ((16 + 35 * clamp01(q)) * opening * opening) / 51;
};

export const TIER_LABEL: Record<LightTier, string> = {
  yellow: 'Yellow light',
  orange: 'Orange light',
  red: 'Red light',
};
