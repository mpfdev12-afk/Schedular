import LandingPage from "../LandingPage/LandingPage";
import Loader from "../../components/Loader/Loader";
import Category from "../Category/Category";
import OrgPortal from "../OrgPortal/OrgPortal";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useOrgBranding } from "../../context/OrgBrandingContext";

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.role);
  const { isWhiteLabel, loading: brandingLoading } = useOrgBranding();

  const isLoggedIn = user && user._id;

  // Redirect logged-in users to their correct destination
  useEffect(() => {
    if (!isLoggedIn) return;
    if (role === "advisor") navigate("/dashboard");
    else navigate("/category");
  }, [isLoggedIn, role, navigate]);

  // Show loader while branding is being fetched (subdomain detection in flight)
  if (brandingLoading) return <Loader />;

  // Logged-in: redirect is already in flight, show loader to avoid flash
  if (isLoggedIn) return <Loader />;

  // Corporate subdomain — show branded portal instead of generic landing
  if (isWhiteLabel) return <OrgPortal />;

  return <LandingPage />;
};

export default Home;
