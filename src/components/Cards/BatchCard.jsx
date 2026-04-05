import React from "react";
import "./BatchCard.scss";
import { weekdays } from "../../data/Usabledata";
import { useSelector } from "react-redux";
import { sendDataToapi } from "../../utils/api";
import {
  capitalizeWords,
  formatDateToDDMMYYYY,
} from "../../utils/usableFunctions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const formatTime = (time) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

const BatchCard = ({ batch }) => {
  const {
    _id,
    topic,
    description,
    meetlink,
    domain,
    advisorId,
    slotTime,
    weekDay,
    maxAttendee,
    startDate,
    learningMaterial,
    attendees = [],
  } = batch;

  const navigate = useNavigate();
  const userId = useSelector((state) => state?.user?._id);

  const joinBatch = () => {
    const url = `/batch/join/${_id}`;
    const params = {
      userId,
      advisorId: advisorId?._id,
    };

    sendDataToapi(url, {}, "application/json", params)
      .then((res) => {
        toast.success("Batch Joined Successfully!");
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error("Join Batch Failed!");
        console.error("Join batch failed:", err);
      });
  };

  const isFull = attendees.length >= maxAttendee;

  return (
    <motion.div 
      className={`batch-card glass-card theme-${domain?.toLowerCase()}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="batch-header">
        <div className="advisor-info">
          <img src={advisorId.profilepic || "/no-profile.jpg"} alt={advisorId.fullname} className="advisor-avatar" />
          <div className="advisor-details">
            <h4>{`${advisorId.title || ""} ${capitalizeWords(advisorId.fullname)}`}</h4>
            <span className="domain-label">{capitalizeWords(domain)} Expert</span>
          </div>
        </div>
        <div className="batch-status">
          <span className={`status-pill ${isFull ? "full" : "available"}`}>
            {isFull ? "Batch Full" : `${maxAttendee - attendees.length} Slots Left`}
          </span>
        </div>
      </div>

      <div className="batch-content">
        <h3 className="topic-title">{capitalizeWords(topic)}</h3>
        <p className="description">{description || "Dive deep into this topic with guided group instruction and shared learning."}</p>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Starts On</span>
            <span className="value">{formatDateToDDMMYYYY(startDate)}</span>
          </div>
          <div className="info-item">
            <span className="label">Weekly Day</span>
            <span className="value">{weekDay}</span>
          </div>
          <div className="info-item">
            <span className="label">Timing</span>
            <span className="value">{`${slotTime.start} - ${slotTime.end}`}</span>
          </div>
          <div className="info-item">
            <span className="label">Community</span>
            <span className="value">{attendees.length} Members</span>
          </div>
        </div>

        <button 
          className={`join-btn ${isFull ? "disabled" : ""}`}
          onClick={joinBatch}
          disabled={isFull}
        >
          {isFull ? "Registration Closed" : "Join this Batch"}
        </button>
      </div>
    </motion.div>
  );
};

export default BatchCard;
