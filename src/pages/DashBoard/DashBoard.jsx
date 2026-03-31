import AdvisorDashboard from "../AdvisorDashboard/AdvisorDashboard";
import { useSelector } from "react-redux";
import UserDashboard from "../UserDashboard/UserDashboard";

export default function DashBoard() {
  const role = useSelector((state) => state.role);

  return role === "advisor" ? <AdvisorDashboard /> : <UserDashboard />;
}
