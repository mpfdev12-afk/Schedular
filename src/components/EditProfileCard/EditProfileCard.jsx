import React, { useState } from "react";
import "./EditProfileCard.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateDatatoapi } from "../../utils/api";
import { toast } from "react-toastify";
import { Useraction } from "../../store/userSlice";
import { FaUserCircle, FaCamera, FaTimes } from "react-icons/fa";

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
    learningMaterial: Array.isArray(user?.learningMaterial)
      ? user.learningMaterial.join(", ")
      : user?.learningMaterial || "",
    domain: Array.isArray(user?.domain)
      ? user.domain.join(", ")
      : user?.domain || "",

    // advisor-only fields
    specialization: user?.specialization || "",
    qualification: user?.qualification || "",
    experienceYears: user?.experienceYears || "",
    description: user?.description || "",
  });

  const dispatch = useDispatch();

  const handleUpdate = () => {
    setLoading(true);
    const apiPath = role === "advisor" ? "/advisors/updateProfile" : "/users/updateProfile";

    updateDatatoapi(apiPath, formData, "application/json")
      .then((res) => {
        toast.success("Profile Updated Successfully!");
        dispatch(Useraction.loginUser(res.data.data)); // Update store with new data
        onEdit(false);
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
        dispatch(Useraction.loginUser(res.data.data)); // Update store with new image
      })
      .catch((err) => toast.error(err?.response?.data?.message || "Image Upload Failed"))
      .finally(() => setImgLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="profile-card">
      <div className="closeButton">
        <button className="close-btn-inner" title="Close" onClick={onClose}>
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>✕</span>
        </button>
      </div>
      <div className="editButton">
        <button className="edit-btn" onClick={() => onEdit(true)}>
          Cancel
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
          <label className="image-upload-label" title="Change Profile Picture">
             <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={imgLoading}/>
             <div className="upload-icon-container">
               {imgLoading ? <span className="loader-ring"></span> : <FaCamera />}
             </div>
          </label>
        </div>
        <div className="profile-info">
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="input-edit"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-edit"
          />
        </div>
      </div>

      {/* Body */}
      <div className="session-details">
        {formData.dob && (
          <div className="detail-item">
            <strong>DOB:</strong>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="input-edit"
            />
          </div>
        )}

        <div className="detail-item">
          <strong>Phone:</strong>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-edit"
          />
        </div>

        <div className="detail-item">
          <strong>Gender:</strong>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input-edit"
          />
        </div>

        <div className="detail-item">
          <strong>Languages:</strong>
          <input
            type="text"
            name="languagesSpoken"
            value={formData.languagesSpoken}
            onChange={handleChange}
            className="input-edit"
          />
        </div>

        <div className="detail-item">
          <strong>Learning Material:</strong>
          <input
            type="text"
            name="learningMaterial"
            value={formData.learningMaterial}
            onChange={handleChange}
            className="input-edit"
          />
        </div>

        <div className="detail-item">
          <strong>Domain:</strong>
          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            className="input-edit"
          />
        </div>

        {/* Advisor fields */}
        {role === "advisor" && (
          <>
            <div className="detail-item">
              <strong>Specialization:</strong>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="input-edit"
              />
            </div>

            <div className="detail-item">
              <strong>Qualification:</strong>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="input-edit"
              />
            </div>

            <div className="detail-item">
              <strong>Experience:</strong>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="input-edit"
              />
            </div>

            <div className="detail-item">
              <strong>About:</strong>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-edit"
              />
            </div>
          </>
        )}

        {user?.createdAt && (
          <div className="detail-item">
            <strong>Joined:</strong> {user.createdAt.slice(0, 10)}
          </div>
        )}
      </div>

      {/* Action */}
      <button className="update-btn" onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Save Updates"}
      </button>
    </div>
  );
};

export default EditProfileCard;
