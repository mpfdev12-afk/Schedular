import React from "react";
import "./PrescriptionView.scss";
import BackButton from "../../components/BackButton/BackButton";
import { FaFilePrescription, FaStethoscope, FaClipboardList, FaDownload, FaPills, FaFlask } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PrescriptionView({ data }) {
  const navigate = useNavigate();
  // Mock data if none provided
  const record = data || {
    type: "doctor", // or 'advisor'
    doctorName: "Dr. Priya Sharma",
    doctorTitle: "MBBS, MD (Internal Medicine)",
    regNumber: "MCI-12345",
    date: "11 Apr 2026",
    diagnosis: "Type 2 Diabetes, Mild",
    medicines: [
      { name: "Metformin 500mg", dosage: "1 tab twice daily, after meals", duration: "30 days" },
      { name: "Vitamin D3 60,000 IU", dosage: "1 sachet weekly", duration: "8 weeks" }
    ],
    notes: "Reduce sugar intake. Walk 30 min daily. Follow up in 30 days with HbA1c test.",
    recommendedTests: ["HbA1c", "Lipid Profile"]
  };

  const isDoctor = record.type === "doctor";

  return (
    <div className="prescription-view-container">
      <div className="view-header">
        <BackButton />
        <h1>{isDoctor ? "Medical Prescription" : "Wellness Action Plan"}</h1>
      </div>

      <div className="prescription-card glass-card">
        <div className="rx-header">
          <div className="professional-info">
            <div className="prof-icon">{isDoctor ? <FaStethoscope /> : <FaClipboardList />}</div>
            <div className="details">
              <h3>{record.doctorName || record.advisorName}</h3>
              <p>{record.doctorTitle || record.advisorTitle}</p>
              {isDoctor && <span>Reg No: {record.regNumber}</span>}
            </div>
          </div>
          <div className="rx-date">{record.date}</div>
        </div>

        <div className="rx-body">
          {isDoctor && (
            <div className="diagnosis-box">
              <label>Diagnosis</label>
              <p>{record.diagnosis}</p>
            </div>
          )}

          <div className="items-section">
            <h4>{isDoctor ? <><FaPills /> Prescribed Medicines</> : "Suggested Activities"}</h4>
            <div className="items-list">
              {(isDoctor ? record.medicines : record.activities).map((item, idx) => (
                <div key={idx} className="rx-item">
                  <div className="item-main">
                    <span className="name">{item.name}</span>
                    <span className="dosage">{item.dosage || item.instruction}</span>
                  </div>
                  <div className="item-meta">{item.duration}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="notes-section">
            <label>Professional Notes</label>
            <p>{record.notes}</p>
          </div>

          {record.recommendedTests && (
            <div className="tests-section">
              <h4><FaFlask /> Recommended Lab Tests</h4>
              <div className="test-tags">
                {record.recommendedTests.map(test => <span key={test} className="test-tag">{test}</span>)}
              </div>
            </div>
          )}
        </div>

        <div className="rx-footer">
          <button className="download-btn"><FaDownload /> Download PDF</button>
          {isDoctor ? (
            <div className="action-btns">
              <button 
                className="action-btn pharmacy" 
                onClick={() => navigate("/pharmacy", { state: { medicines: record.medicines, prescriptionId: record.id || "123" } })}
              >
                Order Medicines Now →
              </button>
              {record.recommendedTests && (
                <button 
                  className="action-btn labs" 
                  onClick={() => navigate("/health-checkup", { state: { recommendedTest: record.recommendedTests[0], prescriptionId: record.id || "123" } })}
                >
                  Book Lab Tests →
                </button>
              )}
            </div>
          ) : (
            <button className="action-btn physical" onClick={() => navigate("/physical-hub")}>
              Open Physical Hub →
            </button>
          )}
        </div>
      </div>

      <div className="disclaimer">
        {isDoctor 
          ? "This is a digitally signed e-prescription valid for pharmacy orders. Always consult your doctor before starting new medication."
          : "This is a wellness guidance plan and not a medical prescription. Please consult a doctor for medical issues."}
      </div>
    </div>
  );
}
