import React, { useState, useEffect } from "react";
import "./Stats.scss";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { capitalizeWords } from "../../utils/usableFunctions";
import ProfileCard from "../ProfileCard/ProfileCard";
import EditProfileCard from "../EditProfileCard/EditProfileCard";
import ProfileCompletionBanner from "./ProfileCompletionBanner";
import { motion, AnimatePresence } from "framer-motion";

const Stats = ({ stats, onEdit }) => {
  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.role);
  const [showBanner, setShowBanner] = useState(user?.isNewUser && role === "user");

  const triggerOnboarding = () => {
    setShowBanner(false);
    onEdit(); // Assuming parent handles showing the profile onboarding modal
  };

  return (
    <section className="stats">
      <AnimatePresence>
        {showBanner && (
          <ProfileCompletionBanner 
            onAction={triggerOnboarding} 
            onDismiss={() => setShowBanner(false)} 
          />
        )}
      </AnimatePresence>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-body">
              <div className="stat-number">{stat.value}</div>
              <div className="muted">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
