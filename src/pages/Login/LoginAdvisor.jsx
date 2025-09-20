import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import { sendDataToapi } from "../../utils/api";

const LoginAdvisor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      toast.success("Login Successful");
      //navigate("/");
      window.location.href = "/dashboard";
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
      <div className="home-scroll-container">
        <div className="left">
          <div className="auth-container">
            <h2>Login (Advisor)</h2>
            <form
              onSubmit={handleLogin}
              className="auth-form"
              autoComplete="off"
            >
              <div>
                <label className="mail">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="pass">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit">Login</button>
            </form>
            <div className="switch-text">
              Don't have an account? <Link to="/advisor/Signin">Register</Link>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginAdvisor;
