import { useParams } from "react-router-dom";
import Cards from "../../components/Cards/Cards";
import { fetchDataFromApi } from "../../utils/api";
import "./AdvisorList.scss";
import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton/BackButton";
import { capitalizeWords } from "../../utils/usableFunctions";

const AdvisorList = () => {
  const [advisor, setadvisor] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category, topic } = useParams();

  useEffect(() => {
    setLoading(true);
    fetchDataFromApi("/advisors/getallAdvisors", {
      domain: `${category}`,
    })
      .then((res) => {
        setadvisor(res?.data?.advisor);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to fetch advisors:", err);
      });
  }, [category]);

  return (
    <div className="advisor-list-container">
      <BackButton />
      
      <div className="discovery-header">
        <span className="domain-badge">{capitalizeWords(category)} Health</span>
        <h1>Experts for {capitalizeWords(topic || "Holistic Care")}</h1>
        <p>Connecting you with top-tier professionals specializing in your path to wellness.</p>
      </div>

      {loading ? (
        <div className="list-loader">Synchronizing Experts...</div>
      ) : (
        <div className="list">
          {advisor && advisor.length > 0 ? (
            advisor.map((adv) => (
              <Cards key={adv._id} advisor={adv} />
            ))
          ) : (
            <div className="empty-state">No experts found for this category yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvisorList;
