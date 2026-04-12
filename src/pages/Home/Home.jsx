import { useEffect } from "react";
import LandingPage from "../LandingPage/LandingPage";
import Loader from "../../components/Loader/Loader";
import Category from "../Category/Category";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useOrgBranding } from "../../context/OrgBrandingContext";

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.role);
  const { isWhiteLabel, loading: brandingLoading } = useOrgBranding();

  const isLoggedIn = user && user._id;

  useEffect(() => {
    if (isLoggedIn) {
      if (role === "advisor") navigate("/dashboard");
      else navigate("/category");
    } else if (isWhiteLabel) {
      // If we are on a corporate subdomain but not logged in, 
      // direct them straight to the branded login experience.
      navigate("/Signin");
    }
  }, [isLoggedIn, role, navigate, isWhiteLabel]);

  if (brandingLoading) return <Loader />;

  if (isLoggedIn) {
    if (role === "advisor") return <Loader />;
    return <Category />;
  }

  // Only show generic landing page if NOT on an organization subdomain
  if (isWhiteLabel) return <Loader />; 
  
  return <LandingPage />;
};

export default Home;
