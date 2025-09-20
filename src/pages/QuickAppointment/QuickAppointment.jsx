import React, { useEffect, useState } from "react";
import "./QuickAppointment.scss";
import {
  deleteDataFromApi,
  fetchDataFromApi,
  sendDataToapi,
} from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BackButton from "../../components/BackButton/BackButton";

const QuickAppointment = () => {
  const { category, topic } = useParams();
  const [quickAppointment, setQuick] = useState(null);
  const [status, setStatus] = useState("idle"); // idle → pending → confirmed
  const [linkOpened, setLinkOpened] = useState(false);
  const [meetLink, setMeetLink] = useState("#");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleQuick = () => {
    setStatus("pending");
    sendDataToapi(
      `/appointment/createQuickAppointment`,
      JSON.stringify({ userId: user?._id, domain: category, topic }),
      "application/json"
    )
      .then((res) => {
        setQuick(res?.data?.data);
      })
      .catch(() => {
        toast.error("Error creating appointment");
        setStatus("idle");
      });
  };

  const handleCancel = () => {
    if (!quickAppointment?._id) return;
    deleteDataFromApi(
      `/appointment/cancelQuickAppointment/${quickAppointment._id}`
    )
      .then(() => {
        toast.success("Your Quick Appointment is Cancelled");
        navigate(`/category/${category}`);
      })
      .catch(() => toast.error("Error Occured in Canceling"));
  };

  const getStatus = () => {
    if (!quickAppointment?._id) return;
    fetchDataFromApi(`/appointment/getappointmentbyid/${quickAppointment._id}`)
      .then((res) => {
        if (res.data.status === "confirmed") {
          setStatus("confirmed");
          setMeetLink(res.data.meetlink);
          if (!linkOpened) {
            window.open(res.data.meetlink, "_blank", "noopener,noreferrer");
            setLinkOpened(true);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (status !== "pending" || !quickAppointment?._id) return;
    const interval = setInterval(() => {
      getStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, [status, quickAppointment]);

  return (
    <div className="quick-appointment-container">
      <BackButton />
      {status === "idle" && (
        <div className="initial-view">
          <h2>Quick Appointment</h2>
          <p>Click below to find an advisor instantly.</p>
          <button className="btn-generate" onClick={handleQuick}>
            Generate Quick Session Request
          </button>
        </div>
      )}

      {status === "pending" && (
        <div className="loading-view">
          <h2>Finding the Right Advisor for You...</h2>
          <p>Please wait while we search for a match based on your needs.</p>

          <div className="loading-animation">
            <div className="dot dot1" />
            <div className="dot dot2" />
            <div className="dot dot3" />
          </div>

          <p className="tip">
            💡 Tip: Ensure your profile is complete for faster matches!
          </p>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel Quick Appointment
          </button>
        </div>
      )}

      {status === "confirmed" && (
        <div className="confirmed-view">
          <h2>🎉 Appointment Confirmed!</h2>
          <p>Your meeting link is ready:</p>
          <a
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="meet-link"
          >
            Join Meeting
          </a>
        </div>
      )}
    </div>
  );
};

export default QuickAppointment;
