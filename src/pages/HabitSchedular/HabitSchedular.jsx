import React from "react";
import "./HabitSchedular.scss";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "../../components/BackButton/BackButton";
import StepIndicator from "../../components/StepIndicator/StepIndicator";

const HabitSchedular = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const onNav = (path) => {
    navigate(path);
  };

  const choiceVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const choices = [
    {
      id: "group",
      title: "Group Session",
      desc: "Learn within a supportive community.",
      comparison: "Best for social motivation and shared experiences.",
      icon: "👥",
      tag: "Community"
    },
    {
      id: "personal",
      title: "Personalized",
      desc: "One-on-one focused attention.",
      comparison: "Best for deep focus and tailored individual plans.",
      icon: "👤",
      tag: "Focused"
    }
  ];

  return (
    <motion.div 
      className={`habit-selection theme-${category?.toLowerCase()}`}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-glow" />
      <BackButton />

      <header className="habit-header">
        <StepIndicator currentStep={2} category={category} />
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Refine your <span>Habit</span> Journey</h1>
          <p>Choose the learning environment that best fits your momentum.</p>
        </motion.div>
      </header>

      <div className="habit-grid">
        {choices.map((choice, index) => (
          <motion.div 
            key={choice.id}
            onClick={() => onNav(choice.id)} 
            className="habit-card glass-card"
            variants={choiceVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            custom={index}
          >
            <div className="card-tag">{choice.tag}</div>
            <div className="card-icon">{choice.icon}</div>
            <div className="card-text">
              <span className="choice-title">{choice.title}</span>
              <p className="choice-desc">{choice.desc}</p>
            </div>
            <div className="comparison-box">
              <span className="comp-label">Highlight:</span>
              <p className="comp-text">{choice.comparison}</p>
            </div>
            <div className="card-btn">Select Mode</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HabitSchedular;
