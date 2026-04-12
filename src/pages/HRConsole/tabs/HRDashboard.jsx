import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { fetchDataFromApi } from "../../../utils/api";

const COLORS = ["#1a56db", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function HRDashboard({ org }) {
  const [stats, setStats] = useState(null);
  const [engagement, setEngagement] = useState(null);
  const [toolUsage, setToolUsage] = useState(null);
  const [adoption, setAdoption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDataFromApi("/hr/org/stats"),
      fetchDataFromApi("/hr/org/engagement"),
      fetchDataFromApi("/hr/org/tool-usage"),
      fetchDataFromApi("/hr/org/adoption"),
    ])
      .then(([statsRes, engRes, toolRes, adoptRes]) => {
        setStats(statsRes?.data);
        setEngagement(engRes?.data);
        setToolUsage(toolRes?.data);
        setAdoption(adoptRes?.data);
      })
      .catch((err) => console.error("HR Dashboard load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="hr-loading">Loading dashboard data...</div>;

  const pillarData = toolUsage?.byPillar?.filter(p => p.name !== "Platform") || [];

  return (
    <>
      <div className="hr-page-header">
        <div className="greeting">Welcome back{org?.name ? `, ${org.name}` : ""}</div>
        <div className="subtitle">Here's your organisation's wellness overview</div>
      </div>

      {/* ─── Top Stat Cards ─── */}
      <div className="hr-stats-grid">
        <div className="hr-stat-card">
          <div className="stat-label">Active Users</div>
          <div className="stat-value">
            {engagement?.dau || 0}
            <span style={{ fontSize: "0.9rem", color: "#64748b" }}>/{stats?.totalEmployees || 0}</span>
          </div>
          <div className="stat-sub positive">DAU today</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Weekly Engagement</div>
          <div className="stat-value">{engagement?.wauRatio || 0}%</div>
          <div className="stat-sub positive">{engagement?.wau || 0} users this week</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Avg Vitality Points</div>
          <div className="stat-value">{stats?.avgEmployeeVP || 0}</div>
          <div className="stat-sub">per employee</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Avg Streak</div>
          <div className="stat-value">{stats?.avgStreak || 0} days</div>
          <div className="stat-sub">consistency metric</div>
        </div>
      </div>

      {/* ─── Charts Row ─── */}
      <div className="hr-charts-row">
        <div className="hr-chart-card">
          <h4>Engagement Trend (12 weeks)</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={engagement?.dailyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="_id" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => v.slice(5)} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="activeUsers" stroke="#1a56db" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="hr-chart-card">
          <h4>Tool Utilisation by Pillar</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pillarData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={4}
                dataKey="count"
                nameKey="name"
              >
                {pillarData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
            {pillarData.map((p, i) => (
              <span key={p.name} style={{ fontSize: "0.75rem", color: "#475569" }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], marginRight: 4 }}></span>
                {p.name} ({p.count})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Adoption Funnel ─── */}
      <div className="hr-funnel">
        <h4>Adoption Funnel</h4>
        <div className="funnel-steps">
          <div className="funnel-step">
            <div className="funnel-value">{adoption?.registered || 0}</div>
            <div className="funnel-label">Registered</div>
          </div>
          <span className="funnel-arrow">→</span>
          <div className="funnel-step">
            <div className="funnel-value">{adoption?.onboarded || 0}</div>
            <div className="funnel-label">Onboarded</div>
          </div>
          <span className="funnel-arrow">→</span>
          <div className="funnel-step">
            <div className="funnel-value">{adoption?.active7d || 0}</div>
            <div className="funnel-label">Active (7d)</div>
          </div>
          <span className="funnel-arrow">→</span>
          <div className="funnel-step">
            <div className="funnel-value">{adoption?.retained30d || 0}</div>
            <div className="funnel-label">Retained (30d)</div>
          </div>
        </div>
      </div>

      {/* ─── Quick Stats Bar ─── */}
      <div className="hr-stats-grid">
        <div className="hr-stat-card">
          <div className="stat-label">Sessions Booked</div>
          <div className="stat-value">{stats?.totalAppointments || 0}</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Detox Activities</div>
          <div className="stat-value">{stats?.totalDetoxActivities || 0}</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Forum Posts</div>
          <div className="stat-value">{stats?.totalForumPosts || 0}</div>
        </div>
        <div className="hr-stat-card">
          <div className="stat-label">Active Batches</div>
          <div className="stat-value">{stats?.totalBatches || 0}</div>
        </div>
      </div>
    </>
  );
}
