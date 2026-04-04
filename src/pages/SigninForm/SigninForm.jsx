import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { sendDataToapi } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import LiveLogo from "../../components/Navbar/LiveLogo";
import "../Login/Login.scss"; // Reuse unified premium styles

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    
    // We send a FormData object as the backend uses multer/parseNestedFormData
    const data = new FormData();
    data.append("fullname", formData.fullname);
    data.append("email", formData.email);
    data.append("password", formData.password);

    sendDataToapi("/users/register", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log("Registration Success:", res);
        navigate("/category");
      })
      .catch((err) => {
        console.error("Registration Error:", err);
        setMsg(err?.response?.data?.message || "Registration failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
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
              {/* Branding */}
              <div className="login-branding">
                <div className="logo-glow-ring"></div>
                <LiveLogo size={64} />
                <h2>Create Account</h2>
                <p className="login-subtitle">Start your wellness journey today</p>
              </div>

              <div className="login-form-area">
                <form
                  onSubmit={handleSubmit}
                  className="auth-form-premium"
                  autoComplete="off"
                >
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="fullname"
                        placeholder="John Doe"
                        value={formData.fullname}
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Create Password</label>
                    <div className="input-wrapper">
                      <input
                        type="password"
                        name="password"
                        placeholder="Min. 8 characters"
                        value={formData.password}
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {msg && <p className="premium-error-msg">{msg}</p>}

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="login-submit-btn"
                  >
                    {loading ? <span className="loader-dots">Joining...</span> : "Create Profile"}
                  </motion.button>
                </form>
              </div>

              <div className="switch-text-premium">
                Already have an account? <Link to="/user/login">Log in here</Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
