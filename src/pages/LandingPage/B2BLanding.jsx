import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChartLine, FaUsers, FaShieldAlt, FaRocket } from "react-icons/fa";
import "./B2BLanding.scss";

const FEATURES = [
  {
    title: "Data-Driven ROI",
    desc: "Track employee engagement and wellness improvements with our advanced HR Analytics Dashboard.",
    icon: <FaChartLine />,
  },
  {
    title: "Global Expert Network",
    desc: "24/7 access to certified mental, physical, and financial advisors for your entire workforce.",
    icon: <FaUsers />,
  },
  {
    title: "Secure & Compliant",
    desc: "Enterprise-grade security with SHA-256 API key management and HIPAA-compliant data handling.",
    icon: <FaShieldAlt />,
  },
  {
    title: "Seamless Integration",
    desc: "Custom API keys and webhooks to integrate wellness data into your existing HR systems.",
    icon: <FaRocket />,
  },
];

export default function B2BLanding() {
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
    <div className="b2b-landing">
      {/* ─── Hero Section ─── */}
      <section className="b2b-hero">
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="badge" variants={itemVariants}>Fmpire for Business</motion.div>
          <motion.h1 variants={itemVariants}>
            The Future of <span className="highlight">Employee Wellbeing</span> is Holistic.
          </motion.h1>
          <motion.p variants={itemVariants}>
            Empower your workforce with the only platform that integrates mental health, physical vitality, and financial security into a single, data-driven experience.
          </motion.p>
          <motion.div className="hero-ctas" variants={itemVariants}>
            <button className="primary-btn" onClick={() => window.open('https://calendly.com/', '_blank')}>Book a Demo</button>
            <Link to="/org-setup" className="secondary-btn">Start 14-Day Pilot</Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="dashboard-preview glass-card">
            {/* Mock Dashboard UI */}
            <div className="mock-nav"></div>
            <div className="mock-grid">
              <div className="mock-chart main"></div>
              <div className="mock-sidebar">
                <div className="mock-item"></div>
                <div className="mock-item"></div>
                <div className="mock-item"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className="b2b-features">
        <div className="section-header">
          <h2>Why Enterprises Choose Fmpire</h2>
          <p>Modern solutions for the modern workforce.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div 
              key={i} 
              className="feature-card glass-card"
              whileHover={{ y: -10 }}
            >
              <div className="icon-box">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Pillar Section ─── */}
      <section className="b2b-pillars">
        <div className="pillar-row">
          <div className="pillar-text">
            <span className="pill">The 3-Pillar Model</span>
            <h2>Mental, Physical, Financial. <br/> Integrated.</h2>
            <p>Unlike fragmented apps, Fmpire understands that financial stress affects mental focus, and mental health impacts physical energy. We close the loop.</p>
            <ul className="pillar-list">
              <li><strong>Mental:</strong> 1:1 Counseling & Daily Meditation</li>
              <li><strong>Physical:</strong> Doctor Routing & Bio-tracking</li>
              <li><strong>Financial:</strong> Wealth Planning & Security Tools</li>
            </ul>
          </div>
          <div className="pillar-visual glass-card">
            {/* 3D Pillar Art or Infographic */}
            <div className="pillar-blob"></div>
          </div>
        </div>
      </section>

      {/* ─── CTA Footer ─── */}
      <section className="b2b-cta-footer">
        <div className="footer-box glass-card">
          <h2>Ready to transform your workplace?</h2>
          <p>Join 50+ forward-thinking organizations using Fmpire to build resilient, high-performing teams.</p>
          <Link to="/org-setup" className="primary-btn white" style={{ textDecoration: 'none' }}>Get Started Now →</Link>
        </div>
      </section>
    </div>
  );
}
