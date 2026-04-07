import { useState } from "react";
import "./CreateBatch.scss";
import { sendDataToapi } from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { topicsData } from "../../data/topicsList";
import { weekdays } from "../../data/Usabledata";
import BackButton from "../../components/BackButton/BackButton";

const DOMAIN_META = {
  mental:    { label: "Mental",    icon: "🧠", desc: "Mindfulness & Psychology" },
  physical:  { label: "Physical",  icon: "💪", desc: "Health & Fitness" },
  financial: { label: "Financial", icon: "📈", desc: "Finance & Wealth" },
};

const CreateBatch = () => {
  const { advisorId } = useParams();
  const navigate = useNavigate();
  const advisor = useSelector((state) => state.user);
  const advisorDomain = advisor?.domain || "";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    advisorId,
    topic: "",
    description: "",
    domain: advisorDomain,
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

  const formatTopicForUrl = (topic) =>
    topic.toLowerCase().replace(/\s+/g, "-");

  // Convert HH:MM time input to numeric format (e.g. "09:30" → 930)
  const timeToNumber = (timeStr) => {
    if (!timeStr) return "";
    return parseInt(timeStr.replace(":", ""), 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      slotTime: timeToNumber(formData.slotTime),
    };
    sendDataToapi("/batch/create", JSON.stringify(payload), "application/json")
      .then(() => {
        toast.success("Batch created successfully!");
        navigate("/dashboard");
      })
      .catch(() => toast.error("Error creating batch"))
      .finally(() => setLoading(false));
  };

  // Gate: advisor has no domain set
  if (!advisorDomain) {
    return (
      <div className="create-batch-page">
        <div className="bg-glow" />
        <BackButton />
        <div className="create-batch-container">
          <div className="no-domain-gate glass-card">
            <span className="gate-icon">⚠️</span>
            <h2>Domain not set</h2>
            <p>You need to set your domain (Mental / Physical / Financial) in your profile before creating a batch.</p>
            <button className="gate-btn" onClick={() => navigate("/dashboard")}>
              Complete Profile →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const domainMeta = DOMAIN_META[advisorDomain];

  return (
    <div className="create-batch-page">
      <div className="bg-glow" />
      <BackButton />

      <div className="create-batch-container">
        <div className="form-hero">
          <span className="form-badge">Advisor Studio</span>
          <h1>Create a New <span>Batch</span></h1>
          <p>Set up a group learning session for your community.</p>
        </div>

        <form className="batch-form glass-card" onSubmit={handleSubmit}>

          {/* Domain — read-only pill showing advisor's domain */}
          <div className="form-section">
            <label className="section-label">Domain</label>
            <div className={`domain-pill-display domain-${advisorDomain}`}>
              <span className="domain-icon">{domainMeta.icon}</span>
              <div>
                <span className="domain-label">{domainMeta.label}</span>
                <span className="domain-desc">{domainMeta.desc}</span>
              </div>
              <span className="domain-lock" title="Set in your profile">🔒</span>
            </div>
          </div>

          {/* Topic */}
          <div className="form-section">
            <label className="section-label">Topic <span className="req">*</span></label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="batch-select"
            >
              <option value="">Select a topic</option>
              {topicsData[advisorDomain].map((topic, i) => (
                <option key={i} value={formatTopicForUrl(topic)}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Schedule */}
          <div className="form-section">
            <label className="section-label">Schedule</label>
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Day of Week</label>
                <select name="weekDay" value={formData.weekDay} onChange={handleChange} className="batch-select">
                  <option value="">Select day</option>
                  {weekdays.map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Start Date <span className="req">*</span></label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="batch-input"
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Session Time <span className="req">*</span></label>
                <input
                  type="time"
                  name="slotTime"
                  value={formData.slotTime}
                  onChange={handleChange}
                  required
                  className="batch-input"
                />
              </div>
              <div className="field-group">
                <label className="field-label">Max Attendees</label>
                <input
                  type="number"
                  name="maxAttendee"
                  placeholder="e.g. 20"
                  min="1"
                  value={formData.maxAttendee}
                  onChange={handleChange}
                  className="batch-input"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="form-section">
            <label className="section-label">Details</label>
            <textarea
              name="description"
              placeholder="Describe what this batch covers, who it's for, and what attendees will gain..."
              value={formData.description}
              onChange={handleChange}
              className="batch-textarea"
              rows={4}
            />
            <input
              type="url"
              name="learningMaterial"
              placeholder="Learning material link (optional)"
              value={formData.learningMaterial}
              onChange={handleChange}
              className="batch-input"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="loading-dots">Creating<span>...</span></span> : "Launch Batch →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBatch;
