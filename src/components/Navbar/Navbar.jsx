import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../ProfileCard/ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import EditProfileCard from "../EditProfileCard/EditProfileCard";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedin, setLoggedin] = useState(false);
  const [profileShow, setProfileShow] = useState(false);
  const [edit,setEdit] = useState(true);
  const user = useSelector((state) => state.user);
  console.log(user);
  useEffect(() => {
    if (user && user._id) {
      setLoggedin(true);
    } else {
      setLoggedin(false);
    }
  }, [user]);
  const handleEditClick=(edit)=>{
    setEdit(edit);
    // console.log(edit);
  }
  const handleCancelClick=(cancel)=>{
    setEdit(cancel);
  }
  return (
    <div className="nav">
      {/* Logo */}
      <div className="left" onClick={() => navigate("/")}>
        <img src="/logo3.png" alt="Logo" />
      </div>

      {/* Links */}
      <div className="right">
        {isLoggedin ? (
          <span
            className="link"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </span>
        ) : (
          <span className="link" onClick={() => navigate("/advisor/login")}>
            Login as Advisor
          </span>
        )}

        {!isLoggedin && (
          <span className="login-btn" onClick={() => navigate("/user/login")}>
            Login as User
          </span>
        )}

        {isLoggedin && (
          <div className="user-actions">
            {/* Notification Icon */}
            <IoNotificationsOutline
              size={24}
              className="notification-icon"
              onClick={() => navigate("/notifications")}
            />

            {/* Profile Picture */}
            <div
              className="profile-btn"
              onClick={() => setProfileShow(true)}
              title="My Profile"
            >
              {user.profilepic ? (
                <img
                  src={user.profilepic}
                  alt="Profile"
                  className="profile-pic"
                />
              ) : (
                <FaUserCircle size={28} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {profileShow && (
  <div className="modal-overlay" onClick={() => {setProfileShow(false);setEdit(true);}}>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {edit ? <ProfileCard user={user} onEdit={handleEditClick} />: <EditProfileCard user={user} onEdit={handleCancelClick} />}
        <button
          className="close-btn"
          onClick={() => setProfileShow(false)}
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  </div>
)}
    </div>
  );
};

export default Navbar;
