import React from "react";
import "./BatchCard.scss";
import { weekdays } from "../../data/Usabledata";
import { useSelector } from "react-redux";
import { sendDataToapi } from "../../utils/api";
import {
  capitalizeWords,
  formatDateToDDMMYYYY,
} from "../../utils/usableFunctions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const formatTime = (time) => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

const BatchCard = ({ batch }) => {
  const {
    _id,
    topic,
    description,
    meetlink,
    domain,
    advisorId,
    slotTime,
    weekDay,
    maxAttendee,
    startDate,
    learningMaterial,
    attendees = [],
  } = batch;

  const dayNames = weekdays;

  const navigate = useNavigate();

  const userId = useSelector((state) => state?.user?._id);

  const joinBatch = () => {
    const url = `/batch/join/${_id}`;
    const params = {
      userId,
      advisorId: advisorId?._id,
    };

    sendDataToapi(url, {}, "application/json", params)
      .then((res) => {
        console.log("Batch joined:", res.data);
        toast.success("Batch Joined SuccessFully!");
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error("Join Batch Failed!", err);
        console.error("Join batch failed:", err);
      });
  };

  return (
    <div className="batch-card">
      <div className="left">
        <img src={advisorId.profilepic} alt="" />
      </div>
      <div className="right">
        <div className="header">
          <h3>{`${advisorId.title} ${capitalizeWords(advisorId.fullname)}`}</h3>
          <p>{advisorId.email}</p>
        </div>
        <p>
          <strong>Starting From:</strong> {formatDateToDDMMYYYY(startDate)}
        </p>
        <p>
          <strong>Day:</strong> {weekDay}
        </p>
        <p>
          <strong>Slot Time:</strong> {`${slotTime.start}-${slotTime.end}`}
        </p>
        <p>
          <strong>Slot Available:</strong> {attendees.length}/{maxAttendee}
        </p>
        {description && (
          <p>
            <strong>Description:</strong> {description}
          </p>
        )}
        <div className="bottom">
          <a
            rel="noopener noreferrer"
            className="join-link"
            onClick={joinBatch}
          >
            Join Batch
          </a>
        </div>
      </div>
    </div>
  );
};

export default BatchCard;
