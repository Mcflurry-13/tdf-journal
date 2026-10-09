#include <Servo.h>

Servo myservo;

const int potpin = A0;

void setup() {
  Serial.begin(9600);  // Start serial communication.
  myservo.attach(9);   // Servo signal on D9.

  Serial.println("Servo Knob started");
}

void loop() {
  int sensorValue = analogRead(potpin);
  int angle = map(sensorValue, 0, 1023, 0, 180);

  myservo.write(angle);

  Serial.print("Pot: ");
  Serial.print(sensorValue);
  Serial.print("  |  Target angle: ");
  Serial.println(angle);

  delay(100);  // Print every 0.1 second.
}
