import React from "react";
import MeditationTimer from "../../components/MeditationTimer/MeditationTimer";
import DailyAffirmation from "../../components/DailyAffirmation/DailyAffirmation";
import GratitudeJournal from "../../components/GratitudeJournal/GratitudeJournal";
import BreathingGame from "../../components/BreathingGame/BreathingGame";
import BackButton from "../../components/BackButton/BackButton";
import "./MindfulnessZone.scss";

const MindfulnessZone = () => {
  return (
    <div className="mindfulness-zone">
      <BackButton />
      <header className="mz-header">
        <h1>🧘 Mindfulness Zone</h1>
        <p className="mz-subtitle">
          Slow down. Breathe. Connect with your inner self. No rush, no noise — just you.
        </p>
      </header>

      <div className="mz-grid">
        <div className="mz-card">
          <DailyAffirmation />
        </div>

        <div className="mz-card">
          <GratitudeJournal />
        </div>

        <div className="mz-card">
          <MeditationTimer />
        </div>

        <div className="mz-card">
          <BreathingGame />
        </div>
      </div>
    </div>
  );
};

export default MindfulnessZone;

