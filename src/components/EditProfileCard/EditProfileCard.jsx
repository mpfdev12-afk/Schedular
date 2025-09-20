import React, { useState } from "react";
import "./EditProfileCard.scss";
import { useDispatch, useSelector } from "react-redux";
import { sendDataToapi } from "../../utils/api";
import { toast } from "react-toastify";
import { Useraction } from "../../store/userSlice";
import { RoleAction } from "../../store/roleSlice";
import { FaUserCircle } from "react-icons/fa";

const EditProfileCard = ({ user, onEdit }) => {
  const role = useSelector((state) => state.role);
  const [loading, setLoading] = useState(false);

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

  const handleLogout = () => {
    setLoading(true);
    const apiPath = role === "advisor" ? "/advisors/logout" : "/users/logout";

    sendDataToapi(apiPath)
      .then(() => {
        toast.success("Profile Updated Successfully!");
        dispatch(Useraction.logoutUser());
        dispatch(RoleAction.logoutRole());
        window.location.href = "/";
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
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
      <button className="logOut" onClick={handleLogout} disabled={loading}>
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default EditProfileCard;
