import React, { useState, useEffect } from "react";
import { fetchDataFromApi } from "../../../utils/api";

export default function HRSessions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataFromApi("/hr/org/session-utilisation")
      .then((res) => setData(res?.data))
      .catch((err) => console.error("Session data load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="hr-loading">Loading session data...</div>;

  return (
    <>
      <div className="hr-page-header">
        <div className="greeting">Session Utilisation</div>
        <div className="subtitle">Advisor session booking and completion metrics (last 30 days)</div>
      </div>

      <div className="hr-stats-grid">
        <div className="hr-stat-card">
          <div className="stat-label">Sessions Booked</div>
          <div className="stat-value">{data?.sessionsBooked || 0}</div>
          <div className="stat-sub">last 30 days</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Sessions Completed</div>
          <div className="stat-value">{data?.sessionsCompleted || 0}</div>
          <div className="stat-sub">confirmed sessions</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Sessions Per Employee</div>
          <div className="stat-value">{data?.sessionsPerEmployee || 0}</div>
          <div className="stat-sub">avg per enrolled employee</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{data?.totalEmployees || 0}</div>
        </div>
      </div>
    </>
  );
}
