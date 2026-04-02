import React, { useState } from "react";
import { affirmations, getTodaysAffirmation } from "../../data/affirmations";
import "./DailyAffirmation.scss";

export default function DailyAffirmation() {
  const [current, setCurrent] = useState(getTodaysAffirmation());
  const [animating, setAnimating] = useState(false);

  const shuffle = () => {
    setAnimating(true);
    setTimeout(() => {
      const random = affirmations[Math.floor(Math.random() * affirmations.length)];
      setCurrent(random);
      setAnimating(false);
    }, 400);
  };

  return (
    <div className="daily-affirmation">
      <div className="glow-orb" />
      <h3>✨ Daily Affirmation</h3>
      <div className={`affirmation-card ${animating ? "flip" : ""}`}>
        <p>"{current}"</p>
      </div>
      <button className="shuffle-btn" onClick={shuffle}>
        🔄 New Affirmation
      </button>
    </div>
  );
}

