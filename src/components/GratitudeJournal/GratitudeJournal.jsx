import React, { useState, useEffect } from "react";
import useDetoxSync from "../../hooks/useDetoxSync";
import "./GratitudeJournal.scss";

export default function GratitudeJournal() {
  const todayKey = `gratitude_${new Date().toISOString().slice(0, 10)}`;
  const [entries, setEntries] = useState(["", "", ""]);
  const [saved, setSaved] = useState(false);
  const { logGratitude } = useDetoxSync();

  useEffect(() => {
    const existing = localStorage.getItem(todayKey);
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        setEntries(parsed);
        setSaved(true);
      } catch (e) { /* ignore */ }
    }
  }, [todayKey]);

  const update = (index, value) => {
    const copy = [...entries];
    copy[index] = value;
    setEntries(copy);
    setSaved(false);
  };

  const save = () => {
    if (entries.every((e) => !e.trim())) return;
    localStorage.setItem(todayKey, JSON.stringify(entries));
    setSaved(true);
    // Sync to API
    logGratitude(entries.filter(Boolean));
  };

  // Past entries
  const [showHistory, setShowHistory] = useState(false);
  const getHistory = () => {
    const history = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const data = localStorage.getItem(`gratitude_${d}`);
      if (data) {
        try { history.push({ date: d, entries: JSON.parse(data) }); } catch (e) { /* ignore */ }
      }
    }
    return history;
  };

  return (
    <div className="gratitude-journal">
      <h3>🙏 Gratitude Journal</h3>
      <p className="subtitle">3 things you're grateful for today</p>
      <div className="entries">
        {entries.map((entry, i) => (
          <div className="entry-row" key={i}>
            <span className="entry-num">{i + 1}</span>
            <input
              type="text"
              value={entry}
              onChange={(e) => update(i, e.target.value)}
              placeholder={
                i === 0 ? "Something that made you smile..." :
                i === 1 ? "A person you appreciate..." :
                "A small win today..."
              }
            />
          </div>
        ))}
      </div>
      <div className="gj-footer">
        <button className="history-btn" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide" : "📅 Past Entries"}
        </button>
        <button className={`save-btn ${saved ? "saved" : ""}`} onClick={save}>
          {saved ? "✅ Saved" : "Save"}
        </button>
      </div>

      {showHistory && (
        <div className="history">
          {getHistory().length === 0 ? (
            <p className="empty">No past entries yet. Keep going!</p>
          ) : (
            getHistory().map((h) => (
              <div key={h.date} className="history-day">
                <span className="history-date">{h.date}</span>
                <ul>
                  {h.entries.filter(Boolean).map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
