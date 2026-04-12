import React, { useState, useEffect } from "react";
import "./Signin.scss"; // Note: We will use shared styles from Login.scss or similar
import "../Login/Login.scss"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../components/Firebase/Firebase";
import { setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrgBranding } from "../../context/OrgBrandingContext";
import LiveLogo from "../../components/Navbar/LiveLogo";
import Loader from "../../components/Loader/Loader";
import { sendDataToapi } from "../../utils/api";

export default function Signin() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { branding, isWhiteLabel } = useOrgBranding();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setFullname("");
    setEmail("");
    setPassword("");
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = { fullname, email, password };
      const response = await sendDataToapi("/users/register", JSON.stringify(formData), "application/json");
      
      setLoading(false);
      toast.success("Registration Successful!", { position: "top-center" });
      
      // Auto-login after registration or redirect to login
      const redir = searchParams.get("redirect");
      navigate(redir ? `/user/login?redirect=${redir}` : "/user/login");
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      toast.error(error.message || "Registration failed", { position: "bottom-center" });
    }
  };
  return (
    <>
      {loading && <Loader />}
      <div className="login-page-wrapper">
        <div className="animated-bg-glow"></div>
        
        <div className="login-container">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="auth-glass-card"
            >
              {/* Branding Header */}
              <div className="login-branding">
                <div className="logo-glow-ring"></div>
                {isWhiteLabel && branding?.logo ? (
                   <img src={branding.logo} alt="Org Logo" className="org-login-logo" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 20 }} />
                ) : (
                  <LiveLogo size={64} />
                )}
                <h2>{isWhiteLabel ? `Join ${branding?.name}` : "Create Account"}</h2>
                <p className="login-subtitle">
                  {isWhiteLabel 
                    ? "Authorized Corporate Onboarding" 
                    : "Start your wellness journey with Schedular"}
                </p>
              </div>

              <div className="login-form-area">
                {isWhiteLabel ? (
                  /* Block Registration on subdomains as requested */
                  <div className="registration-restricted-msg">
                    <div className="msg-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <h3>Registration Restricted</h3>
                    <p>
                      Self-registration is disabled for <strong>{branding?.name}</strong>. 
                      Please use the <strong>SSO</strong> option or sign in with your corporate account.
                    </p>
                    <Link to="/user/login" className="back-to-login-btn">
                      Back to Login
                    </Link>
                  </div>
                ) : (
                  /* Standard B2C Registration Form */
                  <form
                    onSubmit={handleRegister}
                    className="auth-form-premium"
                    autoComplete="off"
                  >
                    <div className="form-group">
                      <label>Full Name</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          placeholder="Your complete name"
                          value={fullname}
                          autoComplete="off"
                          required
                          onChange={(e) => setFullname(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <div className="input-wrapper">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          autoComplete="off"
                          required
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Password</label>
                      <div className="input-wrapper">
                        <input
                          type="password"
                          placeholder="Choose a strong password"
                          value={password}
                          autoComplete="new-password"
                          required
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="login-submit-btn"
                    >
                      {loading ? <span className="loader-dots">Creating...</span> : "Register"}
                    </motion.button>
                  </form>
                )}
              </div>

              {!isWhiteLabel && (
                <div className="switch-text-premium">
                  Already have an account? <Link to="/user/login">Login</Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
