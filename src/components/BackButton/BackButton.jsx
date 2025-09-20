import React from "react";
import "./BackButton.scss";

const BackButton = () => {
  const handleBack = () => {
    window.history.back();
  };
  return (
    <button className="back-btn" onClick={handleBack}>
      Go Back
    </button>
  );
};

export default BackButton;
