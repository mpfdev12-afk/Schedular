import React, { useState } from "react";
import "./Stats.scss";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { capitalizeWords } from "../../utils/usableFunctions";
import ProfileCard from "../ProfileCard/ProfileCard";
import EditProfileCard from "../EditProfileCard/EditProfileCard"
import { motion, AnimatePresence } from "framer-motion";

const Stats = ({ stats,onEdit }) => {
  const user = useSelector((state) => state.user);
  const [profileShow, setProfileShow] = useState(false);
  const [edit,setEdit] = useState(true);

  const handleEditClick=(cancel)=>{
    setEdit(cancel);
  }
  const onHandleCancel=(temp)=>{
    setEdit(temp);
  }
  return (
    <section className="stats">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-body">
            <div className="stat-number">{stat.value}</div>
            <div className="muted">{stat.title}</div>
          </div>
        </div>
      ))}

      <div className="stat-card center">
        <div className="user-actions">
          {/* Profile button */}
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
        <div className="title">
          <div className="stat-number">{capitalizeWords(user.fullname)}</div>
          <div className="muted">{user.email}</div>
        </div>
      </div>

      {/* Modal for Profile */}
      <AnimatePresence>
        {profileShow && (
          <div className="modal-overlay" onClick={() => {setProfileShow(false);setEdit(true);}}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {edit ? (
                <ProfileCard 
                  user={user} 
                  onEdit={handleEditClick} 
                  onClose={() => {setProfileShow(false); setEdit(true);}} 
                />
              ) : (
                <EditProfileCard 
                  user={user} 
                  onEdit={onHandleCancel} 
                  onClose={() => {setProfileShow(false); setEdit(true);}} 
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Stats;
