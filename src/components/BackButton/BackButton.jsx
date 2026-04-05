import React from "react";
import "./BackButton.scss";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";

const BackButton = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button className="back-btn glass-card" onClick={handleBack} title="Go back to previous page">
      <FiChevronLeft className="back-icon" />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
