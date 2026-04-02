import React from "react";
import useDetoxSync from "../../hooks/useDetoxSync";
import "./StreakTracker.scss";

export default function StreakTracker() {
  const { streak: streakData, weekData, loading } = useDetoxSync();

  const streak = streakData.streak || 0;
  const nextMilestone = streakData.nextMilestone || 3;
  const progress = Math.min((streak / nextMilestone) * 100, 100);

  // Generate last 7 days from weekData
  const last7 = (weekData || []).map((d) => {
    const today = new Date().toISOString().slice(0, 10);
    const visited =
      d.challengeDone ||
      (d.gratitude && d.gratitude.length > 0) ||
      (d.reflection && d.reflection.length > 0) ||
      d.calmSeconds > 0;
    return {
      day: new Date(d.date + "T00:00:00")
        .toLocaleDateString("en", { weekday: "short" })
        .charAt(0),
      visited,
      isToday: d.date === today,
    };
  });

  if (loading) {
    return (
      <div className="streak-tracker">
        <h3>🔥 Your Streak</h3>
        <div className="streak-number">
          <span className="big-num">…</span>
          <span className="label">loading</span>
        </div>
      </div>
    );
  }

  return (
    <div className="streak-tracker">
      <h3>🔥 Your Streak</h3>
      <div className="streak-number">
        <span className="big-num">{streak}</span>
        <span className="label">day{streak !== 1 ? "s" : ""}</span>
      </div>
      <div className="week-dots">
        {last7.map((d, i) => (
          <div key={i} className={`dot-col ${d.isToday ? "today" : ""}`}>
            <div className={`dot ${d.visited ? "active" : ""}`} />
            <span>{d.day}</span>
          </div>
        ))}
      </div>
      <div className="milestone-bar">
        <div className="bar-bg">
          <div className="bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="milestone-label">Next: {nextMilestone} days 🏆</span>
      </div>
    </div>
  );
}
