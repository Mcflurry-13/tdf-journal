// Shape of the state the UI consumes. Mirrors examples/state-preview.json and the
// proposed GET /api/state contract in INTEGRATION_NOTES.txt §5 (not implemented yet).

export type FlowerMode = 'display' | 'breathe' | 'off';

export type ForecastStatus = 'loading' | 'current' | 'stale' | 'error' | 'absent' | 'sample';

export type Transport = 'mock' | 'http';

/** preview  = no hardware, clicks only change the prototype
 *  simulated = dev-only fake ACK round trip, still no hardware
 *  connected / disconnected / error = reserved for the future serial-owner service */
export type DeviceStatus = 'preview' | 'simulated' | 'connected' | 'disconnected' | 'error';

export interface FlowerState {
  schemaVersion: 1;
  transport: Transport;
  location: { name: string; timezone: string };
  forecast: {
    status: ForecastStatus;
    source: string | null;
    /** Calendar date in America/Los_Angeles, YYYY-MM-DD. Never derived from the browser clock. */
    date: string | null;
    /** 0..1, or null when there is no valid forecast (null is NOT a zero score). */
    quality: number | null;
    score: number | null;
    qualityText: string | null;
    fetchedAt: number | null;
    eventTime: number | null;
  };
  device: { connected: boolean; status: DeviceStatus; reconnecting?: boolean };
  mode: {
    /** What the user asked for. */
    desired: FlowerMode | null;
    /** Only ever set from a firmware ACK. Null in preview. */
    confirmed: FlowerMode | null;
    /** Preview-only selection (transport = mock). */
    preview: FlowerMode | null;
    pending: boolean;
    error: string | null;
  };
  motion: {
    kind: 'illustration';
    timeline?: { id: number; mode: FlowerMode; fromDeg: number; peakDeg: number; elapsedMs: number };
    closedDeg: number;
    limitDeg: number;
    peakDeg: number | null;
    /** Always null: the hardware has no angle sensor. */
    angleMeasuredDeg: null;
    moveMs: number;
    holdMs: number;
  };
  image: { src: string; kind: string; caption: string };
}

/** Labels the UI shows for a test scenario, so a non-sample value is never mistaken for a forecast. */
export interface ScenarioInfo {
  id: string;
  label: string;
}
