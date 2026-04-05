import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cards from "../../components/Cards/Cards";
import { fetchDataFromApi } from "../../utils/api";
import "./AdvisorList.scss";
import BackButton from "../../components/BackButton/BackButton";
import StepIndicator from "../../components/StepIndicator/StepIndicator";
import { capitalizeWords } from "../../utils/usableFunctions";

const AdvisorList = () => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category, topic } = useParams();

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi("/advisors/getallAdvisors", {
      domain: `${category}`,
    })
      .then((res) => {
        setAdvisors(res?.data?.advisor || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to fetch advisors:", err);
      });
  }, [category]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
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
                <h3>No experts found yet</h3>
                <p>We're currently expanding our network for this specific topic.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default AdvisorList;
