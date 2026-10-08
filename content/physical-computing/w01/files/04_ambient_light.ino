const int ldrPin = A0;
const int ledPin = 8;
const int threshold = 250;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lightValue = analogRead(ldrPin);

  Serial.print("Light value: ");
  Serial.println(lightValue);

  if (lightValue < threshold) {
    digitalWrite(ledPin, HIGH);
    Serial.println("Dark: LED ON");
  } else {
    digitalWrite(ledPin, LOW);
    Serial.println("Bright: LED OFF");
  }

  delay(200);
}
