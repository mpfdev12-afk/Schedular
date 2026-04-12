import React, { useState, useEffect } from "react";
import { fetchDataFromApi, sendDataToapi } from "../../../utils/api";
import { toast } from "react-toastify";
import { FaWeight, FaPercentage, FaChartLine } from "react-icons/fa";

export default function BodyTab() {
  const [weight, setWeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchLog();
  }, []);

  const fetchLog = async () => {
    try {
      const res = await fetchDataFromApi(`/physical/log?date=${today}`);
      if (res?.success && res.data) {
        setWeight(res.data.weightKg || 0);
      }
    } catch (err) {
      console.error("Failed to fetch body log:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedWeight) => {
    try {
      await sendDataToapi("/physical/log", {
        date: today,
        weightKg: updatedWeight || weight
      });
      toast.success("Weight updated");
    } catch (err) {
      toast.error("Failed to save weight");
    }
  };

  return (
    <div className="body-tab">
      <div className="weight-display glass-card">
        <FaWeight className="main-icon" />
        <div className="val-section">
          <input 
            type="number" 
            step="0.1"
            value={weight} 
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            onBlur={() => handleSave(weight)}
          />
          <span className="unit">kg</span>
        </div>
        <p className="hint">Tap to update your weight</p>
      </div>

      <div className="body-stats-row">
        <div className="stat-box glass-card">
          <FaPercentage className="stat-icon" />
          <div className="details">
            <span className="label">Estimated BMI</span>
            <span className="value">23.4</span>
            <span className="sub">Normal</span>
          </div>
        </div>

        <div className="stat-box glass-card">
          <FaChartLine className="stat-icon" />
          <div className="details">
            <span className="label">Last Change</span>
            <span className="value">-0.5 kg</span>
            <span className="sub">last 7 days</span>
          </div>
        </div>
      </div>

      <div className="body-advice glass-card">
        <h4>Wellness Tip</h4>
        <p>Your weight fluctuates naturally throughout the day. For the most accurate tracking, weigh yourself at the same time every day, ideally in the morning after waking up.</p>
      </div>
    </div>
  );
}
