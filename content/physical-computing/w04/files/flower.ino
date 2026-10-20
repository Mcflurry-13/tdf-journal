/* Feather ESP32 V2; real Sunsethue data comes from computer over USB.
   No Wi-Fi, no credentials on board, no demo scores. NeoPixel library required.
   GPIO27: 16 GRB RGB pixels; GPIO14: servo, 50Hz, original 1000..2000us mapping.
   Commands: X stop, S breathe, H hold display. Both cases accepted.
   Startup and forecast receipt never start motion. Host sends a separate start.
   5..165 are nominal command angles, not measured physical positions.
*/
#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <cJSON.h>
#include <sys/time.h>
#include <time.h>
#include <math.h>
constexpr float CLOSED_DEG = 5.0f, OPEN_DEG = 165.0f;
constexpr float BREATHE_MAX_DEG = 150.0f;
constexpr uint8_t SERVO_PIN = 14, PIXEL_PIN = 27;
constexpr uint32_t MOVE_MS = 3000, HOLD_MS = 1500;
Adafruit_NeoPixel pixels(16, PIXEL_PIN, NEO_GRB + NEO_KHZ800);
bool pixelReady = false, servoOn = false, valid = false, moving = false, dwelling = false;
// 0 stopped, 1 breathing, 2 hold display
int mode = 0;
bool nextOpen = true;
float quality = 0, angleNow = 90, angleFrom = 90, angleTarget = 90;
String forecastDate, line;
bool overflowed = false;
uint32_t moveStarted = 0, dwellStarted = 0, lastFrame = 0, lastReady = 0;
uint32_t lastContact = 0;

