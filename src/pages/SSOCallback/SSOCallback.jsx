import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Useraction } from "../../store/userSlice";
import { RoleAction } from "../../store/roleSlice";
import { fetchDataFromApi } from "../../utils/api";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";

/**
 * SSO Callback Handler
 * Receives JWT tokens from the backend after SAML/IdP handshake
 */
const SSOCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = searchParams.get("access");
    const refreshToken = searchParams.get("refresh");

    if (accessToken && refreshToken) {
      // 1. Store tokens (simulating cookie storage or local storage if needed)
      // The backend actually set cookies, but we might pass them in URL for easier cross-domain handling
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 2. Fetch user profile to verify and populate Redux
      fetchDataFromApi("/users/getloggedinUserAdvisor")
        .then((res) => {
          const userData = res?.data?.user || res?.user || {};
          const roleData = res?.data?.role || res?.role || "";

          dispatch(Useraction.loginUser(userData));
          dispatch(RoleAction.loginRole(roleData));

          toast.success("Enterprise SSO Login Successful!");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("SSO Profile Fetch Error:", err);
          toast.error("Failed to establish session after SSO callback.");
          navigate("/user/login");
        });
    } else {
      const error = searchParams.get("error");
      if (error === "seat_limit_reached") {
        toast.error("Organization seat limit reached. Please contact your HR.");
      } else {
        toast.error("SSO Authentication failed.");
      }
      navigate("/user/login");
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader />
      <p style={{ marginTop: "20px", color: "white" }}>Establishing secure session...</p>
    </div>
  );
};

export default SSOCallback;
