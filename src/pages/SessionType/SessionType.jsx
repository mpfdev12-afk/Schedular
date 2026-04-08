import React, { useMemo } from "react";
import "./SessionType.scss";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import { motion } from "framer-motion";
import {
  MentalIcon,
  PhysicalIcon,
  FinancialIcon,
} from "../../components/DomainIcons/DomainIcons";

const DOMAIN_CONFIG = {
  mental: {
    title: "Mental Wellness",
    subtitle: "Mind & Peace",
    color: "#6366f1",
    icon: <MentalIcon />,
    description: "Nurture your mindset and find emotional balance.",
  },
  physical: {
    title: "Physical Vitality",
    subtitle: "Body & Strength",
    color: "#10b981",
    icon: <PhysicalIcon />,
    description: "Boost your energy and strengthen your physical foundation.",
  },
  financial: {
    title: "Financial Growth",
    subtitle: "Wealth & Stability",
    color: "#1e40af",
    icon: <FinancialIcon />,
    description: "Manage your assets and secure your future trajectory.",
  },
};

import StepIndicator from "../../components/StepIndicator/StepIndicator";

const SessionType = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const config = useMemo(() => {
    return DOMAIN_CONFIG[category?.toLowerCase()] || DOMAIN_CONFIG.mental;
  }, [category]);

  const onNav = (path) => {
    navigate(path);
  };

  const sessions = [
    {
      id: "quick-session",
      title: "Quick Session",
      subtitle: "15-min Rapid Guidance",
      desc: "Immediate help for urgent clarity.",
      icon: config.icon,
    },
    {
      id: "habbit-learning",
      title: "Habit Schedular",
      subtitle: "Long-term Discipline",
      desc: "Structured routines for lasting change.",
      icon: config.icon,
    },
    {
      id: "learning",
      title: "Personalised Learning",
      subtitle: "Deep Domain Mastery",
      desc: "Curated paths for expert knowledge.",
      icon: config.icon,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className={`session-type theme-${category}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-glow" style={{ backgroundColor: config.color }}></div>
      <BackButton />

      <header className="session-header">
        <StepIndicator currentStep={2} category={category} />
        <span
          className="domain-pill"
          style={{ color: config.color, borderColor: config.color }}
        >
          {config.subtitle}
        </span>

        <div className="header-title-section">
          <h1>{config.title}</h1>
        </div>

        <p className="session-desc">{config.description}</p>

        {category === "financial" && (
          <motion.button
            className="finance-hub-pill"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={() => navigate("/financial-hub")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="pill-icon">💰</span>
            <span className="pill-text">My Finance Hub</span>
            <span className="pill-arrow">→</span>
          </motion.button>
        )}
      </header>

      <div className="session-grid">
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            onClick={() => onNav(session.id)}
            className="session-card glass-card"
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="icon-wrapper">{session.icon}</div>
            <div className="card-content">
              <span className="session-title">{session.title}</span>
              <span className="session-subtitle">{session.subtitle}</span>
              <p className="session-card-desc">{session.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SessionType;
