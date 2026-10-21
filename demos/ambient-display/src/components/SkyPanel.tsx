import { formatForecastDate } from '../domain/date';
import type { FlowerState, ScenarioInfo } from '../domain/types';

interface SkyPanelProps {
  state: FlowerState | null;
  /** Adapter or load failure: shown as its own state, never as a score. */
  loadError: string | null;
  scenario?: ScenarioInfo;
}

function scoreText(score: number) {
  return String(Math.round(score));
}

export function SkyPanel({ state, loadError, scenario }: SkyPanelProps) {
  const f = state?.forecast;
  const status = loadError ? 'error' : (f?.status ?? 'loading');
  const date = formatForecastDate(f?.date ?? null);
  const place = state?.location.name.split(',')[0] ?? 'Berkeley';
  const hasScore = (status === 'sample' || status === 'current' || status === 'stale') && f?.score != null;
  const imageSrc = state?.image.src;

  let meta: string;
  let chip: string | null = null;
  switch (status) {
    case 'sample':
      meta = [place, date].filter(Boolean).join(' · ');
      chip = scenario?.id === 'quality' ? scenario.label : 'Sample forecast';
      break;
    case 'current':
      meta = [place, date].filter(Boolean).join(' · ');
      break;
    case 'stale':
      meta = `${place} · last forecast, not today's`;
      chip = date ? `Expired · ${date}` : 'Expired';
      break;
    case 'loading':
      meta = 'Loading forecast…';
      break;
    case 'absent':
      meta = 'No forecast available';
      break;
    default:
      meta = 'Forecast unavailable';
  }

  return (
    <figure className="sky" data-status={status}>
      <div className="sky-frame">
        {imageSrc && (
          <img
            src={imageSrc}
            alt="AI-edited illustration of a muted sunset over the bay, with the Berkeley Campanile on the right."
            width={2022}
            height={778}
            decoding="async"
          />
        )}
        <div className="sky-scrim" aria-hidden="true" />
        <div className="sky-text">
          <p className="sky-eyebrow">Sunset quality</p>
          {hasScore ? (
            <p className="sky-score" aria-label={`Sunset quality ${scoreText(f!.score!)} out of 100`}>
              <span className="sky-score-num">{scoreText(f!.score!)}</span>
              <span className="sky-score-max">/100</span>
            </p>
          ) : (
            <p className="sky-score sky-score--empty" aria-label="No score">
              <span className="sky-score-num">—</span>
            </p>
          )}
          <p className="sky-meta">{meta}</p>
          {status === 'error' && <p className="sky-note">This is not a score of 0.</p>}
          {chip && <p className="sky-chip">{chip}</p>}
        </div>
      </div>

    </figure>
  );
}
