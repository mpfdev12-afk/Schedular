import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { fetchDataFromApi } from "./utils/api";
import { Useraction } from "./store/userSlice";
import { RoleAction } from "./store/roleSlice";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import Loader from "./components/Loader/Loader";
import { FEATURES } from "./config/featureFlags";
import DetoxFAB from "./components/DetoxMode/DetoxFAB";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi("/users/getloggedinUserAdvisor")
      .then((res) => {
        // Handle both standard ApiResponse format and mock responses
        const userData = res?.data?.user || res?.user || {};
        const roleData = res?.data?.role || res?.role || "";

        dispatch(Useraction.loginUser(userData));
        dispatch(RoleAction.loginRole(roleData));
        console.log("Logged in user:", userData);
      })
      .catch((err) => console.log("Login fetch error:", err))
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  // update currentUrl when location changes
  const currentUrl = location.pathname;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {currentUrl !== "/dashboard" && <Navbar />}
          <Outlet />
          <ToastContainer />
          {FEATURES.DETOX_MODE && <DetoxFAB />}
        </div>
      )}
    </>
  );
}

export default App;
