#include <Servo.h>

// FS90R 信号线接 Arduino D9。
// 舵机红线接外部 5V，棕/黑线接外部 GND；Arduino GND 必须与外部 GND 相连。
const byte SERVO_PIN = 9;

// FS90R 是连续旋转舵机。1500us 附近为停止，数值偏大/偏小决定方向与速度。
// 如果停止时还在缓慢爬行，把 STOP_US 每次改 5（例如 1495、1505）再测试。
const int STOP_US = 1500;
const int RUN_US = 1600;

// 即使网页意外断开，舵机也会在 8 秒后强制停止。
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
