import React from "react";
import "./SessionType.scss";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";

const SessionType = () => {
  const navigate = useNavigate();

  const onNav = (path) => {
    navigate(path);
  };
  return (
    <div className="session-type">
      <BackButton />
      <h1>How do you need help for?</h1>
      <div className="session-grid">
        <div onClick={() => onNav("quick-session")} className="session-card">
          <img src="/QuickSession.png"></img>
          <span>Quick Session</span>
        </div>
        <div onClick={() => onNav("habbit-learning")} className="session-card">
          <img src="/HabitSchedular.png"></img>
          <span>Habbit Schedular</span>
        </div>
        <div onClick={() => onNav("learning")} className="session-card">
          <img src="/Personailsed.png"></img>
          <span>Personalised Learning</span>
        </div>
      </div>
    </div>
  );
};

export default SessionType;
