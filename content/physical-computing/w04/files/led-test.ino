/* Feather ESP32 V2; two P1426 RGB sticks, 16 pixels, GPIO27.
   Adafruit NeoPixel library required. Servo is NOT driven.
   Disconnect servo power, LED power and DIN before upload.
   Reconnect DIN with both supplies off; external 5V on before MCU USB.
   Serial 115200; upper/lowercase accepted:
   S automatic sequence; R/G/B colors; W warm; C cool; X off;
   1 first stick red, second off; 2 first off, second green.
   Warm/cool are RGB mixtures, not calibrated color temperatures.
*/
#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
constexpr uint8_t DATA_PIN = 27;
Adafruit_NeoPixel pixels(16, DATA_PIN, NEO_GRB + NEO_KHZ800);
bool ready = false, automatic = true;
uint32_t started = 0;
int lastStep = -1;

void all(uint8_t r, uint8_t g, uint8_t b) {
  if (!ready) return;
  pixels.fill(pixels.Color(r,g,b));
  pixels.show();
}
void handle(char c) {
  if (c >= 'A' && c <= 'Z') c += 'a' - 'A';
  if (c == '\r' || c == '\n' || c == ' ') return;
  if (!ready) return;
  switch (c) {
    case 's': automatic = true; started = millis(); lastStep = -1;
      Serial.println("AUTO: red green blue warm cool off; 2 seconds each."); return;
    case 'r': all(24,0,0); break;
    case 'g': all(0,24,0); break;
    case 'b': all(0,0,24); break;
    case 'w': all(24,12,3); break;
    case 'c': all(16,20,24); break;
    case 'x': all(0,0,0); break;
    case '1':
      pixels.clear(); pixels.fill(pixels.Color(24,0,0),0,8); pixels.show(); break;
    case '2':
      pixels.clear(); pixels.fill(pixels.Color(0,24,0),8,8); pixels.show(); break;
    default: Serial.println("Use S R G B W C X 1 2."); return;
  }
  automatic = false;
  Serial.printf("Command %c sent. This is not physical LED feedback.\n", c);
}
void setup() {
  Serial.begin(115200);
  pinMode(14, OUTPUT); digitalWrite(14, LOW); // no servo PWM
  ready = pixels.begin();
  if (!ready) { Serial.println("ERROR: NeoPixel initialization failed."); return; }
  all(0,0,0);
  started = millis();
  Serial.println("LED ONLY READY: GPIO27, 16 RGB pixels. Servo power must be disconnected.");
}
void loop() {
  for (uint8_t n=0; n<16 && Serial.available(); ++n) handle(Serial.read());
  if (ready && automatic) {
    int step = ((millis()-started)/2000UL)%6;
    if (step != lastStep) {
      lastStep = step;
      const uint8_t colors[6][3] = {{24,0,0},{0,24,0},{0,0,24},{24,12,3},{16,20,24},{0,0,0}};
      const char *names[] = {"RED","GREEN","BLUE","WARM","COOL","OFF"};
      all(colors[step][0],colors[step][1],colors[step][2]);
      Serial.println(names[step]);
    }
  }
  delay(2);
}
