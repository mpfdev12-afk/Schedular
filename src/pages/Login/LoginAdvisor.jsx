import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import { sendDataToapi } from "../../utils/api";
import { useDispatch } from "react-redux";
import { Useraction } from "../../store/userSlice";
import { RoleAction } from "../../store/roleSlice";
import { motion, AnimatePresence } from "framer-motion";
import LiveLogo from "../../components/Navbar/LiveLogo";
import "./Login.scss"; // Reuse the premium styles

const LoginAdvisor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { email, password };

    try {
      const res = await sendDataToapi(
        "/advisors/login",
        JSON.stringify(payload),
        "application/json"
      );
      const userData = res?.data?.data?.user || res?.data?.user || res?.user || {};
      dispatch(Useraction.loginUser(userData));
      dispatch(RoleAction.loginRole("advisor"));
      toast.success("Login Successful");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Login failed", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
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
              {/* Advisor Branding */}
              <div className="login-branding">
                <div className="logo-glow-ring"></div>
                <LiveLogo size={64} />
                <h2>Advisor Login</h2>
                <p className="login-subtitle">Empower others on their journey</p>
              </div>

              <div className="login-form-area">
                <form
                  onSubmit={handleLogin}
                  className="auth-form-premium"
                  autoComplete="off"
                >
                  <div className="form-group">
                    <label>Work Email</label>
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
                    {loading ? <span className="loader-dots">Verifying...</span> : "Access Advisor Desk"}
                  </motion.button>
                </form>
              </div>

              <div className="switch-text-premium">
                Ready to join us? <Link to="/advisor/register">Register here</Link>
              </div>
            </motion.div>
          </AnimatePresence>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default LoginAdvisor;
