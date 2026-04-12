import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { fetchDataFromApi } from "../../../utils/api";

const COLORS = ["#1a56db", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function HRToolUsage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataFromApi("/hr/org/tool-usage")
      .then((res) => setData(res?.data))
      .catch((err) => console.error("Tool usage load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="hr-loading">Loading tool usage data...</div>;

  const detailed = data?.detailed || [];
  const byPillar = data?.byPillar || [];

  return (
    <>
      <div className="hr-page-header">
        <div className="greeting">Tool Utilisation</div>
        <div className="subtitle">Which wellness tools your employees use most</div>
      </div>

      <div className="hr-charts-row">
        <div className="hr-chart-card">
          <h4>Usage by Pillar (Last 30 Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={byPillar}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={100}
                paddingAngle={4}
                dataKey="count"
                nameKey="name"
              >
                {byPillar.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
            {byPillar.map((p, i) => (
              <span key={p.name} style={{ fontSize: "0.75rem", color: "#475569" }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], marginRight: 4 }}></span>
                {p.name}
              </span>
            ))}
          </div>
        </div>

        <div className="hr-chart-card">
          <h4>Detailed Action Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={detailed} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} />
              <YAxis type="category" dataKey="action" stroke="#94a3b8" fontSize={10} width={120} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} />
              <Bar dataKey="count" fill="#1a56db" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
