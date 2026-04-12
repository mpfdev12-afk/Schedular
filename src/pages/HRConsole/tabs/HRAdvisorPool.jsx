import React, { useState, useEffect } from "react";
import { fetchDataFromApi, sendDataToapi } from "../../../utils/api";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
import { toast } from "react-toastify";
import { FaUserTie, FaPlus, FaTrash, FaStar } from "react-icons/fa";

const DOMAIN_LABELS = {
  mental: "Mental Health",
  physical: "Physical Wellness",
  financial: "Financial Wellbeing",
};

export default function HRAdvisorPool() {
  const [poolAdvisors, setPoolAdvisors] = useState([]);
  const [allAdvisors, setAllAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [poolRes, allRes] = await Promise.all([
        fetchDataFromApi("/hr/advisors"),
        fetchDataFromApi("/hr/advisors?scope=all"),
      ]);
      setPoolAdvisors(poolRes?.data || []);
      setAllAdvisors(allRes?.data || []);
    } catch (err) {
      console.error("Advisor pool load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (advisorId) => {
    setAssigning(advisorId);
    try {
      const res = await sendDataToapi("/hr/advisors/assign", { advisorId });
      if (res?.success || res?.data) {
        toast.success("Advisor added to your pool");
        await loadData();
      }
    } catch (err) {
      toast.error("Failed to assign advisor");
    } finally {
      setAssigning(null);
    }
  };

  const handleUnassign = async (advisorId) => {
    if (!window.confirm("Remove this advisor from your organization's pool?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/hr/advisors/unassign`, {
        data: { advisorId },
        withCredentials: true,
      });
      if (res?.data) {
        toast.success("Advisor removed from pool");
        await loadData();
      }
    } catch (err) {
      toast.error("Failed to remove advisor");
    }
  };

  const poolIds = new Set(poolAdvisors.map((a) => a._id?.toString()));
  const availableToAdd = allAdvisors.filter((a) => !poolIds.has(a._id?.toString()));

  if (loading) return <div className="hr-loading">Loading advisor pool...</div>;

  return (
    <>
      <div className="hr-page-header">
        <div className="greeting">Advisor Pool</div>
        <div className="subtitle">Curate which advisors serve your organization's employees</div>
      </div>

      {/* ─── Current Pool ─── */}
      <div className="hr-section-card" style={{ marginBottom: 32 }}>
        <h4 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <FaStar style={{ color: "#f59e0b" }} /> Your Dedicated Pool ({poolAdvisors.length})
        </h4>

        {poolAdvisors.length === 0 ? (
          <div style={{ color: "#94a3b8", padding: "24px 0", textAlign: "center" }}>
            No advisors assigned yet. Add from the platform pool below.
          </div>
        ) : (
          <div className="advisor-grid">
            {poolAdvisors.map((advisor) => (
              <AdvisorCard
                key={advisor._id}
                advisor={advisor}
                inPool
                onAction={() => handleUnassign(advisor._id)}
                loading={assigning === advisor._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Platform Advisors to Add ─── */}
      <div className="hr-section-card">
        <h4 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <FaUserTie style={{ color: "#6366f1" }} /> Platform Advisors ({availableToAdd.length})
        </h4>

        {availableToAdd.length === 0 ? (
          <div style={{ color: "#94a3b8", padding: "24px 0", textAlign: "center" }}>
            All platform advisors are already in your pool.
          </div>
        ) : (
          <div className="advisor-grid">
            {availableToAdd.map((advisor) => (
              <AdvisorCard
                key={advisor._id}
                advisor={advisor}
                inPool={false}
                onAction={() => handleAssign(advisor._id)}
                loading={assigning === advisor._id}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .advisor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .advisor-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .advisor-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .advisor-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          background: #ede9fe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #6366f1;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .advisor-name { font-weight: 600; font-size: 0.95rem; color: #1e293b; }
        .advisor-domain {
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 20px;
          background: #ede9fe;
          color: #6366f1;
          width: fit-content;
        }
        .advisor-exp { font-size: 0.78rem; color: #64748b; }
        .advisor-action-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .advisor-action-btn.add {
          background: #ede9fe;
          color: #6366f1;
        }
        .advisor-action-btn.add:hover { background: #ddd6fe; }
        .advisor-action-btn.remove {
          background: #fef2f2;
          color: #ef4444;
        }
        .advisor-action-btn.remove:hover { background: #fee2e2; }
        .advisor-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .hr-section-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
        }
      `}</style>
    </>
  );
}

function AdvisorCard({ advisor, inPool, onAction, loading }) {
  const initials = advisor.fullname
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="advisor-card">
      <div className="advisor-card-top">
        {advisor.profilepic ? (
          <img src={advisor.profilepic} alt={advisor.fullname} className="advisor-avatar" />
        ) : (
          <div className="advisor-avatar">{initials}</div>
        )}
        <div>
          <div className="advisor-name">{advisor.fullname}</div>
          <div className="advisor-exp">{advisor.experienceYears || 0} yrs exp</div>
        </div>
      </div>
      <div className="advisor-domain">
        {DOMAIN_LABELS[advisor.domain] || advisor.domain || "General"}
      </div>
      {advisor.specialization && (
        <div className="advisor-exp">{advisor.specialization}</div>
      )}
      <button
        className={`advisor-action-btn ${inPool ? "remove" : "add"}`}
        onClick={onAction}
        disabled={loading}
      >
        {loading ? (
          "..."
        ) : inPool ? (
          <><FaTrash /> Remove from Pool</>
        ) : (
          <><FaPlus /> Add to Pool</>
        )}
      </button>
    </div>
  );
}
