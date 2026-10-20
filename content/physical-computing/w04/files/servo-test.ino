/*
  Servo-only test: Adafruit Feather ESP32 V2, Arduino-ESP32 3.x/4.x.
  No additional libraries. GPIO14 (h16 -> j16) is the servo signal.
  Servo uses external 5V; connect supply GND to Feather GND.
  Disconnect LED power and DIN. Disconnect flower linkage before testing.
  Upload with external servo power disconnected.
  Serial Monitor: 115200 baud, any line ending.
  a: 1500us, -: 1450us, +: 1550us; each test lasts 1.5 seconds.
  s: repeat 1200..1800us sweep (2s travel, 1s hold); x stops.
  This commands positions, not continuous rotation or measured angles.
  x: disable PWM. This does NOT disconnect servo electrical power.
*/
#include <Arduino.h>

constexpr uint8_t SERVO_PIN = 14;
constexpr uint32_t TEST_MS = 1500;
bool servoEnabled = false;
uint32_t testStarted = 0;
bool sweeping = false;
uint32_t sweepStarted = 0, lastFrame = 0;
constexpr uint16_t SWEEP_MIN_US = 1200, SWEEP_MAX_US = 1800;
constexpr uint32_t MOVE_MS = 2000, HOLD_MS = 1000;

void stopServo() {
  if (servoEnabled) ledcDetach(SERVO_PIN);
  pinMode(SERVO_PIN, OUTPUT);
  digitalWrite(SERVO_PIN, LOW);
  servoEnabled = false;
  sweeping = false;
}

bool writePulse(uint16_t pulseUs) {
  const uint32_t duty = (uint32_t(pulseUs) * 65535UL + 10000UL) / 20000UL;
  if (ledcWrite(SERVO_PIN, duty)) return true;
  stopServo();
  Serial.println("ERROR: PWM write failed.");
  return false;
}

void startTest(uint16_t pulseUs) {
  // Repeated input cannot extend a running test indefinitely.
  if (servoEnabled) {
    Serial.println("Test running. Wait until it ends; x stops PWM.");
    return;
  }
  if (!ledcAttachChannel(SERVO_PIN, 50, 16, 0)) {
    Serial.println("ERROR: PWM setup failed. Select Feather ESP32 V2.");
    return;
  }
  servoEnabled = true;
  if (!writePulse(pulseUs)) return;
  testStarted = millis();
  Serial.printf("TEST: %u us for 1.5 seconds.\n", pulseUs);
}

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

void tickSweep() {
  if (!sweeping || !servoEnabled) return;
  const uint32_t now = millis();
  if (now - lastFrame < 20) return;
  lastFrame = now;
  const uint32_t elapsed = now - sweepStarted;
  float pulse;
  // First approach from center to the low endpoint over two seconds.
  if (elapsed < MOVE_MS) {
    float t = float(elapsed) / MOVE_MS;
    t = t * t * (3 - 2 * t);
    pulse = 1500 + (float(SWEEP_MIN_US) - 1500) * t;
  } else {
    const uint32_t phase = (elapsed - MOVE_MS) % (2 * (MOVE_MS + HOLD_MS));
    float t;
    if (phase < HOLD_MS) t = 0;
    else if (phase < HOLD_MS + MOVE_MS) t = float(phase - HOLD_MS) / MOVE_MS;
    else if (phase < 2 * HOLD_MS + MOVE_MS) t = 1;
    else t = 1 - float(phase - 2 * HOLD_MS - MOVE_MS) / MOVE_MS;
    t = t * t * (3 - 2 * t);
    pulse = SWEEP_MIN_US + (SWEEP_MAX_US - SWEEP_MIN_US) * t;
  }
  writePulse(uint16_t(pulse + 0.5f));
}

void setup() {
  Serial.begin(115200);
  stopServo();
  pinMode(27, INPUT);  // LED data is unused; keep LED DIN disconnected.
  Serial.println("SERVO ONLY READY. No motion until a command is received.");
  Serial.println("Disconnect linkage. s=large repeating sweep; x=PWM off.");
  Serial.println("a=1500us, -=1450us, +=1550us: short tests, use x before changing mode.");
}

void loop() {
  if (servoEnabled && !sweeping && millis() - testStarted >= TEST_MS) {
    stopServo();
    Serial.println("Test ended. PWM OFF; servo power is still connected.");
  }
  for (uint8_t n = 0; n < 16 && Serial.available(); ++n) {
    const char command = Serial.read();
    switch (command) {
      case 's': startSweep(); break;
      case 'a': startTest(1500); break;
      case '-': startTest(1450); break;
      case '+': startTest(1550); break;
      case 'x':
        stopServo();
        Serial.println("PWM OFF; unplug external power if motion continues.");
        break;
      default: break;
    }
  }
  tickSweep();
  delay(1);
}
