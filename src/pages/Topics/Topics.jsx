import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Topics.scss";
import { topicsData } from "../../data/topicsList";
import BackButton from "../../components/BackButton/BackButton";
import StepIndicator from "../../components/StepIndicator/StepIndicator";

const TopicsList = () => {
  const { category, session } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const topics = useMemo(() => {
    return topicsData[category?.toLowerCase()] || [];
  }, [category]);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) =>
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [topics, searchQuery]);

  const formatTopicForUrl = (topic) => {
    return topic.toLowerCase().replace(/\s+/g, "-");
  };

  const handleClick = (topic) => {
    navigate(`${formatTopicForUrl(topic)}`);
  };

  const handleOther = (e) => {
    const inputValue = e.target.value.trim();
    if (inputValue) {
      navigate(`${formatTopicForUrl(inputValue)}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`topics-page theme-${category?.toLowerCase()}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="bg-glow" />
      <BackButton />

      <div className="topics-header">
        <StepIndicator currentStep={3} category={category} />
        <motion.h1 variants={itemVariants}>
          Select a <span>{category}</span> Topic
        </motion.h1>
        <motion.p className="subtitle" variants={itemVariants}>
          Choose the area you'd like to focus on for your {session?.replace("-", " ")}.
        </motion.p>
      </div>

      <div className="search-container">
        <motion.div 
          className="search-wrapper glass-card"
          variants={itemVariants}
        >
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
      </div>

      {filteredTopics.length > 0 ? (
        <motion.div className="topics-grid" variants={containerVariants}>
          <AnimatePresence mode="popLayout">
            {filteredTopics.map((topic, idx) => (
              <motion.div
                key={topic}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                className="topic-card glass-card"
                onClick={() => handleClick(topic)}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="topic-dot" />
                <span className="topic-name">{topic}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <motion.div 
            variants={itemVariants}
            className="topic-card glass-card other-input-card"
          >
            <span className="topic-dot plus">+</span>
            <input
              type="text"
              placeholder="Other topic..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  handleOther(e);
                }
              }}
            />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div className="no-results" variants={itemVariants}>
          <p>No topics found matching "{searchQuery}"</p>
          <button onClick={() => setSearchQuery("")} className="clear-btn">
            Clear search
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TopicsList;
