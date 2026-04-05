import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdvisorList from "../AdvisorList/AdvisorList";
import "./Batches.scss";
import BatchCard from "../../components/Cards/BatchCard";
import { weekdays } from "../../data/Usabledata";
import { fetchDataFromApi } from "../../utils/api";
import AdvisorSearch from "../../components/auto-complete-search/AdvisorSearch";
import { capitalizeWords } from "../../utils/usableFunctions";
import BackButton from "../../components/BackButton/BackButton";
import StepIndicator from "../../components/StepIndicator/StepIndicator";

const Batches = () => {
  const { isGroup, category, topic } = useParams();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    advisorId: "",
    weekDay: "",
    slotTime: "",
  });
  const [filterInputs, setFilterInputs] = useState({
    advisorId: "",
    weekDay: "",
    slotTime: "",
  });

  useEffect(() => {
    setLoading(true);
    try {
      fetchDataFromApi("/batch/filter", {
        domain: category,
        topic,
        ...filters,
      }).then((res) => {
        setBatches(res.data.batches || []);
        setLoading(false);
      });
    } catch (err) {
      console.error("Failed to fetch batches", err);
      setLoading(false);
    }
  }, [filters, category, topic]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (isGroup !== "group") {
    return <AdvisorList />;
  }

  return (
    <motion.div 
      className={`batches-page theme-${category?.toLowerCase()}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-glow" />
      <BackButton />

      <header className="batches-header">
        <StepIndicator currentStep={4} category={category} showConnect={true} />
        <motion.div className="header-content">
          <span className="batch-badge">Community Groups</span>
          <h1>Join a <span>{capitalizeWords(topic?.replace("-", " "))}</span> Batch</h1>
          <p>Learn and grow together with structured weekly sessions led by experts.</p>
        </motion.div>
      </header>

      <motion.div className="filters-section glass-card" variants={containerVariants}>
        <div className="filter-group">
          <label>Search Advisor</label>
          <AdvisorSearch setFilters={setFilterInputs} />
        </div>

        <div className="filter-group">
          <label>Preferred Day</label>
          <select
            className="glass-select"
            value={filterInputs.weekDay}
            onChange={(e) =>
              setFilterInputs({ ...filterInputs, weekDay: e.target.value })
            }
          >
            <option value="">All Days</option>
            {weekdays.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Slot Timing</label>
          <input
            type="number"
            className="glass-input"
            placeholder="e.g. 1100"
            value={filterInputs.slotTime}
            onChange={(e) =>
              setFilterInputs({ ...filterInputs, slotTime: e.target.value })
            }
          />
        </div>

        <button
          className="filter-btn"
          onClick={() => setFilters(filterInputs)}
        >
          Apply Filters
        </button>
      </motion.div>

      {loading ? (
        <div className="loading-state">
          <p>Finding available batches...</p>
        </div>
      ) : (
        <div className="batches-grid">
          <AnimatePresence mode="popLayout">
            {batches.length > 0 ? (
              batches.map((batch) => (
                <BatchCard key={batch._id} batch={batch} />
              ))
            ) : (
              <motion.div className="no-batches glass-card">
                <h3>No active batches found</h3>
                <p>Try adjusting your filters or check back later for new openings.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Batches;
