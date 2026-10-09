#include <Servo.h>

Servo myservo;

const int trigPin = 7;
const int echoPin = 6;

int currentAngle = 90;
int targetAngle = 90;

void setup() {
  Serial.begin(9600);
  Serial.println("BOOT");

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  myservo.attach(9);
  myservo.write(currentAngle);
  delay(500);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  unsigned long duration = pulseIn(echoPin, HIGH, 30000);

  if (duration == 0) {
    // Hold the current position when no echo is received.
    targetAngle = currentAngle;
    Serial.print("No echo | Hold: ");
  } else {
    float distance = duration * 0.0343 / 2.0;

    if (distance >= 2 && distance <= 400) {
      // Limit distance before mapping it to the output range.
      float limitedDistance = constrain(distance, 10.0, 30.0);
      targetAngle = map((long)limitedDistance, 10, 30, 120, 60);
    } else {
      targetAngle = currentAngle;
    }

    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.print(" cm | Target: ");
    Serial.print(targetAngle);
    Serial.print(" | Command: ");
  }

  // Move by at most two degrees per cycle.
  if (currentAngle < targetAngle) {
    currentAngle += min(2, targetAngle - currentAngle);
  } else if (currentAngle > targetAngle) {
    currentAngle -= min(2, currentAngle - targetAngle);
  }

  myservo.write(currentAngle);
  Serial.println(currentAngle);

  delay(80);
}
