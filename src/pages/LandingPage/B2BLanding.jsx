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
            <div className="preview-header">
              <div className="header-left">
                <div className="dot red"></div>
                <div className="dot yellow"></div>
                <div className="dot green"></div>
                <span className="app-title">Fmpire HR Console</span>
              </div>
              <div className="header-right">
                <div className="mock-search"></div>
                <div className="mock-avatar"></div>
              </div>
            </div>
            
            <div className="preview-body">
              <aside className="preview-sidebar">
                <div className="nav-item active"></div>
                <div className="nav-item"></div>
                <div className="nav-item"></div>
                <div className="nav-item"></div>
                <div className="spacer"></div>
                <div className="nav-item bottom"></div>
              </aside>
              
              <main className="preview-main">
                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-label">Wellness Index</div>
                    <div className="stat-value">92%</div>
                    <div className="stat-trend">+4.2%</div>
                  </div>
                  <div className="stat-card highlight">
                    <div className="stat-label">Productivity</div>
                    <div className="stat-value">1.5x</div>
                    <div className="stat-trend">+12%</div>
                  </div>
                </div>
                
                <div className="chart-area">
                  <div className="chart-header">
                    <div className="chart-title">Engagement ROI</div>
                    <div className="chart-legend">
                      <span></span> Target
                      <span></span> Actual
                    </div>
                  </div>
                  <div className="visual-chart">
                    <div className="bar" style={{ height: '40%' }}></div>
                    <div className="bar" style={{ height: '60%' }}></div>
                    <div className="bar" style={{ height: '45%' }}></div>
                    <div className="bar" style={{ height: '80%' }}></div>
                    <div className="bar active" style={{ height: '95%' }}></div>
                  </div>
                </div>

                <div className="recent-activity">
                  <div className="activity-item">
                    <div className="item-icon"></div>
                    <div className="item-text">New Expert Session: Mental Focus</div>
                  </div>
                  <div className="activity-item">
                    <div className="item-icon"></div>
                    <div className="item-text">Health Checkup: 84% Completed</div>
                  </div>
                </div>
              </main>
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
            <motion.img 
              src="/three-pillar-model.png" 
              alt="3-Pillar Holistic Wellness Model" 
              className="pillar-illustration"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            />
            <div className="visual-glow"></div>
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