String today() {
  time_t now = time(nullptr);
  if (now < 1700000000) return "";
  tm local; localtime_r(&now, &local);
  char result[11]; strftime(result, sizeof(result), "%Y-%m-%d", &local);
  return String(result);
}
float peakAngle() { return CLOSED_DEG + fminf(quality / 0.60f, 1.0f) * (OPEN_DEG - CLOSED_DEG); }
float motionPeak() { return mode == 1 ? BREATHE_MAX_DEG : peakAngle(); }
bool current() { return valid && forecastDate == today(); }
void stopAll() {
  mode = 0; moving = dwelling = false;
  if (servoOn) ledcDetach(SERVO_PIN);
  servoOn = false; pinMode(SERVO_PIN, OUTPUT); digitalWrite(SERVO_PIN, LOW);
  if (pixelReady) { pixels.clear(); pixels.show(); }
}
bool writeAngle(float angle) {
  angleNow = constrain(angle, CLOSED_DEG, OPEN_DEG);
  const float us = 1000 + angleNow * 1000 / 180;
  if (!ledcWrite(SERVO_PIN, uint32_t(lroundf(us * 65535 / 20000)))) {
    stopAll(); Serial.println("{\"error\":\"pwm_write\"}"); return false;
  }
  return true;
}
void render() {
  if (!pixelReady) return;
  const float span = motionPeak() - CLOSED_DEG;
  const float opening = current() && mode && span > 0.001f
      ? constrain((angleNow - CLOSED_DEG) / span, 0.0f, 1.0f) : 0;
  const float greenWeight = quality < .33f ? 255 : (quality < .67f ? 80 : 0);
  const uint8_t total = uint8_t(lroundf((16 + 35 * quality) * opening * opening));
  const uint8_t g = uint8_t(lroundf(total * greenWeight / (255 + greenWeight)));
  pixels.fill(pixels.Color(total-g,g,0)); pixels.show();
}
void moveTo(float target) {
  angleFrom = angleNow; angleTarget = target;
  moveStarted = millis(); moving = true; dwelling = false;
}
void startMode(int requested) {
  if (!current() || !pixelReady) { Serial.println("{\"error\":\"no_current_forecast\"}"); return; }
  if (!servoOn) {
    if (!ledcAttachChannel(SERVO_PIN,50,16,0)) {
      Serial.println("{\"error\":\"pwm_attach\"}"); return;
    }
    servoOn = true;
    // Last command is remembered; physical position is not measured.
    if (!writeAngle(angleNow)) return;
  }
  mode = requested; nextOpen = true;
  moveTo(mode == 1 ? CLOSED_DEG : peakAngle());
  Serial.printf("{\"mode\":\"%s\",\"score\":%.3f,\"peak\":%.3f}\n",
                mode == 1 ? "breathe" : "display",quality*100,motionPeak());
}
void receiveForecast(const String &input) {
  cJSON *root = cJSON_Parse(input.c_str());
  if (!root) { stopAll(); Serial.println("{\"error\":\"invalid_json\"}"); return; }
  const cJSON *cmd = cJSON_GetObjectItemCaseSensitive(root,"cmd");
  if (!cJSON_IsString(cmd) || strcmp(cmd->valuestring,"forecast") != 0) {
    cJSON_Delete(root); Serial.println("{\"error\":\"unknown_packet\"}"); return;
  }
  stopAll(); valid = false;
  const cJSON *q = cJSON_GetObjectItemCaseSensitive(root,"quality");
  const cJSON *d = cJSON_GetObjectItemCaseSensitive(root,"date");
  const cJSON *epoch = cJSON_GetObjectItemCaseSensitive(root,"epoch");
  const cJSON *fetched = cJSON_GetObjectItemCaseSensitive(root,"fetched_at");
  const cJSON *id = cJSON_GetObjectItemCaseSensitive(root,"forecast_id");
  bool ok = cJSON_IsNumber(q) && isfinite(q->valuedouble) && q->valuedouble >= 0 && q->valuedouble <= 1
    && cJSON_IsString(d) && strlen(d->valuestring) == 10
    && cJSON_IsNumber(epoch) && epoch->valuedouble >= 1700000000 && epoch->valuedouble <= 4102444800.0
    && cJSON_IsNumber(fetched) && fetched->valuedouble <= epoch->valuedouble + 60
    && epoch->valuedouble - fetched->valuedouble <= 600
    && cJSON_IsNumber(id) && id->valuedouble >= 1 && id->valuedouble <= 2147483647;
  if (ok) {
    lastContact = millis();
    timeval clockValue = {time_t(epoch->valuedouble),0}; settimeofday(&clockValue,nullptr);
    ok = today() == d->valuestring;
  }
  if (ok) {
    quality = float(q->valuedouble); forecastDate = d->valuestring; valid = true;
    Serial.printf("{\"ack\":%lu,\"score\":%.3f,\"peak\":%.3f,\"date\":\"%s\",\"mode\":\"off\"}\n",
       (unsigned long)id->valuedouble,quality*100,peakAngle(),forecastDate.c_str());
  } else Serial.println("{\"error\":\"invalid_forecast\"}");
  cJSON_Delete(root);
}
void handleLine() {
  line.trim();
  if (line.startsWith("{")) receiveForecast(line);
  else if (line.length() == 1) {
    char c = tolower(line[0]);
    if (c == 'x' || c == 's' || c == 'h' || c == '?') lastContact = millis();
    if (c == 'x') { stopAll(); Serial.println("{\"mode\":\"off\"}"); }
    else if (c == 's') startMode(1);
    else if (c == 'h') startMode(2);
    else if (c == '?') Serial.println("FLOWER_API_READY_V2");
  }
}
void setup() {
  Serial.begin(115200);
  pinMode(SERVO_PIN,OUTPUT); digitalWrite(SERVO_PIN,LOW);
  pixelReady = pixels.begin(); stopAll();
  setenv("TZ","PST8PDT,M3.2.0,M11.1.0",1); tzset();
  line.reserve(2048);
  Serial.println("FLOWER_API_READY_V2");
}
void loop() {
  for (uint8_t n=0; n<64 && Serial.available(); ++n) {
    char c = Serial.read();
    if (c == '\n') {
      if (!overflowed) handleLine();
      else { stopAll(); Serial.println("{\"error\":\"line_too_long\"}"); }
      line=""; overflowed=false;
    } else if (c != '\r' && !overflowed) {
      if (line.length()<2047) line+=c; else overflowed=true;
    }
  }
  if (valid && !current()) {
    valid=false; stopAll(); Serial.println("{\"error\":\"forecast_expired\"}");
  }
  const uint32_t now=millis();
  if (mode && now-lastContact > 60000) {
    stopAll(); Serial.println("{\"error\":\"computer_heartbeat_lost\"}");
  }
  if (mode && servoOn && now-lastFrame>=20) {
    lastFrame=now;
    if (moving) {
      float t=fminf(float(now-moveStarted)/MOVE_MS,1.0f);
      float eased=t*t*(3-2*t);
      if (!writeAngle(angleFrom+(angleTarget-angleFrom)*eased)) return;
      render();
      if (t>=1) { moving=false; dwelling=mode==1; dwellStarted=now; }
    } else if (dwelling && now-dwellStarted>=HOLD_MS) {
      moveTo(nextOpen ? BREATHE_MAX_DEG : CLOSED_DEG); nextOpen=!nextOpen;
    }
  }
  if (now-lastReady>=2000) { Serial.println("FLOWER_API_READY_V2"); lastReady=now; }
  delay(1);
}
