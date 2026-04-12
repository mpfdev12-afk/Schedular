import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HRSidebar from "./HRSidebar";
import HRDashboard from "./tabs/HRDashboard";
import HREngagement from "./tabs/HREngagement";
import HRToolUsage from "./tabs/HRToolUsage";
import HRAdoption from "./tabs/HRAdoption";
import HRDepartments from "./tabs/HRDepartments";
import HRSessions from "./tabs/HRSessions";
import HREmployees from "./tabs/HREmployees";
import HRSettings from "./tabs/HRSettings";
import HRBranding from "./tabs/HRBranding";
import HRAdvisorPool from "./tabs/HRAdvisorPool";
import { fetchDataFromApi } from "../../utils/api";
import "./HRConsole.scss";

export default function HRConsole() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  
  console.log("HRConsole: Initializing for organization...");
  const user = useSelector((state) => state.user?.userData);
  const navigate = useNavigate();

  useEffect(() => {
    // Guard: only hr_admin / org_owner can access
    if (user && !["hr_admin", "org_owner"].includes(user.orgRole)) {
      navigate("/dashboard");
      return;
    }

    fetchDataFromApi("/org/")
      .then((res) => setOrg(res?.data))
      .catch((err) => console.error("Failed to load org:", err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div className="hr-loading">Loading Wellbeing Console...</div>;

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":    return <HRDashboard org={org} />;
      case "engagement":   return <HREngagement />;
      case "tool-usage":   return <HRToolUsage />;
      case "adoption":     return <HRAdoption />;
      case "departments":  return <HRDepartments />;
      case "sessions":     return <HRSessions />;
      case "advisor-pool": return <HRAdvisorPool />;
      case "employees":    return <HREmployees />;
      case "branding":     return <HRBranding org={org} onUpdate={(newOrg) => setOrg(newOrg)} />;
      case "settings":     return <HRSettings />;
      default:             return <HRDashboard org={org} />;
    }
  };

  return (
    <div className="hr-console">
      <HRSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orgName={org?.name}
        plan={org?.plan}
      />
      <main className="hr-main">
        {renderTab()}
      </main>
    </div>
  );
}
