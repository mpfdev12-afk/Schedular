import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { fetchDataFromApi } from "../../../utils/api";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

export default function PhysicalInsightsTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      const res = await fetchDataFromApi("/physical/week");
      if (res?.success) {
        // Reverse to show chronological order (Backend returns sorted by date DESC)
        setData([...res.data].reverse());
      }
    } catch (err) {
      console.error("Failed to fetch weekly summary:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="insights-loading">Analysing your trends...</div>;

  return (
    <div className="physical-insights-tab">
      <div className="insights-grid">
        <div className="insight-card glass-card">
          <h4>Steps Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} fontSize={10} stroke="#94a3b8" />
              <YAxis fontSize={10} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="steps" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="insight-card glass-card">
          <h4>Hydration (ml)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} fontSize={10} stroke="#94a3b8" />
              <YAxis fontSize={10} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
              <Line type="monotone" dataKey="waterMl" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="summary-section glass-card">
        <h3>Weekly Performance</h3>
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="label">Avg Steps</span>
            <span className="value">{Math.round(data.reduce((acc, curr) => acc + (curr.steps || 0), 0) / (data.length || 1))}</span>
          </div>
          <div className="summary-stat">
            <span className="label">Avg Sleep</span>
            <span className="value">
              {(data.reduce((acc, curr) => acc + (parseFloat(curr.sleep?.durationMinutes || 0)), 0) / ((data.length || 1) * 60)).toFixed(1)}h
            </span>
          </div>
          <div className="summary-stat">
            <span className="label">Active Days</span>
            <span className="value">{data.filter(d => (d.workouts?.length || 0) > 0).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
