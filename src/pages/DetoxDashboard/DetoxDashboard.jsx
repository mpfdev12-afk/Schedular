import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useDetoxSync from "../../hooks/useDetoxSync";
import WellnessPearl from "../../components/WellnessPearl/WellnessPearl";
import "./DetoxDashboard.scss";

export default function DetoxDashboard() {
  const navigate = useNavigate();
  const { weekData, streak: streakData, loading } = useDetoxSync();

  // Calm minutes from weekData
  const calmStats = useMemo(() => {
    if (!weekData || weekData.length === 0) {
      return { days: [], total: 0, todayMins: 0 };
    }
    let total = 0;
    const days = weekData.map((d, i) => {
      const mins = Math.round((d.calmSeconds || 0) / 60);
      total += mins;
      return {
        date: d.date,
        mins,
        label: new Date(d.date + "T00:00:00").toLocaleDateString("en", {
          weekday: "short",
        }),
      };
    });
    const todayEntry = weekData[weekData.length - 1];
    const todayMins = todayEntry ? Math.round((todayEntry.calmSeconds || 0) / 60) : 0;
    return { days, total, todayMins };
  }, [weekData]);

  // Week dots for streak
  const last7 = useMemo(() => {
    if (!weekData || weekData.length === 0) return [];
    const today = new Date().toISOString().slice(0, 10);
    return weekData.map((d) => {
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
  }, [weekData]);

  const streak = streakData.streak || 0;
  const nextMilestone = streakData.nextMilestone || 3;
  const progress = Math.min((streak / nextMilestone) * 100, 100);

  // Gratitude history from weekData
  const gratitudeHistory = useMemo(() => {
    if (!weekData) return [];
    return weekData
      .filter((d) => d.gratitude && d.gratitude.length > 0)
      .reverse();
  }, [weekData]);

  // Reflection history from weekData
  const reflectionHistory = useMemo(() => {
    if (!weekData) return [];
    return weekData
      .filter((d) => d.reflection && d.reflection.length > 0)
      .reverse();
  }, [weekData]);

  // Challenge history from weekData
  const challengeHistory = useMemo(() => {
    if (!weekData) return [];
    return weekData.filter((d) => d.challengeDone).reverse();
  }, [weekData]);

  const maxBarMins = Math.max(...calmStats.days.map((d) => d.mins), 1);

  if (loading) {
    return (
      <div className="detox-dashboard">
        <div className="detox-dash-ambience">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <header className="detox-dash-header">
          <button className="back-btn" onClick={() => navigate("/category")}>
            ← Back
          </button>
          <h1>🪷 Detox Mode</h1>
          <p className="dash-subtitle">Loading your calm journey…</p>
        </header>
      </div>
    );
  }

  return (
    <div className="detox-dashboard">
      <div className="detox-dash-ambience">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <header className="detox-dash-header">
        <button className="back-btn" onClick={() => navigate("/category")}>
          ← Back
        </button>
        <h1>🪷 Detox Mode</h1>
        <p className="dash-subtitle">
          Your calm journey — every moment away from the feed counts.
        </p>
      </header>

      {/* ─── Embodied Data Pearl ─── */}
      <section className="dash-section pearl-section" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: 0 }}>
        <WellnessPearl last7={last7} streak={streak} />
      </section>

      {/* ─── Stats Grid ─── */}
      <section className="stats-row">
        <div className="stat-card">
          <span className="stat-emoji">🧘</span>
          <div>
            <span className="stat-value">{calmStats.todayMins}</span>
            <span className="stat-label">min today</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">📊</span>
          <div>
            <span className="stat-value">{calmStats.total}</span>
            <span className="stat-label">min this week</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">🔥</span>
          <div>
            <span className="stat-value">{streak}</span>
            <span className="stat-label">day streak</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-emoji">✅</span>
          <div>
            <span className="stat-value">{challengeHistory.length}</span>
            <span className="stat-label">challenges done</span>
          </div>
        </div>
      </section>

      {/* ─── Calm Minutes Chart ─── */}
      <section className="dash-section">
        <h2>🌊 Calm Minutes — Last 7 Days</h2>
        <div className="calm-chart">
          {calmStats.days.map((d) => (
            <div key={d.date} className="chart-col">
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${(d.mins / maxBarMins) * 100}%` }}
                />
              </div>
              <span className="bar-val">{d.mins}</span>
              <span className="bar-day">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Streak Tracker ─── */}
      <section className="dash-section streak-section">
        <h2>🔥 Your Streak</h2>
        <div className="streak-big">
          <span className="streak-num">{streak}</span>
          <span className="streak-unit">day{streak !== 1 ? "s" : ""}</span>
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
          <span className="milestone-label">
            Next milestone: {nextMilestone} days 🏆
          </span>
        </div>
      </section>

      {/* ─── Gratitude History ─── */}
      <section className="dash-section">
        <h2>🙏 Gratitude History</h2>
        {gratitudeHistory.length === 0 ? (
          <p className="empty-state">
            No gratitude entries yet. Open the Detox toolkit and start writing!
          </p>
        ) : (
          <div className="history-list">
            {gratitudeHistory.map((h) => (
              <div key={h.date} className="history-card">
                <span className="history-date">{h.date}</span>
                <ul>
                  {(Array.isArray(h.gratitude) ? h.gratitude : [])
                    .filter(Boolean)
                    .map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Reflection History ─── */}
      <section className="dash-section">
        <h2>📝 Reflections</h2>
        {reflectionHistory.length === 0 ? (
          <p className="empty-state">
            No reflections yet. Tap the Detox button and write your first.
          </p>
        ) : (
          <div className="history-list">
            {reflectionHistory.map((h) => (
              <div key={h.date} className="history-card">
                <span className="history-date">{h.date}</span>
                <p className="reflection-text">
                  {h.reflection.length > 200
                    ? h.reflection.slice(0, 200) + "…"
                    : h.reflection}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Challenge Log ─── */}
      <section className="dash-section">
        <h2>🎯 Challenges Completed</h2>
        {challengeHistory.length === 0 ? (
          <p className="empty-state">
            Complete today's challenge from the Detox toolkit!
          </p>
        ) : (
          <div className="challenge-chips">
            {challengeHistory.map((d) => (
              <span key={d.date} className="challenge-chip">
                ✅ {d.date}{d.challengeTitle ? ` — ${d.challengeTitle}` : ""}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ─── Coming Soon ─── */}
      <section className="dash-section coming-soon-section">
        <h2>🔮 Coming Soon</h2>
        <p className="coming-soon-desc">
          We're building more ways to help you disconnect and recharge.
        </p>
        <div className="coming-soon-grid">
          <div className="coming-card locked">
            <span className="coming-emoji">🎵</span>
            <span className="coming-title">Healing Sounds</span>
            <span className="coming-tag">Soon</span>
          </div>
          <div className="coming-card locked">
            <span className="coming-emoji">🌿</span>
            <span className="coming-title">Nature Scapes</span>
            <span className="coming-tag">Soon</span>
          </div>
          <div className="coming-card locked">
            <span className="coming-emoji">🧠</span>
            <span className="coming-title">Body Scan</span>
            <span className="coming-tag">Soon</span>
          </div>
          <div className="coming-card locked">
            <span className="coming-emoji">🎧</span>
            <span className="coming-title">Guided Meditation</span>
            <span className="coming-tag">Soon</span>
          </div>
        </div>
      </section>
    </div>
  );
}
