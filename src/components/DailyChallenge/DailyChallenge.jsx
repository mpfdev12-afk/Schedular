import React, { useState, useEffect } from "react";
import { getTodaysChallenge } from "../../data/dailyChallenges";
import useDetoxSync from "../../hooks/useDetoxSync";
import "./DailyChallenge.scss";

export default function DailyChallenge() {
  const challenge = getTodaysChallenge();
  const todayKey = `challenge_${new Date().toISOString().slice(0, 10)}`;
  const [completed, setCompleted] = useState(false);
  const { logChallenge } = useDetoxSync();

  useEffect(() => {
    setCompleted(localStorage.getItem(todayKey) === "done");
  }, [todayKey]);

  const markDone = () => {
    localStorage.setItem(todayKey, "done");
    setCompleted(true);
    // Update streak in localStorage
    const streak = parseInt(localStorage.getItem("zen_streak") || "0", 10);
    const lastDate = localStorage.getItem("zen_streak_date");
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (lastDate === yesterday || lastDate === today) {
      localStorage.setItem("zen_streak", (lastDate === today ? streak : streak + 1).toString());
    } else {
      localStorage.setItem("zen_streak", "1");
    }
    localStorage.setItem("zen_streak_date", today);
    // Sync to API
    logChallenge(challenge.title);
  };

  return (
    <div className={`daily-challenge ${completed ? "done" : ""}`}>
      <div className="challenge-badge">Today's Challenge</div>
      <div className="challenge-emoji">{challenge.emoji}</div>
      <h3>{challenge.title}</h3>
      <p>{challenge.description}</p>
      <span className="challenge-cat">{challenge.category}</span>
      {completed ? (
        <div className="completed-badge">✅ Completed!</div>
      ) : (
        <button className="mark-done-btn" onClick={markDone}>
          Mark as Done
        </button>
      )}
    </div>
  );
}
