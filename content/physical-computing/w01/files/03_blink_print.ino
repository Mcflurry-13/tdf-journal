const int externalLed = 8;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(externalLed, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  digitalWrite(externalLed, HIGH);
  Serial.println("Hello, world! LEDs are ON");
  delay(1000);

  digitalWrite(LED_BUILTIN, LOW);
  digitalWrite(externalLed, LOW);
  Serial.println("Hello, world! LEDs are OFF");
  delay(1000);
}
