import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../ProfileCard/ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import EditProfileCard from "../EditProfileCard/EditProfileCard";
import LiveLogo from "./LiveLogo";
import { useOrgBranding } from "../../context/OrgBrandingContext";

const Navbar = () => {
  const { branding, isWhiteLabel } = useOrgBranding();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedin, setLoggedin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileShow, setProfileShow] = useState(false);
  const [edit, setEdit] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.role);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <div className={`nav ${scrolled ? "scrolled" : ""}`}>
        {/* Logo & Brand */}
        <div className="left" onClick={() => {
          setIsMobileMenuOpen(false);
          if (!user?._id) navigate("/");
          else if (role === "advisor") navigate("/dashboard");
          else navigate("/category");
        }}>
          <div className="logo-wrapper">
            {isWhiteLabel && branding?.logo ? (
               <img src={branding.logo} alt="Org Logo" className="org-nav-logo" style={{ height: '36px', objectFit: 'contain' }} />
            ) : (
              <LiveLogo size={42} />
            )}
          </div>
          <span className="brand-name">{isWhiteLabel ? branding?.name : "Schedular"}</span>
        </div>

        {/* Links */}
        <div className="right">
          <span
            className="link"
            onClick={() => navigate(isLoggedin ? "/community" : "/community/welcome")}
          >
            Community
          </span>
          {isLoggedin && (
            <span
              className="link"
              onClick={() => navigate("/leaderboard")}
            >
              Leaderboard
            </span>
          )}

          {isLoggedin ? (
            <span
              className="link"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </span>
          ) : (
            <>
              <span className="link" onClick={() => navigate("/advisor/login")}>
                Login as Advisor
              </span>
              <span className="link for-business-link" onClick={() => navigate("/business")}>
                For Business
              </span>
            </>
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
          
          {/* Mobile Burger Button */}
          <div className="mobile-burger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <div 
              className="mobile-menu-backdrop" 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 9997 }}
            />
            <motion.div 
              className="mobile-dropdown-menu"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
            <div className="dropdown-content">
              <span 
                className="mobile-link" 
                onClick={() => {
                  navigate(isLoggedin ? "/community" : "/community/welcome");
                  setIsMobileMenuOpen(false);
                }}
              >
                Community
              </span>
              {isLoggedin && (
                <span 
                  className="mobile-link" 
                  onClick={() => {
                    navigate("/leaderboard");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Leaderboard
                </span>
              )}

              {isLoggedin ? (
                <span
                  className="mobile-link"
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </span>
              ) : (
                <>
                  <span
                    className="mobile-link"
                    onClick={() => {
                      navigate("/advisor/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login as Advisor
                  </span>
                  <span
                    className="mobile-link for-business-link"
                    onClick={() => {
                      navigate("/business");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    For Business
                  </span>
                </>
              )}

              {!isLoggedin && (
                <button 
                  className="mobile-login-btn" 
                  onClick={() => {
                    navigate("/user/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login as User
                </button>
              )}
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

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
              {edit ? <ProfileCard user={user} onEdit={handleEditClick} onClose={() => {setProfileShow(false);setEdit(true);}} />: <EditProfileCard user={user} onEdit={handleCancelClick} onClose={() => {setProfileShow(false);setEdit(true);}} />}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default Navbar;
