import React, { useState } from "react";
import "./CreateBatch.scss";
import { sendDataToapi } from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { topicsData } from "../../data/topicsList";
import { weekdays } from "../../data/Usabledata";
import BackButton from "../../components/BackButton/BackButton";

const CreateBatch = () => {
  const { advisorId } = useParams();

  const navigate = useNavigate();

  const [domain, setDomain] = useState("");
  const [formData, setFormData] = useState({
    advisorId,
    topic: "",
    description: "",
    domain: "",
    weekDay: "",
    maxAttendee: "",
    slotTime: "",
    startDate: "",
    learningMaterial: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDomainChange = (e) => {
    setDomain(e.target.value);
    handleChange(e); // updates domain in formData too
  };

  const formatTopicForUrl = (topic) => {
    return topic.toLowerCase().replace(/\s+/g, "-");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    sendDataToapi("/batch/create", JSON.stringify(formData), "application/json")
      .then((res) => {
        toast.success("Batch Created Successfully!");
        console.log(res);
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error("Error in creating batch!");
        console.error(err);
      });
  };

  return (
    <div className="create">
      <BackButton />
      <form onSubmit={handleSubmit}>
        <h2>Create Batch</h2>

        <div className="form-row">
          <select
            name="domain"
            onChange={handleDomainChange}
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select Your Domain
            </option>
            <option value="mental">Mental</option>
            <option value="physical">Physical</option>
            <option value="financial">Financial</option>
          </select>

          {
            <select
              name="topic"
              onChange={handleChange}
              defaultValue=""
              required
              disabled={!domain}
            >
              <option value="" disabled>
                Select Your Topic
              </option>
              {domain &&
                topicsData[domain].map((topic, i) => (
                  <option key={i} value={formatTopicForUrl(topic)}>
                    {topic}
                  </option>
                ))}
            </select>
          }
        </div>

        <div className="form-row">
          <select name="weekDay" onChange={handleChange} defaultValue="">
            <option value="" disabled>
              Select Your WeekDay
            </option>
            {weekdays.map((day, i) => (
              <option key={i} value={i}>
                {day}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="maxAttendee"
            placeholder="Max Attendees"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="number"
            name="slotTime"
            placeholder="Slot Time (e.g. 930, 1430)"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <input
          type="text"
          name="learningMaterial"
          placeholder="Learning Material Link"
          onChange={handleChange}
        />

        <button type="submit">Create Batch</button>
      </form>
    </div>
  );
};

export default CreateBatch;
