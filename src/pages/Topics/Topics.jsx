import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Topics.scss";
import { topicsData } from "../../data/topicsList";
import BackButton from "../../components/BackButton/BackButton";

const TopicsList = () => {
  const { category } = useParams();
  const topics = topicsData[category?.toLowerCase()] || [];

  const navigate = useNavigate();
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

  return (
    <div className="topics-container">
      <BackButton />
      <h2>
        {category?.charAt(0).toUpperCase() + category?.slice(1)} Health Topics
      </h2>
      {topics.length > 0 ? (
        <ul className="topics-list">
          {topics.map((topic, idx) => (
            <li
              key={idx}
              className="topic-item"
              onClick={() => handleClick(topic)}
            >
              {topic}
            </li>
          ))}
          <input
            className="topic-item"
            type="text"
            placeholder="+ Other"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                handleOther(e);
              }
            }}
          />
        </ul>
      ) : (
        <p className="no-topics">No topics found for category: {category}</p>
      )}
    </div>
  );
};

export default TopicsList;
