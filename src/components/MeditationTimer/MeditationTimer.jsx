import React, { useState, useEffect, useRef } from "react";
import "./MeditationTimer.scss";

const DURATIONS = [
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "20 min", seconds: 1200 },
];

export default function MeditationTimer() {
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [secondsLeft, setSecondsLeft] = useState(duration.seconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsLeft(duration.seconds);
    setRunning(false);
    setFinished(false);
  }, [duration]);

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const progress = ((duration.seconds - secondsLeft) / duration.seconds) * 100;
  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setFinished(false);
    setSecondsLeft(duration.seconds);
  };

  return (
    <div className={`meditation-timer ${running ? "meditating" : ""} ${finished ? "complete" : ""}`}>
      <h3>🧘 Meditation Timer</h3>
      <div className="duration-row">
        {DURATIONS.map((d) => (
          <button
            key={d.label}
            className={`dur-btn ${duration.label === d.label ? "active" : ""}`}
            onClick={() => setDuration(d)}
            disabled={running}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mandala-wrapper">
        <div className="mandala-ring" style={{ background: `conic-gradient(var(--color-mindfulness) ${progress}%, transparent ${progress}%)` }}>
          <div className="mandala-inner">
            {finished ? (
              <span className="done-msg">Namaste 🙏</span>
            ) : (
              <>
                <span className="time">{mins}:{secs}</span>
                <span className="hint">{running ? "Be present..." : "Choose & start"}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="med-controls">
        {finished ? (
          <button className="med-btn" onClick={reset}>Meditate Again</button>
        ) : (
          <>
            <button className="med-btn" onClick={() => setRunning(!running)}>
              {running ? "Pause" : "Begin"}
            </button>
            {secondsLeft < duration.seconds && (
              <button className="med-btn secondary" onClick={reset}>Reset</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

