import React, { useState, useEffect } from "react";
import { 
  FiMenu, FiSearch, FiX, FiCalendar, FiZap, FiUsers, 
  FiClock, FiCheckSquare, FiHeart, FiHelpCircle, FiSettings, FiShield, FiGlobe
} from "react-icons/fi";
import "./Sidebar.scss";
import { useNavigate } from "react-router-dom";
import LiveLogo from "../Navbar/LiveLogo";

export default function Sidebar({
  theme = "navy",
  searchText,
  setSearchText,
  onSelectTab,
  activeTab,
  tabs = [],
}) {
  const [currTime, setCurrTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();

  // Icon mapping for navigation
  const getIcon = (tabName) => {
    switch (tabName) {
      case "Appointments": return <FiCalendar />;
      case "Quick Sessions": return <FiZap />;
      case "Batches": return <FiUsers />;
      case "Past Events": return <FiClock />;
      case "My Tasks": return <FiCheckSquare />;
      case "Positivity Zone": return <FiHeart />;
      case "Help Center": return <FiHelpCircle />;
      case "Settings": return <FiSettings />;
      case "Control Hub": return <FiShield />;
      case "Community Feed": return <FiGlobe />;
      default: return <FiCalendar />;
    }
  };

  return (
    <div className={`main-sidebar theme-${theme}`}>
      <button className="hamburger" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
      
      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        {/* Branding Area */}
        <div className="sidebar-branding" onClick={() => navigate("/")}>
          <div className="logo-container">
            <LiveLogo size={42} />
          </div>
          <span className="brand-text">Schedular</span>
        </div>

        {/* Search */}
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            placeholder="Search filters..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul>
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`nav-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  onSelectTab(tab);
                  if (isOpen) setIsOpen(false);
                }}
              >
                <span className="nav-icon">{getIcon(tab)}</span>
                <span className="nav-text">{tab}</span>
                {activeTab === tab && <div className="active-indicator" />}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer / Track */}
        <div className="sidebar-footer">
          <div className="track-card">
            <div className="pulse-dot" />
            <div className="time-info">
              <div className="date-str">
                {currTime.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div className="time-str">
                {currTime.toLocaleTimeString("en-US", { hour12: false })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
