import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';
import { fetchDataFromApi } from '../../utils/api';
import { UsertableConfigs } from '../../components/Table/tableConfig';
import Table from '../../components/Table/Table';
import './AdminDashboard.scss';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("A - Z");

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, perfRes, growthRes, batchRes] = await Promise.all([
          fetchDataFromApi('/admin/platform-stats'),
          fetchDataFromApi('/admin/advisor-performance'),
          fetchDataFromApi('/admin/growth-metrics'),
          fetchDataFromApi('/batch/getallbatches')
        ]);
        
        setStats(statsRes?.data);
        setPerformance(perfRes?.data || []);
        setGrowth(growthRes?.data || []);
        setBatches(batchRes?.data || []);
      } catch (err) {
        console.error("Failed to load admin analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  if (loading) return <div className="admin-loading">Initializing Governance Hub...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-content">
        <header className="admin-header">
          <h2>The War Room <span className="muted">| Owners Hub</span></h2>
          <div className="admin-status">
            <div className="status-dot"></div>
            <span>Platform Online</span>
          </div>
        </header>

        {/* Global Metric Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="label">Total Platform Users</div>
            <div className="value">{stats?.totalUsers || 0}</div>
            <div className="trend positive">↑ High Growth</div>
          </div>
          <div className="admin-stat-card">
            <div className="label">Active Hired Advisors</div>
            <div className="value">{stats?.totalAdvisors || 0}</div>
            <div className="trend neutral">⇄ Steady Supply</div>
          </div>
          <div className="admin-stat-card">
            <div className="label">Platform Vitality (Total VP)</div>
            <div className="value">{stats?.totalPlatformVP?.toLocaleString() || 0}</div>
            <div className="trend positive">↑ High Engagement</div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="admin-charts-row">
          <div className="chart-container">
            <h4>User Growth Trends (6 Mo)</h4>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="_id" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h4>Domain Distribution</h4>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={stats?.domainDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {(stats?.domainDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Advisor CRM Performance Table */}
        <div className="admin-table-section">
          <h4>Advisor Performance CRM</h4>
          <table className="advisor-table">
            <thead>
              <tr>
                <th>Advisor Name</th>
                <th>Domain</th>
                <th>Active Batches</th>
                <th>Total Audience Reach</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((adv) => (
                <tr key={adv._id}>
                  <td><span className="advisor-name">{adv.fullname}</span></td>
                  <td><span className={`domain-pill ${adv.domain}`}>{adv.domain}</span></td>
                  <td>{adv.batchCount}</td>
                  <td>{adv.totalAttendees} Users</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Batch Moderation Table */}
        <div className="admin-table-section moderation">
          <h4>Live Batch Moderation Hub</h4>
          <Table 
             tableHeader={UsertableConfigs.Batches.header}
             TableContent={batches}
             SelectedFields={UsertableConfigs.Batches.fields}
             tableTitle="Global Wellness Batches"
             EmptyMessage="No active batches found for moderation."
             isMeetLink={false}
             total={batches.length}
             sortOrder={sortOrder}
             setSortOrder={setSortOrder}
             page={page}
             setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
