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

  // user slice starts as {} (empty object); treat absence of _id as "not yet loaded or not logged in"
  const isLoading = user === undefined;
  const isLoggedIn = user && user._id;

  useEffect(() => {
    if (isLoading) return;
    if (isLoggedIn) {
      if (role === "advisor") navigate("/dashboard");
      else navigate("/category");
    }
  }, [isLoading, isLoggedIn, role, navigate]);

  if (isLoading) return <Loader />;

  return isLoggedIn ? <Category /> : <LandingPage />;
};

export default Home;
