import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './WellnessPearl.scss';

export default function WellnessPearl({ last7 = [], streak = 0 }) {
  // Compute restorative states based on Detox Activity
  const { isBlooming, isResting, message } = useMemo(() => {
    let blooming = false;
    let resting = false;
    let msg = "Awaiting your mindful moments.";
    
    if (!last7 || last7.length === 0) {
      return { isBlooming: false, isResting: true, message: "Resting gently." };
    }

    const todayNode = last7.find(d => d.isToday);
    const todayIndex = last7.findIndex(d => d.isToday);
    // Find yesterday by going backwards safely if available
    const yesterdayNode = todayIndex > 0 ? last7[todayIndex - 1] : null;

    if (todayNode?.visited) {
      blooming = true;
      msg = "Your pearl is blooming today. You are present.";
    } else if (!todayNode?.visited && !yesterdayNode?.visited && yesterdayNode !== null) {
      resting = true;
      msg = "Resting in hibernation. Take all the time you need.";
    }

    return { isBlooming: blooming, isResting: resting, message: msg };
  }, [last7]);

  // Determine Visual Tier
  let tierClass = "tier-neutral";
  if (isBlooming) {
    if (streak >= 7) {
      tierClass = "tier-blooming-master";
    } else {
      tierClass = "tier-blooming";
    }
  } else if (isResting) {
    tierClass = "tier-hibernation";
  }

  // Animation values: Hibernation breathes very heavily/slowly, blooming is fluid.
  const breathingDuration = isResting ? 12 : isBlooming ? 6 : 8;

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
            rotate: isResting ? [0, 5, -5, 0] : [0, 90, 180, 360]
          }}
          transition={{ 
            scale: { duration: breathingDuration, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: isResting ? breathingDuration * 2 : breathingDuration * 3, repeat: Infinity, ease: "linear" }
          }}
        />
      </div>

      <div className="pearl-content">
        <h4>Wellness Pearl</h4>
        <div className="tier-display">
          <h2>{isResting ? "Hibernating" : isBlooming ? "Blooming" : "Awake"}</h2>
          {streak > 0 && !isResting && (
             <span className="streak-count">{streak} Day Flow</span>
          )}
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
}
