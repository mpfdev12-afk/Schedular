import React, { useState, useEffect } from "react";
import "./Signin.scss";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../components/Firebase/Firebase";
import { setDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  useEffect(() => {
    // Clear email and password when component loads
    setEmail("");
    setPassword("");
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Registering with", { email, password });

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          FirstName: fname,
          LastName: lname,
        });
      }

      toast.success("User Registration Successful!", {
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };
  return (
    <div className="home-scroll-container">
      <div className="left">
        <div className="auth-container">
          <h2>Register</h2>
          <div className="register-form">
            <form
              onSubmit={handleRegister}
              className="auth-form"
              autoComplete="off"
            >
              <div>
                <label className="mail">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  value={fname}
                  autoComplete="off"
                  required
                  onChange={(e) => setFname(e.target.value)}
                />
              </div>
              <div>
                <label className="mail">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  value={lname}
                  autoComplete="off"
                  required
                  onChange={(e) => setLname(e.target.value)}
                />
              </div>
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
              <button type="submit">Register</button>
            </form>
          </div>
          <div className="switch-text">
            <>
              Don't have an account? <Link to="/user/login">Login</Link>
            </>
          </div>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
}
