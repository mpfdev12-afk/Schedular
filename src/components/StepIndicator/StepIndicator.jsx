import React from "react";
import "./StepIndicator.scss";
import { motion } from "framer-motion";

const STAGES = [
  { id: 1, label: "Domain" },
  { id: 2, label: "Session" },
  { id: 3, label: "Topic" },
  { id: 4, label: "Connect" },
];

const StepIndicator = ({ currentStep, category, showConnect = false }) => {
  const visibleStages = showConnect ? STAGES : STAGES.slice(0, 3);

  return (
    <div className={`step-indicator theme-${category?.toLowerCase()} ${showConnect ? "four-steps" : "three-steps"}`}>
      <div className="steps-container">
        {visibleStages.map((stage, index) => {
          const isActive = currentStep === stage.id;
          const isCompleted = currentStep > stage.id;

          return (
            <React.Fragment key={stage.id}>
              <div className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
                <motion.div 
                  className="step-number"
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive || isCompleted ? "var(--accent-color)" : "rgba(255, 255, 255, 0.1)"
                  }}
                >
                  {isCompleted ? "✓" : stage.id}
                </motion.div>
                <span className="step-label">{stage.label}</span>
              </div>
              {index < visibleStages.length - 1 && (
                <div className={`step-line ${isCompleted ? "filled" : ""}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
