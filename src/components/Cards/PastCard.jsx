import React, { useEffect, useRef } from "react";
import "./PastCard.scss";

const PastCard = ({
  date,
  advisor,
  user,
  topic,
  time,
  status,
  details,
  domain,
}) => {
  //   const cardRef = useRef(null);

  //   useEffect(() => {
  //     if (!domain || !cardRef.current) return;

  //     let color = "#ccc";
  //     if (domain === "mental") color = "#ADD8E6";
  //     else if (domain === "physical") color = "#F5A623";
  //     else if (domain === "financial") color = "#7ED321";

  //     cardRef.current.style.borderTop = `5px solid ${color}`;
  //   }, [domain]);

  const formatTime = (slotTime) => {
    if (!slotTime) return "";
    let hr = Math.floor(slotTime / 100);
    let min = slotTime % 100;
    const ampm = hr >= 12 ? "PM" : "AM";
    hr = hr % 12 || 12;
    return `${hr}:${min.toString().padStart(2, "0")} ${ampm}`;
  };

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

  return (
    <div className="event-past-card">
      <div className="card-content">
        <div className="card-heading">
          <h1 className="title">
            {`${capitalizeFirst(domain)} (${
              capitalizeFirst(topic) || "Financial"
            })`}
          </h1>
          <p className="subtitle">{details || "Consultation"}</p>
          <hr className="divider" />
        </div>

        <div className="card-body">
          <h2 className="doctor-name">
            Dr. {capitalizeWords(advisor) || "Rambir Singh"}
          </h2>
          <p className="time-label">
            {`${formatTime(time)}-${formatTime(time + 100)}`}
          </p>
          <p className="date">Date: {date || "2025-07-10"}</p>
          <p className={`status ${status}`}>
            Status: {capitalizeFirst(status) || "Completed"}
          </p>
        </div>
        {/* 
        <div className="card-footer">
          <button className="card-button">Meet Link</button>

        </div> */}
      </div>
    </div>
  );
};

export default PastCard;
