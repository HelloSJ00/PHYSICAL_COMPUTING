import React from "react";
import Button from "@mui/material/Button";

interface SimpleBtnProps {
  text: string;
  onClick?: () => void;
}

const SimpleBtn: React.FC<SimpleBtnProps> = ({ text, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      alert("Button clicked!");
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      style={{ fontSize: "16px", padding: "10px 20px" }}
    >
      {text}
    </Button>
  );
};

export default SimpleBtn;
