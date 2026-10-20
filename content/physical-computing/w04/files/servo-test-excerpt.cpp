// Excerpt from servo-test.ino; full sketch below.
void startSweep() {
  if (sweeping) return;
  stopServo();
  if (!ledcAttachChannel(SERVO_PIN, 50, 16, 0)) {
    Serial.println("ERROR: PWM setup failed.");
    return;
  }
  servoEnabled = true;
  if (!writePulse(1500)) return;
  sweeping = true;
  sweepStarted = millis();
  lastFrame = sweepStarted;
  Serial.println("SWEEP ON: 1200 <-> 1800 us, 2s travel + 1s hold. x stops PWM.");
}
