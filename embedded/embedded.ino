#include <WiFi.h>
#include <HTTPClient.h>
#include <HX711.h>
#include "./config.h"

const int LOADCELL_DOUT_PIN = 14;
const int LOADCELL_SCK_PIN = 27;

unsigned long lastTime = 0;

HX711 scale;

char jsonBuffer[32];

void connectToWifi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Connecting");
  
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Sending data soon...");
}

void setup() {
  Serial.begin(115200); 

  connectToWifi();
 
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(230);
  scale.tare();
  scale.power_up();

  delay(500);
}

float min(float x, float y) { return x < y ? x : y; }
float max(float x, float y) { return x > y ? x : y; }

float valueToPercentage(float rawValue) {
  return min(100, max(0, 0.057366667814 * rawValue - 2.92485));
}

void loop() {
  scale.power_down();
  delay(500);
  scale.power_up();
  
  if (WiFi.status() == WL_CONNECTED) {
    float rawValue = scale.get_units(10);
    float percentage = valueToPercentage(rawValue);
    sprintf(jsonBuffer, "{\"new_level\": %.4f}", percentage);
      
    HTTPClient http;

    String serverPath = UPDATE_SERVER_URL;
    http.begin(serverPath.c_str());
    http.addHeader("Authorization", PUSH_TOKEN);
      
    int httpResponseCode = http.POST(jsonBuffer);
      
    if (httpResponseCode > 0) {
      Serial.print("Http update response code: ");
      Serial.print(httpResponseCode);
    }
    else {
      Serial.print("Http error code: ");
      Serial.print(httpResponseCode);
    }
    Serial.print(", Current level percentage: ");
    Serial.print(percentage);
    Serial.print(", raw value: ");
    Serial.println(rawValue);
    http.end();
  }
  else {
    Serial.println("WiFi Disconnected. Reconnecting...");
    connectToWifi();
    delay(1000);
  }
}
