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
  const [profileShow, setProfileShow] = useState(false);
  const [edit, setEdit] = useState(true);
  const [showBanner, setShowBanner] = useState(user?.isNewUser && role === "user");

  // Automated Advisor Onboarding
  useEffect(() => {
    if (user?.isNewUser && role === "advisor") {
      // Small timeout to let the dashboard render first for better UX
      const timer = setTimeout(() => {
        setProfileShow(true);
        setEdit(false); // Direct to Edit mode
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user, role]);

  const handleEditClick = (cancel) => {
    setEdit(cancel);
  };
  
  const onHandleCancel = (temp) => {
    setEdit(temp);
  };

  const triggerOnboarding = () => {
    setProfileShow(true);
    setEdit(false);
    setShowBanner(false);
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

        <div className="stat-card center">
          <div className="user-actions">
            <div
              className="profile-btn"
              onClick={() => setProfileShow(true)}
              title="My Profile"
            >
              {user.profilepic ? (
                <img src={user.profilepic} alt="Profile" className="profile-pic" />
              ) : (
                <FaUserCircle size={28} />
              )}
            </div>
          </div>
          <div className="title">
            <div className="stat-number">{capitalizeWords(user.fullname)}</div>
            <div className="muted">{user.email}</div>
          </div>
        </div>
      </div>

      {/* Modal for Profile */}
      <AnimatePresence>
        {profileShow && (
          <div className="modal-overlay" onClick={() => { setProfileShow(false); setEdit(true); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {edit ? (
                <ProfileCard 
                  user={user} 
                  onEdit={handleEditClick} 
                  onClose={() => { setProfileShow(false); setEdit(true); }} 
                />
              ) : (
                <EditProfileCard 
                  user={user} 
                  onEdit={onHandleCancel} 
                  onClose={() => { setProfileShow(false); setEdit(true); }} 
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Stats;
