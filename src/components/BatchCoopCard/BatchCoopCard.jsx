import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BatchCoopCard.scss';
import BatchChat from '../BatchChat/BatchChat';
import { FiMessageSquare } from 'react-icons/fi';

export default function BatchCoopCard({ batch }) {
  const [showChat, setShowChat] = useState(false);
  if (!batch) return null;

  const currentVP = batch.batchVitalityPoints || 0;
  const goalVP = batch.batchGoal || 1000;
  
  // Cap the visual fill at 100%
  const percentage = Math.min((currentVP / goalVP) * 100, 100);

  return (
    <>
      <div className="batch-coop-card">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />

        <div className="coop-info">
          <div className="badge">Community Co-Op</div>
          <h3>Positivity Vault</h3>
          <p>Your team's collective mindfulness and daily challenges fill the vault. Reach the goal to unlock a free 1-on-1 AMA session with your Advisor!</p>
          
          <div className="stats-row">
            <div className="stat-item">
              <span className="label">Current Group VP</span>
              <span className="value primary">{currentVP}</span>
            </div>
            <div className="stat-item">
              <span className="label">Next Milestone</span>
              <span className="value">{goalVP}</span>
            </div>
          </div>

          <div className="chat-hint">
            <FiMessageSquare className="icon" />
            <span>Join the conversation! Access the <strong>Live Batch Chat</strong> from the table below.</span>
          </div>
        </div>

        <div className="vessel-container">
          {/* Glow intensity increases as the vault fills */}
          <div 
            className="vessel-glow" 
            style={{ 
              opacity: 0.3 + (percentage / 100) * 0.7,
              transform: `scale(${1 + (percentage / 100) * 0.3})`
            }} 
          />
          
          <div className="vessel-glass">
            <motion.div 
              className="liquid-light"
              initial={{ height: 0 }}
              animate={{ height: `${percentage}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showChat && (
          <BatchChat 
            batchId={batch._id} 
            batchTitle={batch.topic} 
            onClose={() => setShowChat(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
