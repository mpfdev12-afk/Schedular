import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Schedule from "../Schedule/Schedule";
import AdvisorList from "../AdvisorList/AdvisorList";
import "./Batches.scss";
import BatchCard from "../../components/Cards/BatchCard";
import { weekdays } from "../../data/Usabledata";
import { fetchDataFromApi } from "../../utils/api";
import AdvisorSearch from "../../components/auto-complete-search/AdvisorSearch";
import { capitalizeWords } from "../../utils/usableFunctions";
import BackButton from "../../components/BackButton/BackButton";

const Batches = () => {
  const { isGroup } = useParams();
  const { category, topic } = useParams();

  const [batches, setBatches] = useState([]);
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
    try {
      fetchDataFromApi("/batch/filter", {
        domain: category,
        topic,
        ...filters,
      }).then((res) => {
        console.log(res);
        console.log(filters);
        setBatches(res.data.batches);
      });
    } catch (err) {
      console.error("Failed to fetch batches", err);
    }
  }, [filters]);

  return (
    <>
      <BackButton />
      {isGroup !== "group" ? (
        <AdvisorList />
      ) : (
        <div className="batches">
          <h2>Available Batches For {capitalizeWords(topic)}</h2>

          <div className="filters">
            <AdvisorSearch setFilters={setFilterInputs} />

            <select
              value={filterInputs.weekDay}
              onChange={(e) =>
                setFilterInputs({ ...filterInputs, weekDay: e.target.value })
              }
            >
              <option value="">All Days</option>
              {weekdays.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Slot Time (e.g. 1100)"
              value={filterInputs.slotTime}
              onChange={(e) =>
                setFilterInputs({ ...filterInputs, slotTime: e.target.value })
              }
            />

            <button
              onClick={() => {
                setFilters(filterInputs);
              }}
            >
              Filter
            </button>
          </div>

          {batches.length === 0 ? (
            <p className="no-batches">No batches found.</p>
          ) : (
            <div className="batch-list">
              {batches.map((batch) => (
                <BatchCard key={batch._id} batch={batch} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Batches;
