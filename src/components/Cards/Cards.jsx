import React from "react";
import "./Cards.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Cards = ({ advisor }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const goToCalender = () => {
    navigate(`${advisor._id}/${user?._id}`, { state: { advisor } });
  };

  function capitalizeWords(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const fullName = `${advisor.title || ""} ${advisor.fullname}`;
  const specialization = advisor.specialization || "Expert Advisor";
  const experience = advisor.experienceYears || "5+";
  const qualification = advisor.qualification || "Certified Professional";
  const languages = Array.isArray(advisor.languagesSpoken)
    ? advisor.languagesSpoken.join(", ")
    : advisor.languagesSpoken || "English";

  return (
    <motion.div 
      className={`advisor-card glass-card theme-${advisor.domain?.toLowerCase()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="card-inner">
        <div className="profile-section">
          <div className="avatar-wrapper">
            <img
              src={advisor.profilepic || "/no-profile.jpg"}
              alt={advisor.fullname}
              className="advisor-img"
            />
            <div className="status-indicator online" />
          </div>
          <div className="domain-tag">{capitalizeWords(advisor.domain)}</div>
        </div>

        <div className="content-section">
          <div className="card-header">
            <h3>{capitalizeWords(fullName)}</h3>
            <p className="specialization">{specialization}</p>
          </div>

          <div className="metrics">
            <div className="metric-item">
              <span className="label">Experience</span>
              <span className="value">{experience} Years</span>
            </div>
            <div className="metric-item">
              <span className="label">Languages</span>
              <span className="value">{languages}</span>
            </div>
          </div>

          <p className="qualification-text">{qualification}</p>

          <button className="book-btn" onClick={goToCalender}>
            Book 1-on-1 Session
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Cards;
