import React, { useState } from "react";
import "./ProfileCard.scss";
import { useDispatch, useSelector } from "react-redux";
import { sendDataToapi } from "../../utils/api";
import { toast } from "react-toastify";
import { Useraction } from "../../store/userSlice";
import { RoleAction } from "../../store/roleSlice";
import { FaUserCircle, FaPen } from "react-icons/fa";
import { capitalizeWords } from "../../utils/usableFunctions";

const ProfileCard = ({ user, onEdit }) => {
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
    <div className="profile-card">
      <div className="editButton">
        <button className="edit-btn" onClick={() => onEdit(false)}>
          <FaPen size={16} />
        </button>
      </div>

      {/* Header */}
      <div className="profile-header">
        <div className="profile-image">
          {user?.profilepic ? (
            <img src={user.profilepic} alt="Profile" className="profile-pic" />
          ) : (
            <FaUserCircle size={80} color="#e0e0e0" />
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
          <div className="detail-item">
            <strong>DOB:</strong> {formatDOB(user.dob)}
          </div>
        )}

        {user?.contact?.phone && (
          <div className="detail-item">
            <strong>Phone:</strong> {user.contact.phone}
          </div>
        )}

        {user?.gender && (
          <div className="detail-item">
            <strong>Gender:</strong> {user.gender}
          </div>
        )}

        {user?.languagesSpoken && (
          <div className="detail-item">
            <strong>Languages:</strong> {formatArrayOrString(user.languagesSpoken)}
          </div>
        )}

        {/* Advisor Specific Fields */}
        {user?.specialization && (
          <div className="detail-item">
            <strong>Specialization:</strong> {user.specialization}
          </div>
        )}

        {user?.qualification && (
          <div className="detail-item">
            <strong>Qualification:</strong> {user.qualification}
          </div>
        )}

        {user?.experienceYears && (
          <div className="detail-item">
            <strong>Experience:</strong> {user.experienceYears} years
          </div>
        )}

        {user?.description && (
          <div className="detail-item">
            <strong>About:</strong> {user.description}
          </div>
        )}

        {user?.learningMaterial && (
          <div className="detail-item">
            <strong>Learning Material:</strong> {formatArrayOrString(user.learningMaterial)}
          </div>
        )}

        {user?.domain && (
          <div className="detail-item">
            <strong>Domain:</strong> {formatArrayOrString(user.domain)}
          </div>
        )}

        {user?.createdAt && (
          <div className="detail-item">
            <strong>Joined:</strong> {user.createdAt.slice(0, 10)}
          </div>
        )}
      </div>

      {/* Action */}
      <button className="logOut" onClick={handleLogout} disabled={loading}>
        {loading ? "Logging out..." : "LogOut"}
      </button>
    </div>
  );
};

export default ProfileCard;
