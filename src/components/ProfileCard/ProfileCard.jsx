import React, { useState } from "react";
import "./ProfileCard.scss";
import { useDispatch, useSelector } from "react-redux";
import { sendDataToapi } from "../../utils/api";
import { toast } from "react-toastify";
import { Useraction } from "../../store/userSlice";
import { RoleAction } from "../../store/roleSlice";
import { FaUserCircle, FaPen, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { capitalizeWords } from "../../utils/usableFunctions";

const ProfileCard = ({ user, onEdit, onClose }) => {
  const role = useSelector((state) => state.role);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    setLoading(true);
    const apiPath = role === "advisor" ? "/advisors/logout" : "/users/logout";

    sendDataToapi(apiPath)
      .then(() => {
        toast.success("Logout Successfully!");
        dispatch(Useraction.logoutUser());
        dispatch(RoleAction.logoutRole());
        window.location.href = "/";
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const formatDOB = (dob) => {
    if (!dob || dob.length !== 10) return dob;
    const day = dob.slice(8, 10);
    const month = dob.slice(5, 7);
    const year = dob.slice(0, 4);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const formatArrayOrString = (val) => {
    if (!val) return "N/A";
    return Array.isArray(val) ? val.join(", ") : val;
  };

  return (
    <div className={`profile-card ${role === 'advisor' ? 'advisor-glow' : 'user-glow'}`}>
      {/* Top Action Layer */}
      <div className="profile-actions-header">
        <button className="close-btn-minimal" title="Close Profile Modal" onClick={onClose}>
          <span className="close-icon-text">&#10005;</span>
        </button>
        <button className="edit-btn-premium" title="Edit Profile" onClick={() => onEdit(false)}>
          <FaPen className="edit-icon" /> <span>Edit Profile</span>
        </button>
      </div>

      {/* Header */}
      <div className="profile-header">
        <div className="profile-image-container">
          {user?.profilepic ? (
            <img src={user.profilepic} alt="Profile" className="profile-pic" />
          ) : (
            <div className="fallback-avatar">
              <FaUserCircle size={80} />
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{capitalizeWords(user?.fullname)}</h1>
          {user?.email && <p className="username">{user.email}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="session-details">
        {user?.dob && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="detail-item">
            <strong>DOB</strong>
            <span className="detail-value">{formatDOB(user.dob)}</span>
          </motion.div>
        )}

        {user?.contact?.phone && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="detail-item">
            <strong>Phone</strong>
            <span className="detail-value">{user.contact.phone}</span>
          </motion.div>
        )}

        {user?.gender && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="detail-item">
            <strong>Gender</strong>
            <span className="detail-value">{user.gender}</span>
          </motion.div>
        )}

        {/* Advisor Specific Fields */}
        {user?.specialization && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="detail-item">
            <strong>Expertise</strong>
            <span className="detail-value">{user.specialization}</span>
          </motion.div>
        )}

        {user?.experienceYears !== undefined && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="detail-item">
            <strong>Experience</strong>
            <span className="detail-value">{user.experienceYears} Years</span>
          </motion.div>
        )}

        {user?.domain && user.domain.length > 0 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="detail-item">
            <strong>Focus Areas</strong>
            <span className="detail-value">{formatArrayOrString(user.domain)}</span>
          </motion.div>
        )}

        {user?.createdAt && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="detail-item">
            <strong>Member Since</strong>
            <span className="detail-value">{user.createdAt.slice(0, 10)}</span>
          </motion.div>
        )}
      </div>

      {/* Action */}
      <button className="logOut" onClick={handleLogout} disabled={loading}>
        {loading ? "Signing out..." : "Log Out"}
      </button>
    </div>
  );
};

export default ProfileCard;
