import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartMeasurement = () => {
    navigate("/loading");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
      <h3 className="text-xl font-bold mb-6">피지컬 컴퓨팅 기말 프로젝트 </h3>
      <h1 className="text-4xl font-bold mb-6">발 사이즈 측정 서비스</h1>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleStartMeasurement}
        style={{
          fontSize: "20px",
          padding: "15px 30px",
          backgroundColor: "#ffffff",
          color: "#1e3a8a", // 배경색과 동일한 색상으로 설정
        }}
      >
        왼발부터 측정 시작
      </Button>
    </div>
  );
};

export default Home;
