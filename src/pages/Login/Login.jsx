import React, { useState, useEffect } from "react";
import "./Login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/Firebase/Firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { sendDataToapi } from "../../utils/api";
import { useDispatch } from "react-redux";
import { Useraction } from "../../store/userSlice";
import { RoleAction } from "../../store/roleSlice";
import { motion, AnimatePresence } from "framer-motion";
import LiveLogo from "../../components/Navbar/LiveLogo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const navigate = useNavigate();
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
        toast.success("Login Sucessfully");
        navigate("/category");
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
                <LiveLogo size={64} />
                <h2>Welcome Back</h2>
                <p className="login-subtitle">Continue your wellness journey</p>
              </div>

              <div className="login-form-area">
                <form
                  onSubmit={handleLogin}
                  className="auth-form-premium"
                  autoComplete="off"
                >
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
              </div>

              <div className="switch-text-premium">
                Don't have an account? <Link to="/user/register">Create one</Link>
              </div>
            </motion.div>
          </AnimatePresence>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
