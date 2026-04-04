import React, { useState } from "react";
import "./EditProfileCard.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateDatatoapi } from "../../utils/api";
import { toast } from "react-toastify";
import { Useraction } from "../../store/userSlice";
import { FaUserCircle, FaCamera, FaTimes, FaUndo } from "react-icons/fa";
import { motion } from "framer-motion";

const EditProfileCard = ({ user, onEdit, onClose }) => {
  const role = useSelector((state) => state.role);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    dob: user?.dob || "",
    phone: user?.contact?.phone || "",
    gender: user?.gender || "",
    languagesSpoken: Array.isArray(user?.languagesSpoken)
      ? user.languagesSpoken.join(", ")
      : user?.languagesSpoken || "",
    specialization: user?.specialization || "",
    qualification: user?.qualification || "",
    experienceYears: user?.experienceYears || "",
    description: user?.description || "",
  });

  const dispatch = useDispatch();

  const handleUpdate = () => {
    setLoading(true);
    const apiPath = role === "advisor" ? "/advisors/updateProfile" : "/users/updateProfile";

    // Prepare data for backend (role-aware nesting)
    const submissionData = {
      ...formData,
      "contact[phone]": formData.phone,
      "contact[email]": formData.email,
      experienceYears: Number(formData.experienceYears) || 0,
      languagesSpoken: formData.languagesSpoken
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    };

    // Clean up flat phone/email if needed (backend uses contact object)
    delete submissionData.phone;

    updateDatatoapi(apiPath, submissionData, "application/json")
      .then((res) => {
        toast.success("Profile Updated Successfully!");
        dispatch(Useraction.loginUser(res.data.data));
        onEdit(true); // Switch back to view mode
      })
      .catch((err) => toast.error(err?.response?.data?.message || "Update Failed"))
      .finally(() => setLoading(false));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImgLoading(true);
    const form = new FormData();
    form.append("profilepic", file);

    const apiPath = role === "advisor" ? "/advisors/updateProfilePic" : "/users/updateProfilePic";
    
    updateDatatoapi(apiPath, form, "")
      .then((res) => {
        toast.success("Image Updated Successfully!");
        dispatch(Useraction.loginUser(res.data.data));
      })
      .catch((err) => toast.error(err?.response?.data?.message || "Image Upload Failed"))
      .finally(() => setImgLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`edit-profile-card ${role === 'advisor' ? 'advisor-mode' : 'user-mode'}`}>
      <div className="action-control-layer">
        <button className="close-action-modal" title="Close Profile Modal" onClick={onClose}>
          <span className="close-icon-text">&#10005;</span>
        </button>

        <button className="back-action-btn" title="Cancel changes and go back" onClick={() => onEdit(true)}>
          <FaUndo size={14} /> <span>Cancel Changes</span>
        </button>
      </div>

      {/* Header with Identity */}
      <div className="edit-header">
        <div className="edit-image-section">
          {user?.profilepic ? (
            <img src={user.profilepic} alt="Profile" className="edit-pic" />
          ) : (
            <FaUserCircle size={100} color="#e2e8f0" />
          )}
          <label className="camera-trigger">
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={imgLoading}/>
            {imgLoading ? <div className="loader-ring"></div> : <FaCamera />}
          </label>
        </div>
        <div className="header-inputs-grid">
          <div className="edit-identity-input">
            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              placeholder="Enter your name"
              value={formData.fullname}
              onChange={handleChange}
            />
          </div>
          <div className="edit-identity-input email-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Scrollable Detail Fields */}
      <div className="scroll-area">
        {role === "advisor" && (
          <>
            <div className="field-group">
              <label>Professional Specialization</label>
              <input
                type="text"
                name="specialization"
                placeholder="e.g. Clinical Psychologist"
                value={formData.specialization}
                onChange={handleChange}
                className="premium-field"
              />
            </div>
            <div className="field-group">
              <label>Years of Experience</label>
              <input
                type="number"
                name="experienceYears"
                placeholder="e.g. 5"
                value={formData.experienceYears}
                onChange={handleChange}
                className="premium-field"
              />
            </div>
            <div className="field-group">
              <label>Professional Bio</label>
              <textarea
                name="description"
                placeholder="Briefly describe your expertise..."
                value={formData.description}
                onChange={handleChange}
                className="premium-field"
              />
            </div>
          </>
        )}

        <div className="field-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="premium-field"
          />
        </div>

        <div className="field-group">
          <label>Contact Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            className="premium-field"
          />
        </div>

        <div className="field-group">
          <label>Gender Identification</label>
          <input
            type="text"
            name="gender"
            placeholder="e.g. Non-binary"
            value={formData.gender}
            onChange={handleChange}
            className="premium-field"
          />
        </div>
      </div>

      <button className="save-action-btn" onClick={handleUpdate} disabled={loading}>
        {loading ? "Saving Changes..." : "Save Profile Updates"}
      </button>
    </div>
  );
};

export default EditProfileCard;
