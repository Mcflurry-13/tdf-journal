// Motion timeline for the illustration. Reproduces the firmware's command sequence
// (INTEGRATION_NOTES.txt §2) so the drawing and its status words come from one clock.
//   H / display: 3 s smoothstep to peak, then hold.
//   S / breathe: 3 s to 5°, 1.5 s pause, then loop: open 3 s, hold 1.5 s, close 3 s, rest 1.5 s.
//   Breathe receives peak 165° regardless of quality; Hold uses the forecast peak.
//   X / off: motion stops where it is; the petals are NOT assumed to close.

import { CLOSED_DEG, HOLD_MS, MOVE_MS, smoothstep } from './mapping';

export type Phase = 'opening' | 'holding' | 'closing' | 'resting' | 'closed' | 'stopped';

export interface MotionPlan {
  mode: 'display' | 'breathe' | 'off';
  /** Illustrated angle when this plan started (where the previous plan left the petals). */
  fromDeg: number;
  peakDeg: number;
  startMs: number;
  firmwareLeadIn?: boolean;
}

export interface MotionSample {
  deg: number;
  phase: Phase;
}

const AT_REST = 0.5; // degrees; closer than this counts as "already there"
const CYCLE_MS = 2 * MOVE_MS + 2 * HOLD_MS; // 9 s

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function moveSample(from: number, to: number, t: number): MotionSample {
  const deg = lerp(from, to, smoothstep(t));
  if (Math.abs(to - from) < AT_REST) return { deg: to, phase: to <= CLOSED_DEG + AT_REST ? 'closed' : 'holding' };
  return { deg, phase: to > from ? 'opening' : 'closing' };
}

export function sampleMotion(plan: MotionPlan, nowMs: number): MotionSample {
  const elapsed = Math.max(0, nowMs - plan.startMs);
  const { fromDeg, peakDeg } = plan;

  if (plan.mode === 'off') return { deg: fromDeg, phase: 'stopped' };

  if (plan.mode === 'display') {
    if (elapsed < MOVE_MS && Math.abs(peakDeg - fromDeg) >= AT_REST) {
      return moveSample(fromDeg, peakDeg, elapsed / MOVE_MS);
    }
    return { deg: peakDeg, phase: peakDeg <= CLOSED_DEG + AT_REST ? 'closed' : 'holding' };
  }

  // breathe — first return to 5° (skipped when already closed), pause, then loop.
  const needsClose = plan.firmwareLeadIn || fromDeg - CLOSED_DEG >= AT_REST;
  const leadIn = (needsClose ? MOVE_MS : 0) + HOLD_MS;
  if (elapsed < leadIn) {
    if (needsClose && elapsed < MOVE_MS) return moveSample(fromDeg, CLOSED_DEG, elapsed / MOVE_MS);
    return { deg: CLOSED_DEG, phase: peakDeg <= CLOSED_DEG + AT_REST ? 'closed' : 'resting' };
  }
  if (peakDeg <= CLOSED_DEG + AT_REST) return { deg: CLOSED_DEG, phase: 'closed' };

  const t = (elapsed - leadIn) % CYCLE_MS;
  if (t < MOVE_MS) return { deg: lerp(CLOSED_DEG, peakDeg, smoothstep(t / MOVE_MS)), phase: 'opening' };
  if (t < MOVE_MS + HOLD_MS) return { deg: peakDeg, phase: 'holding' };
  if (t < 2 * MOVE_MS + HOLD_MS) {
    return { deg: lerp(peakDeg, CLOSED_DEG, smoothstep((t - MOVE_MS - HOLD_MS) / MOVE_MS)), phase: 'closing' };
  }
  return { deg: CLOSED_DEG, phase: 'resting' };
}

/** Static pose for prefers-reduced-motion: the pose the mode settles into or is about. */
export function reducedMotionSample(mode: MotionPlan['mode'], peakDeg: number, currentDeg: number): MotionSample {
  if (mode === 'off') return { deg: currentDeg, phase: 'stopped' };
  if (peakDeg <= CLOSED_DEG + AT_REST) return { deg: CLOSED_DEG, phase: 'closed' };
  return { deg: peakDeg, phase: 'holding' };
}
