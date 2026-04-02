import React from "react";
import BreathingGame from "../../components/BreathingGame/BreathingGame";
import DailyChallenge from "../../components/DailyChallenge/DailyChallenge";
import FocusTimer from "../../components/FocusTimer/FocusTimer";
import JournalPrompt from "../../components/JournalPrompt/JournalPrompt";
import StreakTracker from "../../components/StreakTracker/StreakTracker";
import { Positivity } from "../PositivityZone/Positivity";
import BackButton from "../../components/BackButton/BackButton";
import "./ZenZone.scss";

const ZenZone = () => {
  return (
    <div className="zen-zone">
      <BackButton />
      <header className="zen-header">
        <h1>🌿 Zen Zone</h1>
        <p className="zen-subtitle">
          Your mindful alternative to social media. Breathe, focus, reflect — feel better after, not worse.
        </p>
      </header>

      <div className="zen-grid">
        <div className="zen-card featured">
          <DailyChallenge />
        </div>

        <div className="zen-card">
          <StreakTracker />
        </div>

        <div className="zen-card wide">
          <BreathingGame />
        </div>

        <div className="zen-card wide">
          <FocusTimer />
        </div>

        <div className="zen-card wide">
          <JournalPrompt />
        </div>
      </div>

      <section className="zen-positivity-section">
        <h2>📖 Positive Reads</h2>
        <p className="section-subtitle">Curated content that uplifts — no algorithm rage-bait.</p>
        <Positivity />
      </section>
    </div>
  );
};

export default ZenZone;

