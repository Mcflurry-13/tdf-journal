const int led1 = 8;
const int led2 = 9;
const int led3 = 10;

void setup() {
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);

  Serial.begin(9600);
}

void showOnly(int activeLed) {
  digitalWrite(led1, activeLed == 1 ? HIGH : LOW);
  digitalWrite(led2, activeLed == 2 ? HIGH : LOW);
  digitalWrite(led3, activeLed == 3 ? HIGH : LOW);

  Serial.print("LED ");
  Serial.print(activeLed);
  Serial.println(" is ON");
}

void loop() {
  showOnly(1);
  delay(300);

  showOnly(2);
  delay(300);

  showOnly(3);
  delay(300);

  showOnly(2);
  delay(300);
}
