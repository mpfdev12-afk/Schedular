import React from "react";
import "./TableCard.scss";
import { FaUserCircle, FaTwitter, FaPalette, FaCamera, FaPaintBrush } from "react-icons/fa";
import {capitalizeWords} from '../../utils/usableFunctions.js'
const TableCard = ({ user}) => {
  return (
    <div className="profile-card">
      {/* Profile Header Section */}
      <div className="profile-header">
        <div className="profile-image">
          {user?.advisorId?.profilepic ? (
            <img
              src={user?.advisorId?.profilepic}
              alt="Profile"
              className="profile-pic"
            />
          ) : (
            <FaUserCircle size={80} color="#e0e0e0" />
          )}
        </div>
        <div className="profile-info">
          <h1>{user?.advisorId?.fullname || "Advisor Name"}</h1>
          <p className="username">@{user?.username || "advisor"}</p>
        </div>
      </div>

      {/* Profile Description
      <div className="profile-description">
        <p>{user?.bio || "Brand and communication strategy, graphic design, illustration, art direction and portrait photography."}</p>
        <p className="company">{user?.company || "Creative at Superblaise"}</p>
      </div>

      {/* Specialties Section }
      <div className="specialties">
        <div className="specialty">
          <FaPalette className="specialty-icon" />
          <span>Graphic Design</span>
        </div>
        <div className="specialty">
          <FaPaintBrush className="specialty-icon" />
          <span>Illustration</span>
        </div>
        <div className="specialty">
          <FaCamera className="specialty-icon" />
          <span>Photography</span>
        </div>
      </div> */}

      {/* Session Details */}
      <div className="session-details">

        {user?.details && (
          <div className="detail-item">
            <strong>Details:</strong> {user.details}
          </div>
        )}
        {user?.slotTime && (
        <div className="detail-item">
        <strong>Slot Time:</strong>{" "}
        {typeof user.slotTime === "object"
        ? `${user.slotTime.start} - ${user.slotTime.end}`
        : user.slotTime}
        </div>
        )}

        {user?.status && (
          <div className="detail-item">
            <strong>Status:</strong> {capitalizeWords(user.status)}
          </div>
        )}
        {user?.domain && (
          <div className="detail-item">
            <strong>Domain:</strong> {capitalizeWords(user.domain)}
          </div>
        )}
        {user?.topic && (
          <div className="detail-item">
            <strong>Topic:</strong> {capitalizeWords(user.topic)}
          </div>
        )}
        {user?.date && (
          <div className="detail-item">
            <strong>Date:</strong> {user.date}
          </div>
        )}
        {user?.startDate && (
          <div className="detail-item">
            <strong>Start Date:</strong> {user.startDate}
          </div>
        )}
        {user?.weekDay && (
          <div className="detail-item">
            <strong>Week Day:</strong> {user.weekDay}
          </div>
        )}
        {user?.maxAttendee && (
          <div className="detail-item">
            <strong>Max Attendees:</strong> {user.maxAttendee}
          </div>
        )}
        {user?.time && (
          <div className="detail-item">
            <strong>Time:</strong> {user.time}
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        className="join-btn"
        onClick={() => window.open(user?.meetlink || "/", "_blank")}
      >
        Join Session
      </button>
    </div>
  );
};

export default TableCard;
