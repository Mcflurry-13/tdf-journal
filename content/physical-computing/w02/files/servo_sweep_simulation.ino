#include <Servo.h>

Servo myservo;

int pos = 0;

void setup() {
  myservo.attach(9);
}

void loop() {
  // Sweep from 0 to 180 degrees.
  for (pos = 0; pos <= 180; pos += 1) {
    myservo.write(pos);
    delay(15);
  }

  // Sweep back from 180 to 0 degrees.
  for (pos = 180; pos >= 0; pos -= 1) {
    myservo.write(pos);
    delay(15);
  }
}
