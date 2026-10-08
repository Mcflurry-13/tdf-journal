#include <Servo.h>

// Connect the FS90R signal wire to Arduino D9.
// Connect servo red to external 5V and brown/black to ground. Share ground with Arduino.
const byte SERVO_PIN = 9;

// The FS90R rotates continuously. Around 1500 us stops it; offsets set direction and speed.
// If it creeps at rest, adjust STOP_US in 5 us steps and test again.
const int STOP_US = 1500;
const int RUN_US = 1600;

// Stop after eight seconds even if the browser disconnects.
const unsigned long FAILSAFE_MS = 8000;

Servo turntableServo;
bool isRunning = false;
unsigned long startedAt = 0;

void setup() {
  Serial.begin(9600);
  turntableServo.attach(SERVO_PIN, 700, 2300);
  stopMotor();
  delay(300);
  Serial.println("READY");
}

void loop() {
  while (Serial.available() > 0) {
    char command = Serial.read();

    if (command == 'R' || command == 'r') {
      startMotor();
    } else if (command == 'S' || command == 's') {
      stopMotor();
    }
  }

  if (isRunning && millis() - startedAt >= FAILSAFE_MS) {
    stopMotor();
    Serial.println("FAILSAFE_STOP");
  }
}

void startMotor() {
  turntableServo.writeMicroseconds(RUN_US);
  isRunning = true;
  startedAt = millis();
  Serial.println("ROTATING");
}

void stopMotor() {
  turntableServo.writeMicroseconds(STOP_US);
  isRunning = false;
  Serial.println("STOPPED");
}
