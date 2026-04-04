import React, { useState, useEffect } from "react";
import "./LandingPage.scss";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import { FcGoogle } from "react-icons/fc";
import { TiVendorMicrosoft } from "react-icons/ti";
import { HiMail } from "react-icons/hi";
import { Link } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../components/Firebase/Firebase";
import { PositivityZone } from "../../components/PositivityZone/PositivityZone";
import { BlogData } from "../../data/BlogData";
import { News } from "../../data/News";
import { FaArrowDown } from "react-icons/fa";
import { Positivity } from "../PositivityZone/Positivity";
import axios from "axios";

const googleProvider = new GoogleAuthProvider();

const LandingPage = () => {
  const SignInWithGoogle = () => {
    signInWithPopup(auth, googleProvider);
  };

  const [mood, setMood] = useState(null);
  const [dailyTips, setDailyTips] = useState({
    mental: { content: "Loading your mental insight..." },
    physical: { content: "Loading your physical insight..." },
    financial: { content: "Loading your financial insight..." }
  });

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tips/daily`);
        if (response.data && response.data.data) {
          setDailyTips(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching daily tips:", error);
      }
    };
    fetchTips();
  }, []);

  const moods = [
    { emoji: "😊", label: "Happy", tip: "Spread the joy! Take a moment to share this feeling with someone today." },
    { emoji: "🧘", label: "Calm", tip: "Perfect state for deep work or planning your next wellness goal." },
    { emoji: "😴", label: "Tired", tip: "Your body needs rest. Consider a 10-minute power nap or early sleep." },
    { emoji: "🤯", label: "Stressed", tip: "Inhale for 4, hold for 4, exhale for 8. You've got this." },
    { emoji: "😔", label: "Sad", tip: "It's okay to feel this way. A short walk in nature might help clear your mind." }
  ];

  const scrollToPositivity = () => {
    const section = document.getElementById("positivity-start");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="main">
      <motion.div 
        className="landingPage"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="left" variants={itemVariants}>
          <motion.h1 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Start Your Journey
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Your all-in-one wellness companion. Connect, schedule, and thrive effortlessly.
          </motion.p>
          <motion.div className="cta-container" variants={itemVariants}>
            <button className="google" onClick={SignInWithGoogle}>
              <FcGoogle className="icon" /> Sign in with Google
            </button>
            <button>
              <TiVendorMicrosoft className="icon" /> Sign in with Microsoft
            </button>
            <span>Or</span>
            <Link className="link" to="/user/register">
              <HiMail className="icon" />
              Sign Up with Email
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="right"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.img 
            src="calender2.png" 
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>

      {/* --- Mood Widget (Moved up for early engagement) --- */}
      <motion.section 
        className="mood-widget-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mood-card">
          <h3>How are you feeling today?</h3>
          <div className="mood-options">
            {moods.map((m, idx) => (
              <button 
                key={idx} 
                onClick={() => setMood(m)}
                className={mood?.label === m.label ? 'active' : ''}
              >
                <span className="emoji">{m.emoji}</span>
                <span className="label">{m.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {mood && (
              <motion.div 
                key={mood.label}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mood-result"
              >
                <p><strong>Daily Tip:</strong> {mood.tip}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* --- Wellness Pillars Section --- */}
      <motion.section 
        className="pillars-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.h2 className="section-title" variants={itemVariants}>Master Your Well-being</motion.h2>
        <div className="pillars-grid">
          <motion.div className="pillar-card mental" variants={itemVariants}>
            <div className="pillar-icon">
              <img src="mental_3d.png" alt="Mental" />
            </div>
            <h3>Mental Clarity</h3>
            <p>Unlock focus and peace through guided meditation and expert counseling.</p>
          </motion.div>

          <motion.div className="pillar-card physical" variants={itemVariants}>
            <div className="pillar-icon">
              <img src="physical_3d.png" alt="Physical" />
            </div>
            <h3>Physical Vitality</h3>
            <p>Optimize your energy with personalized routines and professional guidance.</p>
          </motion.div>

          <motion.div className="pillar-card financial" variants={itemVariants}>
            <div className="pillar-icon">
              <img src="financial_3d.png" alt="Financial" />
            </div>
            <h3>Financial Security</h3>
            <p>Achieve peace of mind with smart planning and secure management tools.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Daily Wisdom (Triple Tips) --- */}
      <motion.section 
        className="daily-wisdom-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.3
            }
          }
        }}
      >
        <motion.h2 className="section-title" variants={itemVariants}>Daily Wisdom</motion.h2>
        <div className="wisdom-grid">
          <motion.div className="wisdom-card mental" variants={itemVariants}>
            <div className="card-header">
              <img src="mental_3d.png" alt="Mental Icon" />
              <span>Mental Insight</span>
            </div>
            <p>"{dailyTips.mental.content}"</p>
          </motion.div>

          <motion.div className="wisdom-card physical" variants={itemVariants}>
            <div className="card-header">
              <img src="physical_3d.png" alt="Physical Icon" />
              <span>Physical Vitality</span>
            </div>
            <p>"{dailyTips.physical.content}"</p>
          </motion.div>

          <motion.div className="wisdom-card financial" variants={itemVariants}>
            <div className="card-header">
              <img src="financial_3d.png" alt="Financial Icon" />
              <span>Financial Security</span>
            </div>
            <p>"{dailyTips.financial.content}"</p>
          </motion.div>
        </div>
      </motion.section>

      {/* --- How It Works Section --- */}
      <motion.section 
        className="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h2 className="section-title" variants={itemVariants}>Simple As 1-2-3</motion.h2>
        <div className="steps-container">
          <motion.div className="step" variants={itemVariants}>
            <div className="step-number">1</div>
            <h4>Quick Sign-up</h4>
            <p>Securely connect using your favorite social account in seconds.</p>
          </motion.div>
          <div className="step-connector" />
          <motion.div className="step" variants={itemVariants}>
            <div className="step-number">2</div>
            <h4>Find Your Expert</h4>
            <p>Browse through world-class advisors tailored to your specific needs.</p>
          </motion.div>
          <div className="step-connector" />
          <motion.div className="step" variants={itemVariants}>
            <div className="step-number">3</div>
            <h4>Start Thriving</h4>
            <p>Schedule your sessions and start your transformation journey today.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Trust Stats --- */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="stat">
            <span className="number">10k+</span>
            <span className="label">Happy Users</span>
          </div>
          <div className="stat">
            <span className="number">500+</span>
            <span className="label">Certified Experts</span>
          </div>
          <div className="stat">
            <span className="number">98%</span>
            <span className="label">Success Rate</span>
          </div>
          <div className="stat">
            <span className="medal">🛡️</span>
            <span className="label">Secure & Private</span>
          </div>
        </div>
      </section>
      <Positivity />
    </div>
  );
};

export default LandingPage;
