import React, { useState, useEffect } from "react";
import { fetchDataFromApi } from "../../../utils/api";

export default function HRAdoption() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataFromApi("/hr/org/adoption")
      .then((res) => setData(res?.data))
      .catch((err) => console.error("Adoption load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="hr-loading">Loading adoption data...</div>;

  const steps = [
    { label: "Registered", value: data?.registered || 0, color: "#eff6ff" },
    { label: "Onboarded", value: data?.onboarded || 0, color: "#ecfdf5" },
    { label: "Active (7d)", value: data?.active7d || 0, color: "#fef3c7" },
    { label: "Retained (30d)", value: data?.retained30d || 0, color: "#fce7f3" },
  ];

  const conversionRate = (from, to) => {
    if (!from || from === 0) return "—";
    return Math.round((to / from) * 100) + "%";
  };

  return (
    <>
      <div className="hr-page-header">
        <div className="greeting">Adoption Funnel</div>
        <div className="subtitle">Track employee journey from registration to retention</div>
      </div>

      <div className="hr-funnel">
        <h4>Employee Journey</h4>
        <div className="funnel-steps">
          {steps.map((step, i) => (
            <React.Fragment key={step.label}>
              {i > 0 && <span className="funnel-arrow">→</span>}
              <div className="funnel-step" style={{ background: step.color }}>
                <div className="funnel-value">{step.value}</div>
                <div className="funnel-label">{step.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="hr-stats-grid">
        <div className="hr-stat-card">
          <div className="stat-label">Registration → Onboarding</div>
          <div className="stat-value">{conversionRate(data?.registered, data?.onboarded)}</div>
          <div className="stat-sub">profile completion rate</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Onboarding → Active</div>
          <div className="stat-value">{conversionRate(data?.onboarded, data?.active7d)}</div>
          <div className="stat-sub">7-day activation rate</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Active → Retained</div>
          <div className="stat-value">{conversionRate(data?.active7d, data?.retained30d)}</div>
          <div className="stat-sub">30-day retention rate</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Overall Funnel</div>
          <div className="stat-value">{conversionRate(data?.registered, data?.retained30d)}</div>
          <div className="stat-sub">end-to-end conversion</div>
        </div>
      </div>
    </>
  );
}
