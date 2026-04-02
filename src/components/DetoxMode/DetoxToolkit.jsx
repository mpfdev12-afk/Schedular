import React, { useState, useEffect, useRef, useCallback } from "react";
import { affirmations, getTodaysAffirmation } from "../../data/affirmations";
import { getTodaysChallenge } from "../../data/dailyChallenges";
import { getTodaysPrompt } from "../../data/affirmations";
import useDetoxSync from "../../hooks/useDetoxSync";
import "./DetoxToolkit.scss";

const BREATH_PHASES = [
  { key: "inhale", label: "Breathe in…", duration: 4 },
  { key: "hold", label: "Hold…", duration: 4 },
  { key: "exhale", label: "Breathe out…", duration: 4 },
  { key: "rest", label: "Rest…", duration: 4 },
];

export default function DetoxToolkit({ onClose }) {
  const [activeTab, setActiveTab] = useState("breathe");
  const [calmSeconds, setCalmSeconds] = useState(0);
  const calmRef = useRef(null);
  const { logCalm, logGratitude, logReflection, logChallenge } = useDetoxSync();

  // Calm timer
  useEffect(() => {
    calmRef.current = setInterval(() => setCalmSeconds((s) => s + 1), 1000);
    return () => clearInterval(calmRef.current);
  }, []);

  const calmMins = Math.floor(calmSeconds / 60);
  const calmSecs = calmSeconds % 60;

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [calmSeconds, onClose]);

  // Save calm minutes on close — now syncs to API
  const handleClose = useCallback(() => {
    if (calmSeconds > 0) {
      logCalm(calmSeconds);
    }
    onClose();
  }, [calmSeconds, onClose, logCalm]);

  const tabs = [
    { id: "breathe", emoji: "🌬️", label: "Breathe" },
    { id: "affirm", emoji: "✨", label: "Affirm" },
    { id: "gratitude", emoji: "🙏", label: "Gratitude" },
    { id: "challenge", emoji: "🎯", label: "Challenge" },
    { id: "reflect", emoji: "📝", label: "Reflect" },
  ];

  return (
    <div className="detox-overlay" onClick={handleClose}>
      <div className="detox-toolkit" onClick={(e) => e.stopPropagation()}>
        {/* Ambient background */}
        <div className="detox-ambience">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        {/* Header */}
        <header className="detox-header">
          <div className="header-top">
            <div className="calm-timer">
              <span className="calm-dot" />
              <span>
                {calmMins}:{calmSecs.toString().padStart(2, "0")} of calm
              </span>
            </div>
            <button
              className="close-btn"
              onClick={handleClose}
              aria-label="Close Detox Mode"
            >
              ✕
            </button>
          </div>
          <h2>Choose calm over chaos</h2>
          <p className="detox-subtitle">
            You chose yourself over the feed. Every second here counts.
          </p>
        </header>

        {/* Tab bar */}
        <nav className="detox-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-emoji">{tab.emoji}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="detox-content">
          {activeTab === "breathe" && <BreathePanel />}
          {activeTab === "affirm" && <AffirmPanel />}
          {activeTab === "gratitude" && <GratitudePanel logGratitude={logGratitude} />}
          {activeTab === "challenge" && <ChallengePanel logChallenge={logChallenge} />}
          {activeTab === "reflect" && <ReflectPanel logReflection={logReflection} />}
        </div>

        {/* Footer motivation */}
        <footer className="detox-footer">
          <TodayCalmSummary currentSeconds={calmSeconds} />
          <button
            className="view-dashboard-btn"
            onClick={() => {
              handleClose();
              window.location.href = "/detox";
            }}
          >
            📊 View your full Detox Dashboard →
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ─── Sub-panels ─── */

function BreathePanel() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [counter, setCounter] = useState(BREATH_PHASES[0].duration);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    let idx = 0;
    let sec = BREATH_PHASES[0].duration;
    setPhaseIdx(0);
    setCounter(sec);

    intervalRef.current = setInterval(() => {
      sec--;
      if (sec <= 0) {
        idx++;
        if (idx >= BREATH_PHASES.length) {
          idx = 0;
          setCycles((c) => c + 1);
        }
        sec = BREATH_PHASES[idx].duration;
        setPhaseIdx(idx);
      }
      setCounter(sec);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const phase = BREATH_PHASES[phaseIdx];
  const scale = running
    ? phase.key === "inhale"
      ? 1.5
      : phase.key === "exhale"
        ? 0.75
        : 1.15
    : 1;

  return (
    <div className="panel breathe-panel">
      <div className="breathe-visual">
        <div
          className={`breathe-orb ${running ? phase.key : "idle"}`}
          style={{
            transform: `scale(${scale})`,
            transition: `transform ${phase.duration}s ease-in-out`,
          }}
        >
          <span className="breathe-label">
            {running ? phase.label : "Tap to start"}
          </span>
          {running && <span className="breathe-counter">{counter}</span>}
        </div>
      </div>
      {cycles > 0 && (
        <p className="cycles-done">
          {cycles} cycle{cycles > 1 ? "s" : ""} complete ✓
        </p>
      )}
      <button
        className="panel-btn"
        onClick={() => {
          setRunning(!running);
          if (running) {
            setCycles(0);
          }
        }}
      >
        {running ? "Stop" : "Begin Breathing"}
      </button>
    </div>
  );
}

function AffirmPanel() {
  const [current, setCurrent] = useState(getTodaysAffirmation());
  const [animating, setAnimating] = useState(false);

  const shuffle = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(affirmations[Math.floor(Math.random() * affirmations.length)]);
      setAnimating(false);
    }, 400);
  };

  return (
    <div className="panel affirm-panel">
      <div className={`affirm-card ${animating ? "flip" : ""}`}>
        <p>"{current}"</p>
      </div>
      <button className="panel-btn outline" onClick={shuffle}>
        🔄 New Affirmation
      </button>
    </div>
  );
}

