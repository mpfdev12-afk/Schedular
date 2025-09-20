import React, { useState, useEffect } from "react";
import "./Login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/Firebase/Firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { sendDataToapi } from "../../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = { email, password };
    const formDataToSend = JSON.stringify(formData);
    sendDataToapi("/users/login", formDataToSend, "application/json")
      .then((res) => {
        setLoading(false);
        window.location.href = "/category";
        console.log("Logged in user:", res);
        toast.success("Login Sucessfully");
      })
      .catch((err) => {
        setLoading(false);
        console.log(error.message);
        toast.error(error.message, {
          position: "bottom-center",
        });
      });
  };
  return (
    <>
      {loading && <Loader />}
      <div className="home-scroll-container">
        <div className="left">
          <div className="auth-container">
            <h2>Login</h2>
            <div className="login-form">
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
                    autoComplete="off"
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
                    autoComplete="new-password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit">Login</button>
              </form>
            </div>
            <div className="switch-text">
              <>
                Don't have an account? <Link to="/user/Signin">Register</Link>
              </>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </>
  );
}
