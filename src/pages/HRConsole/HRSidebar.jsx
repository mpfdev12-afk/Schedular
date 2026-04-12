import React from "react";

const NAV_ITEMS = [
  { section: "Overview" },
  { key: "dashboard", label: "Dashboard", icon: "📊" },

  { section: "Engagement" },
  { key: "engagement", label: "Engagement Analytics", icon: "📈" },
  { key: "tool-usage", label: "Tool Utilisation", icon: "🛠" },
  { key: "adoption", label: "Adoption Funnel", icon: "🎯" },

  { section: "People" },
  { key: "departments", label: "Department Heatmap", icon: "👥" },
  { key: "sessions", label: "Session Utilisation", icon: "📅" },
  { key: "advisor-pool", label: "Advisor Pool", icon: "🧑‍⚕️" },

  { section: "Administration" },
  { key: "employees", label: "Employee Management", icon: "🧑‍💼" },
  { key: "branding", label: "White-labelling", icon: "🎨" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

export default function HRSidebar({ activeTab, setActiveTab, orgName, plan }) {
  return (
    <aside className="hr-sidebar">
      <div className="sidebar-header">
        <div className="brand">Fmpire for Business</div>
        {orgName && <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: 2 }}>{orgName}</div>}
        {plan && <span className="plan-badge">{plan}</span>}
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item, i) => {
          if (item.section) {
            return <div key={i} className="nav-section-label">{item.section}</div>;
          }
          return (
            <div
              key={item.key}
              className={`nav-item ${activeTab === item.key ? "active" : ""}`}
              onClick={() => setActiveTab(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        Wellbeing Console v1.0
      </div>
    </aside>
  );
}
