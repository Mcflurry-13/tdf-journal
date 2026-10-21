import { useCallback, useEffect, useMemo, useState } from 'react';
import { selectAdapter } from './adapters';
import { FlowerStatus } from './components/FlowerStatus';
import { ModeControls } from './components/ModeControls';
import { SkyPanel } from './components/SkyPanel';
import { peakFromQuality, tierFromQuality } from './domain/mapping';
import type { Phase } from './domain/motion';
import type { FlowerState } from './domain/types';
import { FlowerStage } from './flower/FlowerStage';
import { TIER_COLOR } from './flower/FlowerFigure';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export default function App() {
  const adapter = useMemo(() => selectAdapter(), []);
  const [state, setState] = useState<FlowerState | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
  const reducedMotion = usePrefersReducedMotion();


  useEffect(() => {
    let alive = true;
    adapter
      .getState()
      .then((s) => { if (alive) { setState(s); setLoadError(null); } })
      .catch((e: unknown) => alive && setLoadError(e instanceof Error ? e.message : String(e)));
    const unsubscribe = adapter.subscribe((s) => { if (alive) { setState(s); setLoadError(null); } });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [adapter]);

  const f = state?.forecast;
  const valid = !loadError && !!f && (f.status === 'sample' || f.status === 'current') && f.quality !== null;
  const quality = valid ? f!.quality! : null;
  const peakDeg = valid ? (state!.motion.peakDeg ?? peakFromQuality(quality!)) : null;
  const tier = quality !== null ? tierFromQuality(quality) : null;
  const preview = state?.device.status === 'preview';
  // The drawing follows the preview selection, or — with a device — only what the device confirmed.
  const illustratedMode = !valid ? null : preview ? state!.mode.preview : state!.mode.confirmed;
  const animationPeak = illustratedMode === 'breathe' ? 150 : peakDeg;
  const forecastStatus = loadError ? 'error' : (f?.status ?? 'loading');

  const handleResult = useCallback((p: Promise<FlowerState>) => {
    p.then(s => { setState(s); setLoadError(null); }).catch((e: unknown) => setLoadError(e instanceof Error ? e.message : String(e)));
  }, []);
  const onSelect = useCallback((mode: 'display' | 'breathe') => handleResult(adapter.setMode(mode)), [adapter, handleResult]);
  const onStop = useCallback(() => handleResult(adapter.stop()), [adapter, handleResult]);

  const tierColor = tier ? TIER_COLOR[tier] : '#C9CFCB';

  return (
    <div className="page" data-reduced={reducedMotion} style={{ ['--tier' as string]: tierColor }}>
      <div className="atmosphere" aria-hidden="true">
        <span className="blob blob--cool" />
        <span className="blob blob--sage" />
        <span className="blob blob--warm" />
        <span className="blob blob--rose" />
      </div>

      <main className="glass">
        <header className="masthead">
          <h1 className="title">Sunset in Bloom</h1>
          <p className="place">Ambient Display · Journal preview</p>
        </header>

        <div className="layout">
          <section className="col-flower" aria-label="Flower motion illustration">
            <div className="stage">
              <FlowerStage
                mode={illustratedMode}
                timeline={state?.transport === 'http' ? state.motion.timeline : undefined}
                peakDeg={animationPeak}
                quality={quality}
                reducedMotion={reducedMotion}
                onPhaseChange={setPhase}
              />
            </div>
            <FlowerStatus
              phase={phase}
              mode={illustratedMode}
              peakDeg={animationPeak}
              tier={tier}
              forecastStatus={forecastStatus}
              reducedMotion={reducedMotion}
            />
          </section>

          <section className="col-sky" aria-label="Berkeley sunset forecast and flower mode">
            <SkyPanel state={state} loadError={loadError} scenario={adapter.scenario} />
            <ModeControls
              state={state}
              available={valid}
              peakDeg={peakDeg}
              score={valid ? f!.score : null}
              deviceLabel={state?.device.status === 'simulated' ? adapter.scenario?.label : undefined}
              loadError={loadError}
              onSelect={onSelect}
              onStop={onStop}
              onReconnect={adapter.reconnect ? () => handleResult(adapter.reconnect!()) : undefined}
            />
          </section>
        </div>
      </main>


    </div>
  );
}
