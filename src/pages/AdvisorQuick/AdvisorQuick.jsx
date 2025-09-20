import React, { useEffect, useState } from "react";
import { fetchDataFromApi, updateDatatoapi } from "../../utils/api";
import "./AvisorQuick.scss";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { capitalizeWords } from "../../utils/usableFunctions";
import Loader from "../../components/Loader/Loader";

const AdvisorQuick = () => {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortType, setSortType] = useState("desc");
  const { domain, advisorId } = useParams(); // from auth

  const getAppointments = async () => {
    try {
      const res = await fetchDataFromApi("/appointment/getQuickAppointments", {
        page,
        limit,
        sortBy,
        sortType,
        domain,
      });
      setAppointments(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch appointments");
    }
  };

  const handleJoin = async (id) => {
    try {
      await updateDatatoapi(
        `/appointment/joinQuickAppointment/${id}?advisorId=${advisorId}`,
        {},
        "application/json"
      ).then((res) => {
        console.log("Joined appointment:", res?.data?.data?.meetlink);
        window.open(res?.data?.data?.meetlink, "_blank");
        // reload to see updated list
      });
      toast.success("Joined appointment successfully!");
      getAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join appointment");
    }
  };

  // Fetch initially + every 5 seconds
  useEffect(() => {
    getAppointments(); // initial fetch
    const interval = setInterval(() => {
      getAppointments();
    }, 5000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [page, sortBy, sortType, domain]);

  return (
    <div className="quick-appointments">
      <h2>Quick Appointments</h2>
      {/* Filters */}
      <div className="filters">
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="createdAt">Created At</option>
          <option value="fullname">User Name</option>
        </select>
        <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Domain</th>
            <th>Topic</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt._id}>
              <td>{capitalizeWords(appt.userId?.fullname)}</td>
              <td>{capitalizeWords(appt.domain)}</td>
              <td>{capitalizeWords(appt.topic)}</td>
              <td>{new Date(appt.createdAt).toLocaleString()}</td>
              <td>
                {appt.status === "pending" ? (
                  <button
                    className="join-btn"
                    onClick={() => handleJoin(appt._id)}
                  >
                    Join
                  </button>
                ) : (
                  <span className={`status ${appt.status}`}>
                    {capitalizeWords(appt.status)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default AdvisorQuick;
