import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { sendDataToapi } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import LiveLogo from "../../components/Navbar/LiveLogo";
import "../Login/Login.scss"; // Reuse unified premium styles

const RegisterAdvisor = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    specialization: "",
    title: "Therapist", // Default title
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const data = new FormData();
    data.append("fullname", formData.fullname);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("specialization", formData.specialization);
    data.append("title", formData.title);

    try {
      await sendDataToapi("/advisors/register", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/category");
    } catch (err) {
      console.error("Advisor Registration Error:", err);
      setMsg(err?.response?.data?.message || "Registration failed. Please check your details.");
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
              {/* Branding */}
              <div className="login-branding">
                <div className="logo-glow-ring"></div>
                <LiveLogo size={64} />
                <h2>Advisor Portal</h2>
                <p className="login-subtitle">Join our network of wellness experts</p>
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
                        placeholder="Dr. Jane Smith"
                        value={formData.fullname}
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Professional Email</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        name="email"
                        placeholder="jane.smith@wellness.com"
                        value={formData.email}
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Specialization</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="specialization"
                        placeholder="e.g. Mental Health, Nutrition"
                        value={formData.specialization}
                        required
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
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
                    {loading ? <span className="loader-dots">Verifying...</span> : "Apply as Advisor"}
                  </motion.button>
                </form>
              </div>

              <div className="switch-text-premium">
                Already registered? <Link to="/advisor/login">Log in here</Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default RegisterAdvisor;
