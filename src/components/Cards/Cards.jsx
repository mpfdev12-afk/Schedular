import React from "react";
import "./Cards.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Cards = ({ advisor }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const goToCalender = () => {
    navigate(`${advisor._id}/${user?._id}`, { state: { advisor } });
  };
  function capitalizeWords(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const fullName = `${advisor.title || ""} ${advisor.fullname}`;
  const specialization = advisor.specialization || "";
  const experience = advisor.experienceYears || "N/A";
  const qualification = advisor.qualification || "";
  const languages = Array.isArray(advisor.languagesSpoken)
    ? advisor.languagesSpoken.join(", ")
    : advisor.languagesSpoken;

  const workingDays =
    advisor.availability?.workingDays?.startDay !== undefined &&
    advisor.availability?.workingDays?.endDay !== undefined
      ? `Day ${advisor.availability.workingDays.startDay} - Day ${advisor.availability.workingDays.endDay}`
      : "Not Available";

  const formatTime = (time) => {
    if (!time) return "";
    const h = Math.floor(time / 100);
    const m = time % 100;
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  const slotStart = formatTime(advisor.availability?.slotStartTime);
  const slotEnd = formatTime(advisor.availability?.slotEndTime);
  const timeRange =
    slotStart && slotEnd ? `${slotStart} - ${slotEnd}` : "Not Available";

  return (
    <div className="cards">
      <div className="card-container">
        <div className="left-section">
          <div className="avatar">
            <img
              src={advisor.profilepic || "/no-profile.jpg"}
              alt={advisor.fullname}
            />
          </div>
        </div>
        <div className="right-section">
          <h2>{capitalizeWords(fullName)}</h2>
          <p className="speciality">
            {specialization} | <span>{experience} years</span>
          </p>
          <hr className="divider" />
          <div className="details">
            <p className="qualification">{qualification}</p>
            <p>{languages}</p>
            {/* <p>{advisor.description}</p> */}
          </div>
          <div className="timing">
            <span className="days">{capitalizeWords(advisor.domain)}</span>
          </div>
          <button className="book-btn" onClick={goToCalender}>
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
