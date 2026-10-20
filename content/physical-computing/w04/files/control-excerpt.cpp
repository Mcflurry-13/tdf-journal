// Excerpts from flower.ino; not a standalone sketch.
constexpr float CLOSED_DEG = 5.0f, OPEN_DEG = 165.0f;
constexpr float BREATHE_MAX_DEG = 150.0f;
constexpr uint32_t MOVE_MS = 3000, HOLD_MS = 1500;

float peakAngle() {
  return CLOSED_DEG + fminf(quality / 0.60f, 1.0f)
       * (OPEN_DEG - CLOSED_DEG);
}
float motionPeak() {
  return mode == 1 ? BREATHE_MAX_DEG : peakAngle();
}
