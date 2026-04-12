import React, { useState, useEffect } from "react";
import "./Login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/Firebase/Firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { sendDataToapi } from "../../utils/api";
import { useDispatch } from "react-redux";
import { Useraction } from "../../store/userSlice";
import { RoleAction } from "../../store/roleSlice";
import { motion, AnimatePresence } from "framer-motion";
import LiveLogo from "../../components/Navbar/LiveLogo";
import { useOrgBranding } from "../../context/OrgBrandingContext";
import { FEATURES } from "../../config/featureFlags";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { branding, isWhiteLabel } = useOrgBranding();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = { email, password };
    const formDataToSend = JSON.stringify(formData);
    sendDataToapi("/users/login", formDataToSend, "application/json")
      .then((res) => {
        setLoading(false);
        const userData = res?.data?.data?.user || res?.data?.user || res?.user || {};
        dispatch(Useraction.loginUser(userData));
        dispatch(RoleAction.loginRole("user"));
        toast.success("Login Successful");
        // Dynamic redirect check
        const redir = searchParams.get("redirect");
        if (redir) {
          navigate(redir);
        } else if (FEATURES.B2B_MODE && ["hr_admin", "org_owner"].includes(userData.orgRole)) {
          navigate("/hr-console");
        } else {
          navigate("/category");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
        toast.error(err.message, {
          position: "bottom-center",
        });
      });
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
              {/* Brand Branding */}
              <div className="login-branding">
                <div className="logo-glow-ring"></div>
                {isWhiteLabel && branding?.logo ? (
                   <img src={branding.logo} alt="Org Logo" className="org-login-logo" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 20 }} />
                ) : (
                  <LiveLogo size={64} />
                )}
                <h2>{isWhiteLabel ? `Sign in to ${branding?.name}` : "Welcome Back"}</h2>
                <p className="login-subtitle">{isWhiteLabel ? "Corporate Wellness Portal" : "Continue your wellness journey"}</p>
              </div>

              <div className="login-form-area">
                <form
                  onSubmit={handleLogin}
                  className="auth-form-premium"
                  autoComplete="off"
                >
                  {/* Standard Form Fields */}
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
                        placeholder="Enter your password"
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
                    {loading ? <span className="loader-dots">Logging in...</span> : "Sign In"}
                  </motion.button>
                </form>

                {/* Enterprise SSO Option */}
                {isWhiteLabel && (
                  <div className="sso-divider">
                    <div className="line"></div>
                    <span>OR</span>
                    <div className="line"></div>
                  </div>
                )}

                {isWhiteLabel && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="sso-login-btn"
                    onClick={() => {
                      const slug = window.location.hostname.split('.')[0];
                      // For local testing, we might need a fallback or prompt
                      const targetSlug = slug === 'localhost' ? branding?.slug : slug;
                      window.location.href = `${import.meta.env.VITE_API_URL}/v1/sso/saml/login/${targetSlug}`;
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Continue with {branding?.name || "SSO"}
                  </motion.button>
                )}
              </div>

              {!isWhiteLabel && (
                <div className="switch-text-premium">
                  Don't have an account? <Link to="/user/register">Create one</Link>
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
