import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchDataFromApi } from "../../../utils/api";

export default function HRDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataFromApi("/hr/org/departments")
      .then((res) => setDepartments(res?.data || []))
      .catch((err) => console.error("Departments load failed:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="hr-loading">Loading department data...</div>;

  const chartData = departments.map((d) => ({
    name: d._id,
    employees: d.count,
    avgVP: Math.round(d.avgVP || 0),
    avgStreak: Math.round(d.avgStreak || 0),
  }));

  return (
    <>
      <div className="hr-page-header">
        <div className="greeting">Department Heatmap</div>
        <div className="subtitle">Engagement breakdown by team (departments with 10+ employees only)</div>
      </div>

      {chartData.length === 0 ? (
        <div className="hr-chart-card">
          <p style={{ color: "#64748b", textAlign: "center", padding: 40 }}>
            No departments with 10+ employees found. Department data will appear once employees are assigned departments.
          </p>
        </div>
      ) : (
        <>
          <div className="hr-chart-card" style={{ marginBottom: 28 }}>
            <h4>Avg Vitality Points by Department</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }} />
                <Bar dataKey="avgVP" fill="#1a56db" radius={[4, 4, 0, 0]} name="Avg VP" />
                <Bar dataKey="avgStreak" fill="#10b981" radius={[4, 4, 0, 0]} name="Avg Streak" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="hr-dept-table">
            <h4>Department Details</h4>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Avg VP</th>
                  <th>Avg Streak</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((dept) => (
                  <tr key={dept.name}>
                    <td style={{ fontWeight: 600 }}>{dept.name}</td>
                    <td>{dept.employees}</td>
                    <td>{dept.avgVP}</td>
                    <td>{dept.avgStreak} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
