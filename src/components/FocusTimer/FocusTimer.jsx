import React, { useState, useEffect, useRef } from "react";
import "./FocusTimer.scss";

const PRESETS = [
  { label: "Quick Focus", work: 15, rest: 3 },
  { label: "Pomodoro", work: 25, rest: 5 },
  { label: "Deep Work", work: 45, rest: 10 },
];

export default function FocusTimer() {
  const [preset, setPreset] = useState(PRESETS[1]);
  const [secondsLeft, setSecondsLeft] = useState(preset.work * 60);
  const [isWork, setIsWork] = useState(true);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(preset.work * 60);
    setIsWork(true);
    setRunning(false);
    setSessions(0);
  }, [preset]);

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (isWork) {
            setSessions((s) => s + 1);
            setIsWork(false);
            return preset.rest * 60;
          } else {
            setIsWork(true);
            return preset.work * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, isWork, preset]);

  const totalSec = isWork ? preset.work * 60 : preset.rest * 60;
  const progress = ((totalSec - secondsLeft) / totalSec) * 100;
  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setIsWork(true);
    setSecondsLeft(preset.work * 60);
    setSessions(0);
  };

  return (
    <div className="focus-timer">
      <h3>⏰ Focus Timer</h3>
      <div className="preset-row">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`preset-btn ${preset.label === p.label ? "active" : ""}`}
            onClick={() => setPreset(p)}
            disabled={running}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="timer-ring">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className="ring-bg" />
          <circle
            cx="60" cy="60" r="52"
            className="ring-progress"
            style={{
              strokeDasharray: `${2 * Math.PI * 52}`,
              strokeDashoffset: `${2 * Math.PI * 52 * (1 - progress / 100)}`,
            }}
          />
        </svg>
        <div className="timer-center">
          <span className="timer-phase">{isWork ? "Focus" : "Rest"}</span>
          <span className="timer-digits">{mins}:{secs}</span>
        </div>
      </div>
      <div className="timer-controls">
        <button className="ctrl-btn" onClick={() => setRunning(!running)}>
          {running ? "Pause" : "Start"}
        </button>
        <button className="ctrl-btn secondary" onClick={reset}>Reset</button>
      </div>
      {sessions > 0 && <p className="session-count">🎯 Sessions: {sessions}</p>}
    </div>
  );
}

