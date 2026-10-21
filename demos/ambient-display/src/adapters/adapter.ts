import type { FlowerState, ScenarioInfo } from '../domain/types';

/**
 * The only way UI components learn about forecast, device and mode.
 * Components never hold fixture data or talk to hardware themselves.
 *
 * Contract for implementations:
 * - setMode / stop resolve once the *request* is accepted. A real device answer arrives later
 *   through subscribe(): mode.pending → mode.confirmed (ACK) or mode.error (timeout / NAK).
 * - mode.confirmed may only change because of a firmware ACK. Never optimistically.
 * - forecast.quality === null means "no valid forecast"; it is never coerced to 0.
 * - motion.angleMeasuredDeg stays null (there is no angle sensor).
 */
export interface FlowerAdapter {
  readonly kind: 'mock' | 'http';
  /** Present for mock test scenarios so the UI can label non-sample values. */
  readonly scenario?: ScenarioInfo;
  getState(): Promise<FlowerState>;
  setMode(mode: 'display' | 'breathe'): Promise<FlowerState>;
  stop(): Promise<FlowerState>;
  reconnect?(): Promise<FlowerState>;
  /** Pushes later state changes (ACK, timeout, forecast refresh). Returns an unsubscribe function. */
  subscribe(listener: (state: FlowerState) => void): () => void;
}

export class AdapterNotImplementedError extends Error {
  constructor() {
    super('The live backend adapter is not implemented yet. No HTTP service exists in the current runtime.');
    this.name = 'AdapterNotImplementedError';
  }
}
