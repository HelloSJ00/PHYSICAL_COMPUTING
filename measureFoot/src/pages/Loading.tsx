import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const Loading: React.FC = () => {
  const [measurementStep, setMeasurementStep] = useState(0); // 0: 왼발, 1: 오른발, 2: 완료
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // 각 요청 상태
  const [rightFoot, setRightFoot] = useState(null); // 오른발 데이터 저장
  const [leftFoot, setLeftFoot] = useState(null); // 왼발 데이터 저장
  const navigate = useNavigate();

  const simulateMeasurement = async (foot: "왼발" | "오른발") => {
    setIsLoading(true); // 로딩 시작
    try {
      const response = await fetch(`http://127.0.0.1:8000/measurements`, {
        method: "GET",
      });
      console.log(`${foot} Response status:`, response.status);

      if (response.ok) {
        const data = await response.json(); // JSON 데이터 가져오기
        console.log(`${foot} 측정 완료. 데이터:`, data);

        // 데이터를 측정 단계에 따라 저장
        if (foot === "왼발") setLeftFoot(data);
        if (foot === "오른발") setRightFoot(data);

        setMeasurementStep((prev) => prev + 1); // 다음 단계로
      } else {
        console.error(`${foot} 측정 실패: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`${foot} 네트워크 오류:`, error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    // 왼발 측정 시작
    if (measurementStep === 0) simulateMeasurement("왼발");
  }, [measurementStep]);

  useEffect(() => {
    // 시간 측정을 위한 interval 설정
    if (isLoading) {
      const interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setElapsedTime(0); // 로딩이 끝나면 시간 초기화
    }
  }, [isLoading]);

  const handleMeasureRightFoot = () => {
    if (measurementStep === 1) simulateMeasurement("오른발");
  };

  const handleNavigateToResult = () => {
    // 측정 데이터를 전달하며 페이지 이동
    navigate("/result", {
      state: { rightFoot, leftFoot },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
      {isLoading && measurementStep === 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">왼발 측정 중입니다...</h2>
          <CircularProgress />
          <p className="mt-4">기다린 시간: {elapsedTime}초</p>
        </>
      )}
      {isLoading && measurementStep === 1 && (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            오른발 측정 중입니다...
          </h2>
          <CircularProgress />
          <p className="mt-4">기다린 시간: {elapsedTime}초</p>
        </>
      )}
      {!isLoading && measurementStep === 1 && (
        <>
          <h1>왼발 측정 완료</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={handleMeasureRightFoot}
            style={{ fontSize: "16px", padding: "10px 20px" }}
          >
            오른발 측정하기
          </Button>
        </>
      )}
      {measurementStep === 2 && (
        <>
          <h2 className="text-2xl font-semibold mb-6">두 발 측정 완료!</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNavigateToResult}
            style={{ fontSize: "16px", padding: "10px 20px" }}
          >
            결과 확인하기
          </Button>
        </>
      )}
    </div>
  );
};

export default Loading;
