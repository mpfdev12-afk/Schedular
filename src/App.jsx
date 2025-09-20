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

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi("/users/getloggedinUserAdvisor")
      .then((res) => {
        dispatch(Useraction.loginUser(res?.data?.user));
        dispatch(RoleAction.loginRole(res?.data?.role));
        console.log(res);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  // update currentUrl when location changes
  const currentUrl = location.pathname;

  return (
    <>
      {loading && <Loader />}
      <div>
        {currentUrl !== "/dashboard" && <Navbar />}
        <Outlet />
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
