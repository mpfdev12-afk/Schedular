// components/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "../Firebase/Firebase";

export default function PrivateRoute() {
  const user = auth.currentUser;
  const location = useLocation();

  if (location.pathname === "/") {
    return user ? <Navigate to="/category" replace /> : <Navigate to="/Landing" replace />;
  }

  return user ? <Outlet /> : <Navigate to="/Landing" replace />;
}
