import React, { useState, useEffect, useRef } from "react";
import "./BreathingGame.scss";

const PATTERNS = {
  "Box Breathing": { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  "4-7-8 Calm": { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  "Deep Relax": { inhale: 5, hold1: 2, exhale: 7, hold2: 0 },
};

export default function BreathingGame() {
  const [pattern, setPattern] = useState("Box Breathing");
  const [phase, setPhase] = useState("idle"); // idle | inhale | hold1 | exhale | hold2
  const [counter, setCounter] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  const p = PATTERNS[pattern];
  const phases = [
    { key: "inhale", duration: p.inhale, label: "Breathe In" },
    { key: "hold1", duration: p.hold1, label: "Hold" },
    { key: "exhale", duration: p.exhale, label: "Breathe Out" },
    { key: "hold2", duration: p.hold2, label: "Hold" },
  ].filter((ph) => ph.duration > 0);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    let phaseIdx = 0;
    let sec = phases[0].duration;
    setPhase(phases[0].key);
    setCounter(sec);

    intervalRef.current = setInterval(() => {
      sec--;
      if (sec <= 0) {
        phaseIdx++;
        if (phaseIdx >= phases.length) {
          phaseIdx = 0;
          setCycles((c) => c + 1);
        }
        sec = phases[phaseIdx].duration;
        setPhase(phases[phaseIdx].key);
      }
      setCounter(sec);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, pattern]);

  const toggle = () => {
    if (running) {
      setRunning(false);
      setPhase("idle");
      setCounter(0);
    } else {
      setCycles(0);
      setRunning(true);
    }
  };

  const currentLabel = phases.find((ph) => ph.key === phase)?.label || "Ready";
  const bubbleScale = phase === "inhale" ? 1.5 : phase === "exhale" ? 0.8 : 1.15;

  return (
    <div className="breathing-game">
      <h3>🌬️ Breathing Game</h3>
      <div className="pattern-selector">
        {Object.keys(PATTERNS).map((name) => (
          <button
            key={name}
            className={`pat-btn ${pattern === name ? "active" : ""}`}
            onClick={() => { setPattern(name); setRunning(false); setPhase("idle"); }}
            disabled={running}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="bubble-container">
        <div
          className={`bubble ${phase}`}
          style={{ transform: `scale(${running ? bubbleScale : 1})`, transition: `transform ${phase === "inhale" ? p.inhale : phase === "exhale" ? p.exhale : 0.5}s ease-in-out` }}
        >
          <span className="bubble-text">{running ? currentLabel : "Start"}</span>
          {running && <span className="bubble-counter">{counter}</span>}
        </div>
      </div>
      {cycles > 0 && <p className="cycles">Cycles completed: {cycles} 🔄</p>}
      <button className="control-btn" onClick={toggle}>
        {running ? "Stop" : "Begin"}
      </button>
    </div>
  );
}

