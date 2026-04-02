import React, { useState, useEffect } from "react";
import { getTodaysPrompt } from "../../data/affirmations";
import useDetoxSync from "../../hooks/useDetoxSync";
import "./JournalPrompt.scss";

export default function JournalPrompt() {
  const prompt = getTodaysPrompt();
  const todayKey = `journal_${new Date().toISOString().slice(0, 10)}`;
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const { logReflection } = useDetoxSync();

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
    <div className="journal-prompt">
      <h3>📝 Today's Journal</h3>
      <p className="prompt-text">"{prompt}"</p>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaved(false); }}
        placeholder="Start writing your thoughts..."
        rows={5}
      />
      <div className="journal-footer">
        <span className="word-count">{wordCount} words</span>
        <button className={`save-btn ${saved ? "saved" : ""}`} onClick={save}>
          {saved ? "✅ Saved" : "Save Entry"}
        </button>
      </div>
    </div>
  );
}
