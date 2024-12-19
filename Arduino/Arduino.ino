// 핀 정의
#define TRIG_PIN1 2
#define ECHO_PIN1 3
#define TRIG_PIN2 4
#define ECHO_PIN2 5
#define TRIG_PIN3 6
#define ECHO_PIN3 7
#define TRIG_PIN4 8
#define ECHO_PIN4 9
#define TRIG_PIN5 10
#define ECHO_PIN5 11

void setup() {
  Serial.begin(9600);  // 시리얼 통신 시작

  // 센서 핀 모드 설정
  pinMode(TRIG_PIN1, OUTPUT);
  pinMode(ECHO_PIN1, INPUT);
  pinMode(TRIG_PIN2, OUTPUT);
  pinMode(ECHO_PIN2, INPUT);
  pinMode(TRIG_PIN3, OUTPUT);
  pinMode(ECHO_PIN3, INPUT);
  pinMode(TRIG_PIN4, OUTPUT);
  pinMode(ECHO_PIN4, INPUT);
  pinMode(TRIG_PIN5, OUTPUT);
  pinMode(ECHO_PIN5, INPUT);

  Serial.println("Waiting for commands...");
}

void loop() {
  // 시리얼 데이터 수신 확인
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');  // 명령 읽기
    command.trim();  // 공백 제거

    if (command == "MEASURE") {
      performMeasurements();  // 측정 수행
    } else {
      Serial.println("Invalid command");
    }
  }
}

// 모든 센서 측정 및 데이터 반환
void performMeasurements() {
  Serial.println("Starting measurements...");

  measureAndSend(TRIG_PIN1, ECHO_PIN1);
  measureAndSend(TRIG_PIN2, ECHO_PIN2);
  measureAndSend(TRIG_PIN3, ECHO_PIN3);
  measureAndSend(TRIG_PIN4, ECHO_PIN4);
  measureAndSend(TRIG_PIN5, ECHO_PIN5);

  Serial.println("Measurements complete.");
}

// 특정 센서 측정 및 데이터 전송
void measureAndSend(int trigPin, int echoPin) {
  for (int i = 0; i < 100; i++) {
    float distance = measureDistance(trigPin, echoPin);
    Serial.println(distance);  // 측정된 거리 전송
    delay(50);  // 딜레이
  }
}

// 거리 측정 함수
float measureDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  return (duration * 0.034) / 2;  // 거리 계산 (cm)
}
