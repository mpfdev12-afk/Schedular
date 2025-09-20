import React, { useState, useEffect } from "react";
import EventCard from "../../components/Cards/EventCard";
import { useNavigate } from "react-router-dom";
import "./DashBoard.scss";
import { fetchDataFromApi } from "../../utils/api";
import Loader from "../../components/Loader/Loader";
import { learningMaterials } from "../../data/LearningMaterial";
import LearningCard from "../../components/Cards/LearningCard";
import PastCard from "../../components/Cards/PastCard";
import AdvisorDashboard from "../AdvisorDashboard/AdvisorDashboard";
import { useSelector } from "react-redux";
import UserDashboard from "../UserDashboard/UserDashboard";

export default function DashBoard() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [domain, setdomain] = useState("");

  const role = useSelector((state) => state.role);

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi("/users/getloggedinUserAdvisor")
      .then((res) => {
        setUser(res?.data?.user);
        console.log(res);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const goToCategory = () => {
    navigate("/Category");
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  const toggleProfileFalse = () => {
    setShowProfile(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchDataFromApi("/appointment/filter", { userId: user?._id, domain })
      .then((res) => {
        const list = res?.data?.appointments || [];
        setAppointments(list);
        console.log(list);
        console.warn(user);
      })
      .catch((err) => console.error("Failed to fetch appointments:", err))
      .finally(() => setLoading(false));
  }, [user, domain]);

  function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function capitalizeWords(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const renderAppointmentsSection = (title, dataList = []) => (
    <div className="event-section">
      {loading && <Loader />}
      <h2>{title}</h2>
      <hr className="divider" />
      <div className="event-card-list">
        {loading ? (
          <p>Loading...</p>
        ) : dataList.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          dataList.map((item, index) => {
            const card = (
              <EventCard
                key={item._id}
                date={item.date}
                advisor={item.advisorId?.fullname}
                user={item.userId?.fullname}
                topic={item.topic}
                time={item.slotTime}
                status={item.status}
                details={item.details}
                domain={item.domain}
                meetlink={item.meetlink}
                profilepic={
                  item.advisorId?.profilepic ||
                  "https://upload.wikimedia.org/wikipedia/commons/9/9d/Unknown_Member.jpg"
                }
              />
            );

            if (!isMobile) return card;

            return (
              <div className="event-list-item" key={item._id}>
                <div
                  className="list-title"
                  onClick={(e) => e.currentTarget.classList.toggle("expanded")}
                >
                  {item.topic || `${title} ${index + 1}`}
                  <span className="arrow">▼</span>
                </div>
                <div className="list-body">{card}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
  const renderLearningSection = (title, materials = []) => (
    <div className="event-section">
      <h2>{title}</h2>
      <hr className="divider" />
      <div className="event-card-list">
        {materials.length === 0 ? (
          <p>No learning materials available.</p>
        ) : (
          materials.map((item, index) => {
            const card = (
              <LearningCard
                key={item.id}
                title={item.title}
                duration={item.duration || "Self-paced"}
                image={item.image}
                link={item.link}
              />
            );

            if (!isMobile) return card;

            return (
              <div className="event-list-item" key={item.id}>
                <div
                  className="list-title"
                  onClick={(e) => e.currentTarget.classList.toggle("expanded")}
                >
                  {item.title}
                  <span className="arrow">▼</span>
                </div>
                <div className="list-body">{card}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderStaticSection = (title, count) => (
    <div className="event-section">
      <h2>{title}</h2>
      <hr className="divider" />
      <div className="event-card-list">
        {[...Array(count)].map((_, i) => {
          const card = <PastCard key={i} />;
          if (!isMobile) return card;

          return (
            <div className="event-list-item" key={i}>
              <div
                className="list-title"
                onClick={(e) => e.currentTarget.classList.toggle("expanded")}
              >
                {card.props.title || `${title} ${i + 1}`}
                <span className="arrow">▼</span>
              </div>
              <div className="list-body">{card}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return role === "advisor" ? (
    <AdvisorDashboard />
  ) : (
    <UserDashboard />
    // <div className="dashboard-wrapper">
    //   <div className="dashboard-container">
    //     <div className="top-bar">
    //       <select
    //         className="new-meeting domain"
    //         value={domain}
    //         onChange={(e) => {
    //           setdomain(e?.target?.value);
    //         }}
    //       >
    //         <option value={""}>All</option>
    //         <option value={"mental"}>Mental</option>
    //         <option value={"physical"}>Physical</option>
    //         <option value={"financial"}>Financial</option>
    //       </select>
    //       <a className="new-meeting" onClick={goToCategory}>
    //         + New Meeting
    //       </a>
    //       <div className="profile-toggle" onClick={toggleProfile}>
    //         👤
    //       </div>
    //     </div>

    //     {renderAppointmentsSection("Upcoming Events", appointments)}
    //     {renderLearningSection("Learning Materials", learningMaterials)}
    //     {renderStaticSection("Past Events", 1)}
    //   </div>

    //   <div className={`profile-panel ${showProfile ? "show-on-mobile" : ""}`}>
    //     <div className="top-profile-bar" onClick={toggleProfileFalse}>
    //       <a>x</a>
    //     </div>
    //     <div className="profile-photo">
    //       <div className="avatar-ring-wrapper">
    //         <svg className="avatar-ring">
    //           <circle className="bg" cx="95" cy="95" r="90" />
    //           <circle className="fg" cx="95" cy="95" r="90" />
    //         </svg>
    //         <div className="avatar">
    //           <img
    //             src={
    //               user?.profilepic ||
    //               "https://upload.wikimedia.org/wikipedia/commons/9/9d/Unknown_Member.jpg"
    //             }
    //             alt="Profile"
    //           />
    //         </div>
    //       </div>
    //       <div className="name">
    //         {capitalizeWords(user?.fullname) || "User"}
    //       </div>
    //       <div className="role">
    //         {user?.dob
    //           ? `${Math.floor(
    //               (new Date() - new Date(user.dob)) /
    //                 (1000 * 60 * 60 * 24 * 365)
    //             )} Years`
    //           : ""}
    //       </div>
    //     </div>
    //     <hr className="divider" />
    //     <div className="profile-details">
    //       <div>
    //         <strong>Email:</strong> {user?.email}
    //       </div>
    //       <div>
    //         <strong>Alt Email:</strong> {user?.contact?.email || "N/A"}
    //       </div>
    //       <div>
    //         <strong>Phone:</strong> {user?.contact?.phone || "N/A"}
    //       </div>
    //       <div>
    //         <strong>Gender:</strong> {capitalizeFirst(user?.gender)}
    //       </div>
    //       <div>
    //         <strong>Blood Group:</strong> {user?.bloodGroup || "N/A"}
    //       </div>
    //       <div>
    //         <strong>Languages:</strong> {user?.languagesSpoken?.join(", ")}
    //       </div>
    //       <div>
    //         <strong>Address:</strong>{" "}
    //         {user?.address
    //           ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.zipCode}, ${user.address.country}`
    //           : "N/A"}
    //       </div>
    //       <div>
    //         <strong>Emergency Contact:</strong>{" "}
    //         {user?.emergencyContact
    //           ? `${user.emergencyContact.name} (${user.emergencyContact.relation}) - ${user.emergencyContact.phone}`
    //           : "N/A"}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
