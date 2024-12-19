import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";

const Result: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { leftFoot, rightFoot } = location.state || {}; // 전달된 데이터를 구조 분해

  const onClickBtn = () => {
    navigate("/");
  };

  // 데이터가 없을 경우 대체 화면
  if (!leftFoot || !rightFoot) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-300">
        <Typography variant="h4" className="mb-6 font-bold text-white">
          데이터가 없습니다.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClickBtn}
          style={{ fontSize: "16px", padding: "10px 20px" }}
        >
          메인으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 justify-center h-screen bg-blue-300">
      <Typography variant="h4" className="mb-6 font-bold">
        나의 발 분석 결과
      </Typography>

      <div className="flex gap-8">
        {/* 왼발 결과 카드 */}
        <Card className="w-80 shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold text-center">
              왼발
            </Typography>
            <Typography variant="h6" className="mb-2">
              길이: <span className="font-semibold">{leftFoot.length} cm</span>
            </Typography>
            <Typography variant="h6" className="mb-2">
              발볼: <span className="font-semibold">{leftFoot.width} cm</span>
            </Typography>
            <Typography variant="h6" className="mb-2">
              발등 높이:{" "}
              <span className="font-semibold">{leftFoot.height}</span>
            </Typography>
          </CardContent>
        </Card>

        {/* 오른발 결과 카드 */}
        <Card className="w-80 shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold text-center">
              오른발
            </Typography>
            <Typography variant="h6" className="mb-2">
              길이: <span className="font-semibold">{rightFoot.length} cm</span>
            </Typography>
            <Typography variant="h6" className="mb-2">
              발볼: <span className="font-semibold">{rightFoot.width} cm</span>
            </Typography>
            <Typography variant="h6" className="mb-2">
              발등 높이:{" "}
              <span className="font-semibold">{rightFoot.height}</span>
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={onClickBtn}
        style={{ fontSize: "16px", padding: "10px 20px" }}
      >
        다시 측정하기
      </Button>
    </div>
  );
};

export default Result;
