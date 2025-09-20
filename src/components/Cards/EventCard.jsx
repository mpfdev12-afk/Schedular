import React, { useEffect, useRef } from "react";
import "./EventCard.scss";

const EventCard = ({
  date,
  advisor,
  user,
  profilepic,
  topic,
  time,
  status,
  details,
  domain,
  meetlink,
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!domain || !cardRef.current) return;

    let color = "#ccc";
    if (domain === "mental") color = "#ADD8E6";
    else if (domain === "physical") color = "#F5A623";
    else if (domain === "financial") color = "#7ED321";

    cardRef.current.style.borderTop = `5px solid ${color}`;
  }, [domain]);

  const formatTime = (slotTime) => {
    if (!slotTime) return "";
    let hr = Math.floor(slotTime / 100);
    let min = slotTime % 100;
    const ampm = hr >= 12 ? "PM" : "AM";
    hr = hr % 12 || 12;
    return `${hr}:${min.toString().padStart(2, "0")} ${ampm}`;
  };

  const capitalizeFirst = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const capitalizeWords = (str) =>
    str
      ? str
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "";

  return (
    <div className="event-card" ref={cardRef}>
      <div className="left">
        <img src={profilepic} alt="Profile" />
      </div>

      <div className="right">
        <div className="header">
          <div className="head-left">
            <h3>{`Dr. ${capitalizeWords(advisor) || "Unknown"}`}</h3>
            <p>{`${capitalizeFirst(domain)} (${
              capitalizeFirst(topic) || "Session"
            })`}</p>
          </div>
          <div className={`status ${status}`}>{capitalizeFirst(status)}</div>
        </div>

        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Time:</strong>{" "}
          {`${formatTime(time)}-${formatTime(time + 100)}`}
        </p>

        <div className="bottom">
          <a
            href={meetlink}
            target="_blank"
            rel="noopener noreferrer"
            className="join-link"
          >
            Meet Link
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
