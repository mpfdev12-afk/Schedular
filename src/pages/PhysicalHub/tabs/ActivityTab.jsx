import React, { useState, useEffect } from "react";
import { fetchDataFromApi, sendDataToapi } from "../../../utils/api";
import { toast } from "react-toastify";
import { FaRunning, FaWalking, FaBiking, FaPlus, FaCheck } from "react-icons/fa";

const WORKOUT_TYPES = [
  { id: "walking", label: "Walking", icon: <FaWalking /> },
  { id: "running", label: "Running", icon: <FaRunning /> },
  { id: "cycling", label: "Cycling", icon: <FaBiking /> },
  { id: "yoga",    label: "Yoga",    icon: "🧘" },
];

export default function ActivityTab() {
  const [steps, setSteps] = useState(0);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchLog();
  }, []);

  const fetchLog = async () => {
    try {
      const res = await fetchDataFromApi(`/physical/log?date=${today}`);
      if (res?.success && res.data) {
        setSteps(res.data.steps || 0);
        setWorkouts(res.data.workouts || []);
      }
    } catch (err) {
      console.error("Failed to fetch activity log:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedSteps, updatedWorkouts) => {
    setSaving(true);
    try {
      const res = await sendDataToapi("/physical/log", {
        date: today,
        steps: updatedSteps ?? steps,
        workouts: updatedWorkouts ?? workouts,
      });
      if (res?.success) toast.success("Activity saved");
    } catch (err) {
      toast.error("Failed to save activity");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="activity-tab">
      <div className="card-row">
        <div className="stats-card steps-card glass-card">
          <div className="card-icon">👣</div>
          <div className="card-info">
            <span className="label">Steps Today</span>
            <input 
              type="number" 
              value={steps} 
              onChange={(e) => setSteps(parseInt(e.target.value) || 0)}
              onBlur={() => handleSave(steps)}
            />
          </div>
          <button className="save-icon-btn" onClick={() => handleSave(steps)}>
            {saving ? "..." : <FaCheck />}
          </button>
        </div>

        <div className="stats-card vp-card glass-card">
          <div className="card-icon">🔥</div>
          <div className="card-info">
            <span className="label">Calories (Est.)</span>
            <div className="value">
              {Math.round(steps * 0.04 + workouts.reduce((acc, w) => acc + (w.durationMinutes * 5), 0))}
            </div>
          </div>
        </div>
      </div>

      <div className="workouts-section">
        <h3>Recent Workouts</h3>
        <div className="workout-grid">
          {WORKOUT_TYPES.map((type) => (
            <button 
              key={type.id} 
              className="workout-type-btn glass-card"
              onClick={() => {
                const newWorkouts = [...workouts, { type: type.id, durationMinutes: 30 }];
                setWorkouts(newWorkouts);
                handleSave(null, newWorkouts);
              }}
            >
              <div className="type-icon">{type.icon}</div>
              <span>{type.label}</span>
              <FaPlus className="add-plus" />
            </button>
          ))}
        </div>

        <div className="logged-workouts">
          {workouts.length > 0 ? (
            workouts.map((w, idx) => (
              <div key={idx} className="workout-item glass-card">
                <div className="item-icon">{WORKOUT_TYPES.find(t => t.id === w.type)?.icon || "🏋️"}</div>
                <div className="item-info">
                  <span className="type">{w.type.charAt(0).toUpperCase() + w.type.slice(1)}</span>
                  <span className="duration">{w.durationMinutes} mins</span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => {
                    const newWorkouts = workouts.filter((_, i) => i !== idx);
                    setWorkouts(newWorkouts);
                    handleSave(null, newWorkouts);
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">No workouts logged yet today.</div>
          )}
        </div>
      </div>
    </div>
  );
}
