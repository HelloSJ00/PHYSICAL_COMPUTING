import serial
import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React 앱 URL (포트에 맞게 수정)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

SERIAL_PORT = "/dev/tty.usbmodem2101" 
BAUD_RATE = 9600

try:
    print("Connecting to serial port...")
    arduino = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    time.sleep(2)
    print("Serial connection established.")
except serial.SerialException:
    raise HTTPException(status_code=500, detail="Serial port connection failed.")

class Measurement(BaseModel):
    width: float
    length: float
    height: float

@app.get("/measurements", response_model=Measurement)
def get_measurements():
    try:
        print("Sending 'MEASURE' command to Arduino...")
        arduino.write(b"MEASURE\n")
        time.sleep(0.1)

        sensor_data = {
            "right": [],
            "left": [],
            "front1": [],
            "front2": [],
            "top": []
        }

        print("Starting to receive data...")
        data_count = 0
        while data_count < 500:
            if arduino.in_waiting > 0:
                raw_data = arduino.readline().decode('utf-8').strip()
                print(f"Raw data received: {raw_data}")

                try:
                    distance = float(raw_data)
                except ValueError:
                    print("Invalid data received, skipping...")
                    continue

                if data_count < 100:
                    sensor_data["right"].append(distance)
                elif data_count < 200:
                    sensor_data["left"].append(distance)
                elif data_count < 300:
                    sensor_data["front1"].append(distance)
                elif data_count < 400:
                    sensor_data["front2"].append(distance)
                elif data_count < 500:
                    sensor_data["top"].append(distance)

                print(f"Data count: {data_count + 1} - Assigned to {list(sensor_data.keys())[data_count // 100]}")
                data_count += 1

        print("Processing received data...")
        min_data = {}
        for key, values in sensor_data.items():
            if len(values) < 100:
                print(f"Insufficient data for sensor {key}. Only received {len(values)} values.")
                raise HTTPException(
                    status_code=500, detail=f"Insufficient data for sensor: {key}"
                )
            min_data[key] = min(values)  # 배열의 가장 작은 값을 선택
            print(f"{key} - Minimum value: {min_data[key]}")

        print("Creating measurement object...")
        measurement = Measurement(
            width=round(18.5 - min_data["right"] - min_data["left"], 2),
            length=round(31 - min(min_data["front1"], min_data["front2"]), 2),
            height=round(11.5 - min_data["top"], 2)
        )
        print("Measurement complete. Returning data...")
        return measurement  # JSON 형식으로 자동 변환됨

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
