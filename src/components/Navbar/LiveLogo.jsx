import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LiveLogo = ({ size = 50 }) => {
  const [phase, setPhase] = useState(0); // 0: Clock, 1: Prisms

  useEffect(() => {
    // 7s total loop: 3.5s per phase
    const timer = setInterval(() => {
      setPhase((prev) => (prev === 0 ? 1 : 0));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="live-logo-container" style={{ width: size, height: size, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Phase 0: Vitality Clock Layer */}
      <motion.div
        animate={{ 
          opacity: phase === 0 ? 1 : 0,
          scale: phase === 0 ? [1, 1.05, 1] : 0.95
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ width: "100%", height: "100%", position: "absolute", zIndex: phase === 0 ? 2 : 1 }}
      >
        <img 
          src="/vitality-clock.png" 
          alt="Vitality Clock" 
          style={{ width: "100%", height: "100%", objectFit: "contain" }} 
        />
      </motion.div>

      {/* Phase 1: Pillar Prisms Layer */}
      <motion.div
        animate={{ 
          opacity: phase === 1 ? 1 : 0,
          y: phase === 1 ? [0, -6, 0] : 10
        }}
        transition={{ 
          opacity: { duration: 0.8 },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ width: "100%", height: "100%", position: "absolute", zIndex: phase === 1 ? 2 : 1 }}
      >
        <img 
          src="/pillar-prisms.png" 
          alt="Pillar Prisms" 
          style={{ width: "100%", height: "100%", objectFit: "contain" }} 
        />
      </motion.div>
    </div>
  );
};

export default LiveLogo;