function GratitudePanel({ logGratitude }) {
  const todayKey = `detox_gratitude_${new Date().toISOString().slice(0, 10)}`;
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [allEntries, setAllEntries] = useState([]);

  useEffect(() => {
    const existing = localStorage.getItem(todayKey);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        setAllEntries(parsed);
      } catch (e) {
        /* ignore */
      }
    }
  }, [todayKey]);

  const save = () => {
    if (!entry.trim()) return;
    const updated = [...allEntries, entry.trim()];
    localStorage.setItem(todayKey, JSON.stringify(updated));
    setAllEntries(updated);
    setEntry("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Sync to API
    logGratitude(updated);
  };

  return (
    <div className="panel gratitude-panel">
      <p className="panel-prompt">
        What's one thing you're grateful for right now?
      </p>
      <div className="gratitude-input-row">
        <input
          type="text"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Something that made you smile…"
          onKeyDown={(e) => e.key === "Enter" && save()}
        />
        <button
          className={`panel-btn small ${saved ? "saved" : ""}`}
          onClick={save}
        >
          {saved ? "✓" : "+"}
        </button>
      </div>
      {allEntries.length > 0 && (
        <ul className="gratitude-list">
          {allEntries.map((e, i) => (
            <li key={i}>
              <span className="grat-num">{i + 1}.</span> {e}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChallengePanel({ logChallenge }) {
  const challenge = getTodaysChallenge();
  const todayKey = `challenge_${new Date().toISOString().slice(0, 10)}`;
  const [completed, setCompleted] = useState(false);

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
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);
    if (lastDate === yesterday || lastDate === today) {
      localStorage.setItem(
        "zen_streak",
        (lastDate === today ? streak : streak + 1).toString(),
      );
    } else {
      localStorage.setItem("zen_streak", "1");
    }
    localStorage.setItem("zen_streak_date", today);
    // Sync to API
    logChallenge(challenge.title);
  };

  return (
    <div className="panel challenge-panel">
      <div className="challenge-emoji-big">{challenge.emoji}</div>
      <h3>{challenge.title}</h3>
      <p className="challenge-desc">{challenge.description}</p>
      <span className="challenge-tag">{challenge.category}</span>
      {completed ? (
        <div className="completed-msg">✅ Completed today!</div>
      ) : (
        <button className="panel-btn" onClick={markDone}>
          Mark as Done
        </button>
      )}
    </div>
  );
}

function ReflectPanel({ logReflection }) {
  const prompt = getTodaysPrompt();
  const todayKey = `detox_reflect_${new Date().toISOString().slice(0, 10)}`;
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(todayKey);
    if (existing) {
      setText(existing);
      setSaved(true);
    }
  }, [todayKey]);

  const save = () => {
    if (!text.trim()) return;
    localStorage.setItem(todayKey, text);
    setSaved(true);
    // Sync to API
    logReflection(text);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="panel reflect-panel">
      <p className="panel-prompt">"{prompt}"</p>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        placeholder="Let your thoughts flow…"
        rows={4}
      />
      <div className="reflect-footer">
        <span className="word-count">{wordCount} words</span>
        <button
          className={`panel-btn small ${saved ? "saved" : ""}`}
          onClick={save}
        >
          {saved ? "✅ Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

function TodayCalmSummary({ currentSeconds }) {
  const today = new Date().toISOString().slice(0, 10);
  const prevSeconds = parseInt(
    localStorage.getItem(`detox_calm_${today}`) || "0",
    10,
  );
  const totalSeconds = prevSeconds + currentSeconds;
  const totalMins = Math.floor(totalSeconds / 60);

  return (
    <div className="calm-summary">
      <span className="calm-icon">🧘</span>
      <span>
        {totalMins > 0
          ? `${totalMins} min${totalMins > 1 ? "s" : ""} of calm today — you're choosing yourself`
          : "Every moment here is a win over doom-scrolling"}
      </span>
    </div>
  );
}
