int led = 13;  // Store the onboard LED pin number.

// setup() runs once after reset or power-up.
void setup() {
  // Configure the LED pin as an output.
  pinMode(led, OUTPUT);
}

// loop() repeats forever.
void loop() {
  digitalWrite(led, HIGH);  // Turn the LED on.
  delay(1000);              // Wait one second.
  digitalWrite(led, LOW);   // Turn the LED off.
  delay(1000);              // Wait one second.
}
