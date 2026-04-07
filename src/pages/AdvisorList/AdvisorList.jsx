import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cards from "../../components/Cards/Cards";
import { fetchDataFromApi } from "../../utils/api";
import "./AdvisorList.scss";
import BackButton from "../../components/BackButton/BackButton";
import StepIndicator from "../../components/StepIndicator/StepIndicator";
import { capitalizeWords } from "../../utils/usableFunctions";

const EXP_OPTIONS = [
  { label: "Any Experience", value: "" },
  { label: "1+ Years", value: "1" },
  { label: "3+ Years", value: "3" },
  { label: "5+ Years", value: "5" },
  { label: "10+ Years", value: "10" },
];

const AdvisorList = () => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category, topic } = useParams();

  const [specialization, setSpecialization] = useState("");
  const [minExperience, setMinExperience] = useState("");

  const fetchAdvisors = useCallback(() => {
    setLoading(true);
    const params = { domain: category };
    if (specialization.trim()) params.specialization = specialization.trim();
    if (minExperience) params.minExperience = minExperience;

    fetchDataFromApi("/advisors/getallAdvisors", params)
      .then((res) => {
        setAdvisors(res?.data?.advisor || []);
      })
      .catch((err) => console.error("Failed to fetch advisors:", err))
      .finally(() => setLoading(false));
  }, [category, specialization, minExperience]);

  useEffect(() => {
    fetchAdvisors();
  }, [fetchAdvisors]);

  const handleReset = () => {
    setSpecialization("");
    setMinExperience("");
  };

  const hasActiveFilters = specialization || minExperience;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div
      className={`advisor-list-page theme-${category?.toLowerCase()}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-glow" />
      <BackButton />

      <header className="advisor-header">
        <StepIndicator currentStep={4} category={category} showConnect={true} />
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="domain-pill">{capitalizeWords(category)} Expert Discovery</span>
          <h1>Connect with <span>{capitalizeWords(topic?.replace("-", " "))}</span> Specialists</h1>
          <p>We've curated a selection of top-tier professionals to guide your journey.</p>
        </motion.div>
      </header>

      <div className="filter-bar glass-card">
        <input
          className="filter-input"
          type="text"
          placeholder="Search by specialization..."
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
        <select
          className="filter-select"
          value={minExperience}
          onChange={(e) => setMinExperience(e.target.value)}
        >
          {EXP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {hasActiveFilters && (
          <button className="filter-reset" onClick={handleReset}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="shimmer-grid">
            {[1, 2, 3].map(i => <div key={i} className="shimmer-card glass-card" />)}
          </div>
          <p>Matching experts to your path...</p>
        </div>
      ) : (
        <div className="advisors-grid">
          <AnimatePresence mode="popLayout">
            {advisors.length > 0 ? (
              advisors.map((adv) => (
                <Cards key={adv._id} advisor={adv} />
              ))
            ) : (
              <motion.div
                className="empty-state glass-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3>No experts found</h3>
                <p>{hasActiveFilters ? "Try adjusting your filters." : "We're currently expanding our network for this specific topic."}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default AdvisorList;
