import React from "react";
import "./ProfileCompletionBanner.scss";
import { motion } from "framer-motion";
import { FaMagic, FaArrowRight, FaTimes } from "react-icons/fa";

const ProfileCompletionBanner = ({ onAction, onDismiss }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="profile-completion-banner"
    >
      <div className="banner-glass-effect"></div>
      
      <div className="banner-content">
        <div className="icon-badge">
          <FaMagic className="sparkle-icon" />
        </div>
        
        <div className="text-section">
          <h3>Personalize Your Wellness Journey</h3>
          <p>Complete your profile to unlock tailored recommendations and a more meaningful experience.</p>
        </div>

        <div className="action-group">
          <button className="cta-btn" onClick={onAction}>
            <span>Complete Now</span>
            <FaArrowRight size={12} />
          </button>
          
          <button className="dismiss-btn" onClick={onDismiss} title="Dismiss">
            <FaTimes />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCompletionBanner;
