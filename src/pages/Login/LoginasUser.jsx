import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LiveLogo from "../../components/Navbar/LiveLogo";
import "./Login.scss"; // Using unified premium styles

const LoginasUser = () => {
  const navigate = useNavigate();

  const onNav = (path) => {
    navigate(path);
  };

  return (
    <div className="login-page-wrapper">
      <div className="animated-bg-glow"></div>
      
      <div className="login-container">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="auth-glass-card"
          >
            <div className="selection-hub">
              <div className="login-branding">
                <div className="logo-glow-ring"></div>
                <LiveLogo size={64} />
                <h2>Select Portal</h2>
                <p className="login-subtitle">How are you logging in today?</p>
              </div>

              <div className="selection-grid">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  onClick={() => onNav("/loginCondition/login")} 
                  className="selection-card user-tile"
                >
                  <img src="/mental2.png" alt="User Portal" />
                  <span>User</span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  onClick={() => onNav("/loginCondition/loginAdvisor")} 
                  className="selection-card advisor-tile"
                >
                  <img src="/physical2.png" alt="Advisor Portal" />
                  <span>Advisor</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginasUser;
