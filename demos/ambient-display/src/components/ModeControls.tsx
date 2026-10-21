import type { FlowerMode, FlowerState } from '../domain/types';

interface ModeControlsProps {
  state: FlowerState | null;
  /** True when there is a valid forecast the modes can use. */
  available: boolean;
  peakDeg: number | null;
  score: number | null;
  /** Dev scenario label for a simulated device, if any. */
  deviceLabel?: string;
  /** The adapter could not provide state at all. */
  loadError?: string | null;
  onSelect: (mode: 'display' | 'breathe') => void;
  onStop: () => void;
  onReconnect?: () => void;
}

const MODE_NAME: Record<FlowerMode, string> = { display: 'Hold', breathe: 'Breathe', off: 'Stop' };

function CheckMark() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M2.6 6.3 5 8.6l4.4-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ModeControls({ state, available, peakDeg, score, deviceLabel, loadError, onSelect, onStop, onReconnect }: ModeControlsProps) {
  const preview = !state || state.device.status === 'preview';
  const m = state?.mode;
  // What is actually running: the preview selection, or the device-confirmed mode (pending shows the request).
  const shown: FlowerMode | null = preview ? (m?.preview ?? null) : m?.pending ? (m.desired ?? null) : (m?.confirmed ?? null);
  const pendingTarget = !preview && m?.pending ? m.desired : null;
  const failed = !preview && !!m?.error && !m.pending;
  const peak = peakDeg !== null ? Math.round(peakDeg) : null;

  const holdDesc = !available
    ? 'Displays the recorded sunset quality as a still flower. Waiting for the recorded forecast.'
    : `Holds at ${peak}° to display the recorded sunset quality of ${score !== null ? Math.round(score) : '—'}/100.`;
  const breatheDesc = 'Sweeps from 5° to a reduced 150° opening to ease strain on the linkage. A slow 9-second cycle, independent of the sunset score.';

  const cards = [
    { mode: 'display' as const, title: 'Hold', desc: holdDesc },
    { mode: 'breathe' as const, title: 'Breathe', desc: breatheDesc },
  ];

  let statusTitle: string;
  let statusText: string;
  let tone: 'preview' | 'pending' | 'ok' | 'error' = 'preview';
  if (loadError) {
    tone = 'error';
    statusTitle = 'Not connected';
    statusText = loadError;
  } else if (state?.device.reconnecting) {
    tone = 'pending'; statusTitle = 'Reconnecting…'; statusText = 'Connecting USB and fetching the recorded forecast.';
  } else if (preview) {
    statusTitle = 'Preview · Not connected';
    statusText = 'Choices change this prototype only.';
  } else if (!state?.device.connected && state?.transport === 'http') {
    tone = 'error'; statusTitle = 'Not connected'; statusText = m?.error ?? 'Connecting to local controller…';
  } else if (pendingTarget) {
    tone = 'pending';
    statusTitle = `Sending ${MODE_NAME[pendingTarget]}…`;
    statusText = 'Waiting for the device to confirm.';
  } else if (failed) {
    tone = 'error';
    statusTitle = 'Not confirmed';
    statusText = `${m!.error}. ${m?.confirmed ? `Still ${MODE_NAME[m.confirmed]}.` : 'Device state unknown.'}`;
  } else {
    tone = 'ok';
    statusTitle = m?.confirmed ? `${MODE_NAME[m.confirmed]} confirmed by device` : 'Connected';
    statusText = deviceLabel ?? '';
  }
  if (!preview && deviceLabel && tone !== 'ok') statusText = `${statusText} ${deviceLabel}.`;

  const stopped = shown === 'off';

  return (
    <div className="controls">
      <fieldset className="modes" disabled={!available || !!m?.pending || (state?.transport === 'http' && !state.device.connected)}>
        <legend className="eyebrow">Flower mode</legend>
        <div className="mode-grid">
          {cards.map((c) => {
            const selected = shown === c.mode;
            const pending = pendingTarget === c.mode;
            const tag = pending ? 'Waiting' : selected ? (preview ? 'Previewing' : 'Active') : null;
            return (
              <label
                key={c.mode}
                className="mode-card"
                data-selected={selected}
                data-pending={pending}
              >
                <input
                  type="radio"
                  name="flower-mode"
                  value={c.mode}
                  checked={selected}
                  onChange={() => onSelect(c.mode)}
                  aria-describedby={`mode-desc-${c.mode}`}
                />
                <span className="mode-mark" aria-hidden="true">
                  <CheckMark />
                </span>
                <span className="mode-body">
                  <span className="mode-head">
                    <span className="mode-title">{c.title}</span>
                    {tag && <span className="mode-tag">{tag}</span>}
                  </span>
                  <span className="mode-desc" id={`mode-desc-${c.mode}`}>{c.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="link-row">
        <p className="link-status" data-tone={tone} role="status" aria-live="polite">
          <span className="link-dot" aria-hidden="true" />
          <span className="link-title">{statusTitle}</span>
          {statusText && <span className="link-text">{statusText}</span>}
        </p>
        {onReconnect && <button type="button" className="stop-btn" onClick={onReconnect} disabled={!!state?.device.reconnecting}>
          {state?.device.reconnecting ? 'Reconnecting…' : 'Reconnect'}
        </button>}
        <button type="button" className="stop-btn" onClick={onStop} disabled={preview ? (!available || stopped) : !state?.device.connected}>
          <span className="stop-square" aria-hidden="true" />
          {pendingTarget === 'off' ? 'Stopping…' : stopped ? 'Stopped' : 'Stop'}
        </button>
      </div>
    </div>
  );
}
