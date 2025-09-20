import React, { useState, useEffect } from "react";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";
import "./Sidebar.scss";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
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
  return (
    <div className="main-sidebar">
      <button className="hamburger" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>
      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/logo3.png" alt="Logo" />
        </div>

        <div className="search-box">
          <FiSearch />
          <input
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <nav>
          <ul>
            {tabs.map((tab) => (
              <li
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => {
                  onSelectTab(tab);
                  setIsOpen((prev) => !prev);
                }}
              >
                {tab}
              </li>
            ))}
          </ul>
        </nav>

        <div className="working-track">
          {/* <small>Working Track</small> */}
          <div className="track-card">
            <div className="dot" />
            <div>
              <div>
                {currTime.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div className="muted">
                {currTime.toLocaleTimeString("en-US", { hour12: false })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
