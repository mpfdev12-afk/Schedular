import React from "react";
import "../Category/Category.scss";
import { useNavigate } from "react-router-dom";

const LoginasUser = () => {
  const navigate = useNavigate();

  const onNav = (path) => {
    navigate(path);
  };

  return (
    <div className="Category">
      <h1>You are Logging in as?</h1>
      <div className="category-grid">
        <div onClick={() => onNav("/loginCondition/login")} className="category-card">
          <img src="mental2.png"></img>
          <span>User</span>
        </div>
        <div onClick={() => onNav("/loginCondition/loginAdvisor")} className="category-card">
          <img src="physical2.png"></img>
          <span>Advisor</span>
        </div>
      </div>
    </div>
  );
};

export default LoginasUser;
