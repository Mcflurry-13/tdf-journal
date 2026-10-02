export function InteractionFlow() {
  return <figure className="system-figure" aria-label="System diagram: camera to browser, then separate motor and projection outputs">
    <div className="system-node">Camera<span>Face / body presence + both hands</span></div>
    <div className="system-arrow" aria-hidden="true">↓</div>
    <div className="system-node">Browser · p5.js + MediaPipe Holistic<span>Presence latch · pinch pen · drawing canvas</span></div>
    <div className="system-branches">
      <div><div className="system-arrow">↓ USB serial · R / S</div><div className="system-node">Arduino Uno<span>D9 → FS90R → gears → turntable</span></div></div>
      <div><div className="system-arrow">↓ Drawing → image API</div><div className="system-node">Projection window<span>Vase mask → HDMI → projector</span></div></div>
    </div>
    <figcaption>The browser coordinates two outputs. Arduino drives the physical motion; the computer sends the image to the projector.</figcaption>
  </figure>;
}
