import type { FlowerState } from '../domain/types';
import { useEffect, useRef, useState } from 'react';
import { CLOSED_DEG, lightOpening, tierFromQuality, visualOpen } from '../domain/mapping';
import { reducedMotionSample, sampleMotion, type MotionPlan, type MotionSample, type Phase } from '../domain/motion';
import { FlowerFigure } from './FlowerFigure';

export interface FlowerStageProps {
  /** Mode the illustration follows (preview selection, or the device-confirmed mode). Null = no valid forecast. */
  mode: MotionPlan['mode'] | null;
  peakDeg: number | null;
  quality: number | null;
  reducedMotion: boolean;
  timeline?: FlowerState['motion']['timeline'];
  onPhaseChange?: (phase: Phase | null) => void;
}

/** Glow for the drawing: firmware opening² (relative to today's peak), scaled a little by the
 *  firmware's quality-dependent maximum (16 + 35q of 51). An aesthetic reading, not a light measurement. */
function glowFor(deg: number, peak: number, q: number) {
  const o = lightOpening(deg, peak);
  return o * o * (0.45 + 0.55 * ((16 + 35 * q) / 51));
}

export function FlowerStage({ mode, peakDeg, quality, reducedMotion, onPhaseChange, timeline }: FlowerStageProps) {
  const degRef = useRef(CLOSED_DEG);
  const planRef = useRef<MotionPlan | null>(null);
  const [sample, setSample] = useState<MotionSample>({ deg: CLOSED_DEG, phase: 'closed' });
  const phaseRef = useRef<Phase | null>(null);
  const reportRef = useRef(onPhaseChange);
  reportRef.current = onPhaseChange;

  const active = mode !== null && peakDeg !== null && quality !== null;

  // A new plan starts from wherever the petals are drawn right now.
  useEffect(() => {
    if (!active) {
      planRef.current = null;
      return;
    }
    planRef.current = timeline ? { mode: mode!, fromDeg: timeline.fromDeg, peakDeg: timeline.peakDeg, startMs: performance.now() - timeline.elapsedMs, firmwareLeadIn: true } : { mode: mode!, fromDeg: degRef.current, peakDeg: peakDeg!, startMs: performance.now() };
  }, [active, mode, peakDeg, timeline?.id]);

  useEffect(() => {
    const report = (s: MotionSample | null) => {
      const p = s ? s.phase : null;
      if (p !== phaseRef.current) {
        phaseRef.current = p;
        reportRef.current?.(p);
      }
    };

    if (!active) {
      report(null);
      return;
    }

    if (reducedMotion) {
      const s = reducedMotionSample(mode!, peakDeg!, degRef.current);
      degRef.current = s.deg;
      setSample(s);
      report(s);
      return;
    }

    let raf = 0;
    const update = (now: number) => {
      const plan = planRef.current;
      if (!plan) return;
      const s = sampleMotion(plan, now);
      degRef.current = s.deg;
      setSample((prev) => (prev.deg === s.deg && prev.phase === s.phase ? prev : s));
      report(s);
    };
    const tick = (now: number) => {
      update(now);
      raf = requestAnimationFrame(tick);
    };
    // Pose and status are correct from the first paint, even before (or without) animation frames.
    update(performance.now());
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, mode, peakDeg, reducedMotion, timeline?.id]);

  if (!active) {
    return <FlowerFigure className="flower-svg" open={0.32} light={0} tier="orange" variant="ghost" />;
  }

  const light = mode === 'off' ? 0 : glowFor(sample.deg, peakDeg!, quality!);
  return (
    <FlowerFigure
      className="flower-svg"
      open={visualOpen(sample.deg)}
      light={light}
      tier={tierFromQuality(quality!)}
    />
  );
}
