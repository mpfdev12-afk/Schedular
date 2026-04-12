import React, { useState } from "react";
import "./PhysicalHub.scss";
import BackButton from "../../components/BackButton/BackButton";
import ActivityTab from "./tabs/ActivityTab";
import HydrationTab from "./tabs/HydrationTab";
import SleepTab from "./tabs/SleepTab";
import BodyTab from "./tabs/BodyTab";
import PhysicalInsightsTab from "./tabs/PhysicalInsightsTab";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: "track",    label: "Track",    icon: "📊" },
  { id: "water",    label: "Water",    icon: "💧" },
  { id: "sleep",    label: "Sleep",    icon: "😴" },
  { id: "body",     label: "Body",     icon: "⚖️" },
  { id: "insights", label: "Insights", icon: "📈" },
];

export default function PhysicalHub() {
  const [activeTab, setActiveTab] = useState("track");

  const renderTab = () => {
    switch (activeTab) {
      case "track":    return <ActivityTab />;
      case "water":    return <HydrationTab />;
      case "sleep":    return <SleepTab />;
      case "body":     return <BodyTab />;
      case "insights": return <PhysicalInsightsTab />;
      default:         return <ActivityTab />;
    }
  };

  return (
    <div className="physical-hub-container">
      <div className="hub-header">
        <BackButton />
        <div className="title-section">
          <h1>Physical Hub</h1>
          <p>Your daily wellness companion</p>
        </div>
      </div>

      <div className="hub-tabs-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="hub-tab-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
