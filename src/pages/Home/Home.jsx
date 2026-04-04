import { useEffect } from "react";
import LandingPage from "../LandingPage/LandingPage";
import Loader from "../../components/Loader/Loader";
import Category from "../Category/Category";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.role);

  // If the boot sequence in App.jsx hasn't finish, we might still be in a loading state.
  // However, App.jsx handles the primary full-page loader now.
  const isLoggedIn = user && user._id;

  useEffect(() => {
    if (isLoggedIn) {
      console.log("HOME: Logged in, redirecting...");
      if (role === "advisor") navigate("/dashboard");
      else navigate("/category");
    }
  }, [isLoggedIn, role, navigate]);

  if (isLoggedIn) {
    // Prevent advisor from seeing the user-centric Category page
    if (role === "advisor") return <Loader />;
    return <Category />;
  }

  return <LandingPage />;
};

export default Home;
