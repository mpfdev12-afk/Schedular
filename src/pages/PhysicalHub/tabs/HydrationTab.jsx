import React, { useState, useEffect } from "react";
import { fetchDataFromApi, sendDataToapi } from "../../../utils/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const WATER_GOAL = 2500; // 2.5 Liters

export default function HydrationTab() {
  const [waterMl, setWaterMl] = useState(0);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchLog();
  }, []);

  const fetchLog = async () => {
    try {
      const res = await fetchDataFromApi(`/physical/log?date=${today}`);
      if (res?.success && res.data) {
        setWaterMl(res.data.waterMl || 0);
      }
    } catch (err) {
      console.error("Failed to fetch hydration log:", err);
    } finally {
      setLoading(false);
    }
  };

  const addWater = async (amount) => {
    const newTotal = waterMl + amount;
    setWaterMl(newTotal);
    try {
      await sendDataToapi("/physical/log", {
        date: today,
        waterMl: newTotal
      });
      toast.info(`Added ${amount}ml of water`);
    } catch (err) {
      toast.error("Failed to save hydration");
    }
  };

  const percentage = Math.min((waterMl / WATER_GOAL) * 100, 100);

  return (
    <div className="hydration-tab">
      <div className="water-goal-circle glass-card">
        <div className="circle-bg">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <motion.circle 
              cx="50" cy="50" r="45" 
              fill="none" stroke="#10b981" strokeWidth="8"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
              strokeLinecap="round"
            />
          </svg>
          <div className="circle-content">
            <span className="current">{waterMl}ml</span>
            <span className="goal">Goal {WATER_GOAL}ml</span>
          </div>
        </div>
      </div>

      <div className="water-actions">
        {[200, 300, 500].map((amount) => (
          <button key={amount} className="water-btn glass-card" onClick={() => addWater(amount)}>
            <span className="icon">💧</span>
            <span>+{amount}ml</span>
          </button>
        ))}
        <button className="water-btn glass-card reset" onClick={() => {
          setWaterMl(0);
          sendDataToapi("/physical/log", { date: today, waterMl: 0 });
        }}>
          Reset
        </button>
      </div>

      <div className="hydration-tips glass-card">
        <h4>Did you know?</h4>
        <p>Drinking water first thing in the morning boosts your metabolism and jump-starts your energy levels.</p>
      </div>
    </div>
  );
}
