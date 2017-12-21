// -- INCLUDE --
#include <ESP8266WiFi.h>
#include <ArduinoHttpClient.h>

// -- INIT --
char* ssid = "iPhone de Karine";
char* pwd = "fyxxt33x613j5";
char* url = "172.20.10.2";
int port = 3000;
WiFiClient wifi;
HttpClient http = HttpClient(wifi, url, port);
int statusCode = 0;
int statusCodeGet = 0;
String responseHttp;
WiFiServer server(80);


int L3 = 2;  // LED Verte
int L2 = 4;  // LED blanche
int L1 = 5;  // LED rouge
int response = 0;
const int buttonPin = 15;
int buttonState = 0;
bool buttonClik = false;
int threshold = 0;
int temp;
String res;
int idQuestion = 0;
float resPercent = 0.0;

void setup()
{
  Serial.begin(115200);
  Serial.println("--------------------");
  Serial.println();
  Serial.println();

  //Connect to wifi
  WiFi.begin(ssid, pwd);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected.");

  //  Start server 
  server.begin();
  Serial.println();
  Serial.println("--------------------");
  Serial.println("Server started, IP: ");
  Serial.println(WiFi.localIP());

  // Init component
  pinMode(L3, OUTPUT);
  pinMode(L2, OUTPUT);
  pinMode(L1, OUTPUT);
  pinMode(buttonPin, INPUT);
  long sum = 0;
  delay(1000);

  // calculate average
  for (int i = 0; i < 100; i++)
  {
    response = analogRead(A0);
    sum += response;
    digitalWrite(L3, HIGH);
    delay(10);
    digitalWrite(L2, HIGH);
    delay(10);
    digitalWrite(L1, HIGH);
    delay(10);
    digitalWrite(L3, LOW);
    delay(10);
    digitalWrite(L2, LOW);
    delay(10);
    digitalWrite(L1, LOW);
    delay(10);
  }
  threshold = sum / 100;

  Serial.println("La moyenne de votre conductance électrodermale est : ");
  Serial.println(threshold);

  // LED OFF
  digitalWrite(L1, LOW);
  digitalWrite(L2, LOW);
  digitalWrite(L3, LOW);
}

void loop()
{
  // Check if a client has connected
  WiFiClient client = server.available();

  //Wait until the client sends some data
  if (!client){return;}
  while (!client.available()){}  
  
  // Read the first line of the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();

 //Get data from analog
  response = analogRead(A0);
  Serial.print("threshold = ");
  Serial.println(threshold);
  Serial.print("response reçu = ");
  Serial.println(response);
  temp = threshold - response;
  Serial.println(temp);

  //Check if it's a lie
  if (abs(temp) > 60 )
  {
    digitalWrite(L1, HIGH);
    Serial.println("Mytho !");
    delay(1000);
    digitalWrite(L1, LOW);
    res = "Mensonge !";
  } else if (abs(temp) < 60) {
     digitalWrite(L3, HIGH);
     delay(1000);
     digitalWrite(L3, LOW);
     res = "Vérité !";
  }
  
  //response to client
  String resp = "[{\"resultat\":\""+res+"\"}]";
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json;charset=utf-8");
  client.println("Server: Arduino");
  client.println("Connection: close");
  client.println();
  client.println(resp);
  client.println();  
  delay(100);

}

