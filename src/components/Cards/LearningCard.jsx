import React from "react";
import "./LearningCard.scss";

export default function LearningCard({ title, duration, image, link }) {
  return (
    <div className="learning-card">
      <div className="card-image">
        <img src={image || "https://via.placeholder.com/360x300"} alt={title} />
      </div>
      <div className="card-info">
        <h2 className="course-title">{title}</h2>
        <p className="course-duration">Duration: {duration}</p>
      </div>
      <div className="enroll">
        <a
          className="enroll-btn"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Continue
        </a>
      </div>
    </div>
  );
}
