import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";
import { fetchDataFromApi } from "../../../utils/api";

import EngagementHeatmap from "../components/EngagementHeatmap";

export default function HREngagement() {
  const [data, setData] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDataFromApi("/hr/org/engagement"),
      fetchDataFromApi("/hr/org/heatmap")
    ])
      .then(([engRes, heatRes]) => {
        setData(engRes?.data);
        setHeatmapData(heatRes?.data || []);
      })
      .catch((err) => console.error("Engagement load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="hr-loading">Loading engagement data...</div>;

  return (
    <>
      <div className="hr-page-header">
        <div className="greeting">Engagement Analytics</div>
        <div className="subtitle">Active user trends and engagement ratios</div>
      </div>

      <div className="hr-stats-grid">
        <div className="hr-stat-card">
          <div className="stat-label">DAU (Today)</div>
          <div className="stat-value">{data?.dau || 0}</div>
          <div className="stat-sub">{data?.dauRatio || 0}% of org</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">WAU (7 days)</div>
          <div className="stat-value">{data?.wau || 0}</div>
          <div className="stat-sub">{data?.wauRatio || 0}% of org</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">MAU (30 days)</div>
          <div className="stat-value">{data?.mau || 0}</div>
          <div className="stat-sub">{data?.mauRatio || 0}% of org</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Total Enrolled</div>
          <div className="stat-value">{data?.totalEmployees || 0}</div>
        </div>
      </div>

      <EngagementHeatmap data={heatmapData} />

      <div className="hr-chart-card" style={{ marginTop: 28, marginBottom: 28 }}>
        <h4>Daily Active Users — Last 12 Weeks</h4>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data?.dailyTrend || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="_id" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => v.slice(5)} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} />
            <Area type="monotone" dataKey="activeUsers" stroke="#1a56db" fill="#eff6ff" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
