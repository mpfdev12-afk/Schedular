import React, { useState, useEffect } from "react";
import { fetchDataFromApi, sendDataToapi } from "../../../utils/api";
import { toast } from "react-toastify";
import { FaMoon, FaBed, FaSun } from "react-icons/fa";

export default function SleepTab() {
  const [sleep, setSleep] = useState({
    bedtime: "22:00",
    wakeTime: "06:00",
    quality: 3
  });
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchLog();
  }, []);

  const fetchLog = async () => {
    try {
      const res = await fetchDataFromApi(`/physical/log?date=${today}`);
      if (res?.success && res.data?.sleep) {
        setSleep(res.data.sleep);
      }
    } catch (err) {
      console.error("Failed to fetch sleep log:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedSleep) => {
    try {
      await sendDataToapi("/physical/log", {
        date: today,
        sleep: updatedSleep || sleep
      });
      toast.success("Sleep data saved");
    } catch (err) {
      toast.error("Failed to save sleep data");
    }
  };

  const calculateDuration = () => {
    const [bh, bm] = sleep.bedtime.split(":").map(Number);
    const [wh, wm] = sleep.wakeTime.split(":").map(Number);
    
    let bedDate = new Date(2000, 0, 1, bh, bm);
    let wakeDate = new Date(2000, 0, 2, wh, wm); // Assume next day
    
    let diff = (wakeDate - bedDate) / (1000 * 60 * 60);
    return diff.toFixed(1);
  };

  return (
    <div className="sleep-tab">
      <div className="sleep-summary glass-card">
        <FaMoon className="main-icon" />
        <div className="duration-display">
          <span className="val">{calculateDuration()}</span>
          <span className="unit">Hours Slept</span>
        </div>
      </div>

      <div className="sleep-inputs">
        <div className="input-group glass-card">
          <FaBed />
          <div className="label-side">
            <label>Bedtime</label>
            <input 
              type="time" 
              value={sleep.bedtime} 
              onChange={(e) => {
                const ns = { ...sleep, bedtime: e.target.value };
                setSleep(ns);
                handleSave(ns);
              }}
            />
          </div>
        </div>

        <div className="input-group glass-card">
          <FaSun />
          <div className="label-side">
            <label>Wake Time</label>
            <input 
              type="time" 
              value={sleep.wakeTime} 
              onChange={(e) => {
                const ns = { ...sleep, wakeTime: e.target.value };
                setSleep(ns);
                handleSave(ns);
              }}
            />
          </div>
        </div>
      </div>

      <div className="quality-selector glass-card">
        <label>Sleep Quality</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star} 
              className={`star ${sleep.quality >= star ? "filled" : ""}`}
              onClick={() => {
                const ns = { ...sleep, quality: star };
                setSleep(ns);
                handleSave(ns);
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
