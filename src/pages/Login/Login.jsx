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
