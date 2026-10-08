void setup() {
  // Initialize serial communication at 9600 baud.
  Serial.begin(9600);
}

void loop() {
  // Send "Hello, world!" over the serial port.
  Serial.println("Hello, world!");

  // Wait 1000 milliseconds before printing again.
  delay(1000);
}
