import { TIER_LABEL, type LightTier } from '../domain/mapping';
import type { Phase } from '../domain/motion';
import type { FlowerMode, ForecastStatus } from '../domain/types';

interface FlowerStatusProps {
  phase: Phase | null;
  mode: FlowerMode | null;
  peakDeg: number | null;
  tier: LightTier | null;
  forecastStatus: ForecastStatus | 'error';
  reducedMotion: boolean;
}

const WORD: Record<Phase, string> = {
  opening: 'Opening',
  holding: 'Holding',
  closing: 'Closing',
  resting: 'Resting',
  closed: 'Closed',
  stopped: 'Stopped',
};

/** Status words come only from the animation's own phase, never from a timer of their own. */
export function FlowerStatus({ phase, mode, peakDeg, tier, forecastStatus, reducedMotion }: FlowerStatusProps) {
  const peak = peakDeg !== null ? Math.round(peakDeg) : null;
  const light = tier ? TIER_LABEL[tier].toLowerCase() : 'light';
  let word: string;
  let line: string;

  if (peak === null || phase === null) {
    word = 'Waiting';
    line =
      forecastStatus === 'loading'
        ? 'Loading the forecast…'
        : forecastStatus === 'stale'
          ? 'The last forecast has expired. Waiting for today’s.'
          : forecastStatus === 'error'
            ? 'No forecast could be read, so nothing is shown.'
            : 'No forecast yet, so the flower stays still.';
  } else if (reducedMotion && mode === 'breathe' && phase !== 'closed') {
    word = 'Breathing';
    line = `Opens to ${peak}° and closes every 9 s. Shown still for reduced motion.`;
  } else {
    word = WORD[phase];
    switch (phase) {
      case 'opening':
        line = `Opening toward ${peak}° · light rising`;
        break;
      case 'holding':
        line = mode === 'display' ? `Held at ${peak}° · ${light} steady` : `At ${peak}° · ${light} at its brightest`;
        break;
      case 'closing':
        line = 'Closing toward 5° · light fading';
        break;
      case 'resting':
        line = 'Closed at 5° · light off, about to open';
        break;
      case 'closed':
        line = 'Score 0 · the flower stays closed and unlit';
        break;
      case 'stopped':
        line = 'Light off · petals stay where they stopped';
        break;
    }
  }

  const summary =
    peak === null
      ? 'No forecast. Flower illustration at rest.'
      : mode === 'off'
        ? 'Stopped. Light off.'
        : mode === 'display'
          ? `Hold: opens to ${peak} degrees and stays lit.`
          : `Breathe: opens to ${peak} degrees and closes in a loop.`;

  return (
    <div className="flower-status">
      <p className="eyebrow">Motion illustration</p>
      <p className="phase" aria-hidden="true">
        <span className="phase-word" key={word}>
          {word}
        </span>
      </p>
      <p className="phase-line" aria-hidden="true" key={line}>
        <span className="phase-dot" aria-hidden="true" />{line}
      </p>
      <p className="sr-only" aria-live="polite">
        {summary}
      </p>
    </div>
  );
}
