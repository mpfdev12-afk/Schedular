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
    console.log("BOOT: Starting authentication check...");
    setLoading(true);

    // Safety timeout: Ensure the loader disappears even if the API hangs
    const safetyTimer = setTimeout(() => {
      console.warn("BOOT: Auth check taking too long, forcing loader hide.");
      setLoading(false);
    }, 3000);

    fetchDataFromApi("/users/getloggedinUserAdvisor")
      .then((res) => {
        console.log("BOOT: Auth check success.", res);
        const userData = res?.data?.user || res?.user || {};
        const roleData = res?.data?.role || res?.role || "";

        dispatch(Useraction.loginUser(userData));
        dispatch(RoleAction.loginRole(roleData));
      })
      .catch((err) => {
        console.error("BOOT: Auth check failed:", err);
      })
      .finally(() => {
        clearTimeout(safetyTimer);
        setLoading(false);
        console.log("BOOT: Sequence complete.");
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
