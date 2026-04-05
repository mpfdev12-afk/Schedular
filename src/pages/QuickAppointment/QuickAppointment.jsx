import React, { useEffect, useState, useMemo } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { 
  MentalIcon, 
  PhysicalIcon, 
  FinancialIcon,
  DetoxIcon
} from "../../components/DomainIcons/DomainIcons";

const ICONS = {
  mental: <MentalIcon />,
  physical: <PhysicalIcon />,
  financial: <FinancialIcon />,
  detox: <DetoxIcon />
};

const QuickAppointment = () => {
  const { category, topic } = useParams();
  const [quickAppointment, setQuick] = useState(null);
  const [status, setStatus] = useState("idle"); // idle → pending → confirmed
  const [linkOpened, setLinkOpened] = useState(false);
  const [meetLink, setMeetLink] = useState("#");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const domainIcon = useMemo(() => {
    return ICONS[category?.toLowerCase()] || <MentalIcon />;
  }, [category]);

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div 
      className={`quick-appointment theme-${category?.toLowerCase()}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-glow" />
      <BackButton />

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div 
            key="idle"
            className="view-container initial-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="icon-main">{domainIcon}</div>
            <h2>Immediate Rapid Guidance</h2>
            <p>Need urgent clarity? Generate a request for an instant 15-minute 1-on-1 session with an available expert.</p>
            <button className="btn-generate glass-card" onClick={handleQuick}>
              Find an Expert Now
            </button>
          </motion.div>
        )}

        {status === "pending" && (
          <motion.div 
            key="pending"
            className="view-container loading-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pulse-container">
              <motion.div 
                className="pulse-ring" 
                animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="icon-center">{domainIcon}</div>
            </div>
            <h2>Searching for your Expert...</h2>
            <p>Matching you with an available {category} specialized professional for your topic.</p>

            <div className="status-badge glass-card">
              <span className="dot animate-pulse" /> Connecting to network...
            </div>

            <button className="btn-cancel" onClick={handleCancel}>
              Cancel Request
            </button>
          </motion.div>
        )}

        {status === "confirmed" && (
          <motion.div 
            key="confirmed"
            className="view-container confirmed-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="success-icon">🎉</div>
            <h2>Match Found!</h2>
            <div className="confirmed-card glass-card">
              <p>Your session for <span>{topic?.replace("-", " ")}</span> is ready.</p>
              <div className="info-row">
                <span>Duration:</span> <strong>15 Minutes</strong>
              </div>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-join glass-card"
              >
                Join Meeting Now
              </a>
            </div>
            <p className="notice">The link has been opened in a new tab.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuickAppointment;
