import React from 'react';
import { motion } from 'framer-motion';
import './WellnessPearl.scss';

export default function WellnessPearl({ vp = 0 }) {
  // Determine Tier based on Vitality Points
  const getTierInfo = () => {
    if (vp >= 500) return { class: 'tier-3', title: 'Zen Master', msg: 'Deeply Rooted.' };
    if (vp >= 100) return { class: 'tier-2', title: 'Mindful', msg: 'Growing awareness.' };
    return { class: 'tier-1', title: 'Seeker', msg: 'Begin your journey.' };
  };

  const { class: tierClass, title, msg } = getTierInfo();

  // The higher the tier, the deeper/faster the breathing animation
  const breathingDuration = vp >= 500 ? 5 : vp >= 100 ? 7 : 9;

  return (
    <div className={`wellness-pearl-widget ${tierClass}`}>
      <div className="pearl-visuals">
        {/* Ambient Outer Auras */}
        <div className="pearl-aura ambient-1" />
        <div className="pearl-aura ambient-2" />
        
        {/* Dynamic Core */}
        <motion.div 
          className="pearl-core"
          animate={{ 
            scale: [1, 1.15, 0.9, 1],
            rotate: [0, 90, 180, 360]
          }}
          transition={{ 
            scale: { duration: breathingDuration, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: breathingDuration * 3, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>

      <div className="pearl-content">
        <h4>Vitality Pearl</h4>
        <div className="tier-display">
          <h2>{title}</h2>
          <span className="vp-count">{vp} VP</span>
        </div>
        <p>{msg}</p>
      </div>
    </div>
  );
}
