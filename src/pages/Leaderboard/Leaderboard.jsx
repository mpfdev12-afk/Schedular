import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchDataFromApi } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaMedal, FaUsers, FaUser } from "react-icons/fa";
import "./Leaderboard.scss";

export default function Leaderboard() {
  const [activeView, setActiveView] = useState("individuals");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user?.userData);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeView]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const endpoint = activeView === "individuals" ? "/leaderboard" : "/leaderboard/departments";
    try {
      const res = await fetchDataFromApi(endpoint);
      if (res?.success) {
        setData(activeView === "individuals" ? res.data.leaderboard : res.data);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy className="rank-icon gold" />;
    if (index === 1) return <FaMedal className="rank-icon silver" />;
    if (index === 2) return <FaMedal className="rank-icon bronze" />;
    return <span className="rank-number">{index + 1}</span>;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Fmpire Leaderboard</h1>
        <p>Rise to the top of {user?.organizationId?.name || "your organization"}</p>
        
        <div className="view-toggle">
          <button 
            className={activeView === "individuals" ? "active" : ""} 
            onClick={() => setActiveView("individuals")}
          >
            <FaUser /> Individuals
          </button>
          <button 
            className={activeView === "departments" ? "active" : ""} 
            onClick={() => setActiveView("departments")}
          >
            <FaUsers /> Departments
          </button>
        </div>
      </div>

      <div className="leaderboard-content">
        {loading ? (
          <div className="lb-loading">Calculating ranks...</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lb-list"
            >
              {data.length > 0 ? (
                data.map((item, index) => (
                  <div 
                    className={`lb-item ${user?._id === item._id ? "is-me" : ""}`} 
                    key={item._id}
                  >
                    <div className="rank-cell">
                      {getRankIcon(index)}
                    </div>
                    
                    <div className="avatar-cell">
                      {activeView === "individuals" ? (
                        <img 
                          src={item.profilepic || "/default-avatar.png"} 
                          alt={item.fullname} 
                          className="lb-avatar"
                        />
                      ) : (
                        <div className="lb-dept-icon"><FaUsers /></div>
                      )}
                    </div>

                    <div className="info-cell">
                      <div className="name">
                        {activeView === "individuals" ? item.fullname : item._id}
                        {user?._id === item._id && <span className="me-badge">You</span>}
                      </div>
                      <div className="sub">{item.department || `${item.memberCount || 0} members`}</div>
                    </div>

                    <div className="stats-cell">
                      <div className="vp-val">{Math.round(item.vitalityPoints || item.avgVP || 0)}</div>
                      <div className="vp-label">VP</div>
                    </div>
                    
                    <div className="streak-cell">
                      <div className="streak-val">{item.currentStreak || Math.round(item.avgStreak || 0)}</div>
                      <div className="streak-label">Streak</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="lb-empty">No ranking data available yet.</div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
