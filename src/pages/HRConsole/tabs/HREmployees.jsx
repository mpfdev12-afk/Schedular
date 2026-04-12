import React, { useState, useEffect } from "react";
import { sendDataToapi, fetchDataFromApi } from "../../../utils/api";
import { toast } from "react-toastify";
import "./HREmployees.scss";

export default function HREmployees() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await fetchDataFromApi("/org/employees");
      if (res?.success) {
        setEmployees(res.data || []);
      }
    } catch (err) {
      toast.error("Failed to load employee directory");
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a valid CSV file");
    }
  };

  const parseCSV = (csv) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const emailIdx = headers.indexOf("email");
    const deptIdx = headers.indexOf("department");

    if (emailIdx === -1) throw new Error("CSV must contain an 'email' column");

    return lines
      .slice(1)
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const values = line.split(",").map((v) => v.trim());
        return {
          email: values[emailIdx],
          department: deptIdx !== -1 ? values[deptIdx] : null,
        };
      })
      .filter((emp) => emp.email);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResults(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const employees = parseCSV(text);

        if (employees.length === 0) {
          toast.warn("No valid employee data found in CSV");
          setLoading(false);
          return;
        }

        const response = await sendDataToapi("/org/invite-csv", { employees });
        
        if (response?.success) {
          setResults(response.data);
          toast.success("CSV processed successfully");
        }
      } catch (err) {
        console.error("CSV upload failed:", err);
        toast.error(err.message || "Failed to process CSV");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="hr-employees-tab">
      <div className="hr-page-header">
        <div className="greeting">Employee Management</div>
        <div className="subtitle">Bulk invite employees and manage organization seats</div>
      </div>

      <div className="directory-header-row">
        <div className="section-title">Active Directory ({employees.length})</div>
        <button className="refresh-btn" onClick={loadEmployees} disabled={fetching}>
           {fetching ? "Syncing..." : "Refresh List"}
        </button>
      </div>

      <div className="employee-directory-card">
         {fetching ? (
            <div className="table-loader">Fetching organization roster...</div>
         ) : employees.length === 0 ? (
            <div className="empty-state">
               No employees found. Use the CSV tool below to invite your team!
            </div>
         ) : (
            <div className="table-wrapper">
               <table className="employee-table">
                  <thead>
                     <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {employees.map(emp => (
                        <tr key={emp._id}>
                           <td>
                              <div className="user-info">
                                 <div className="mini-avatar" style={{ background: emp.profilepic ? `url(${emp.profilepic})` : '#6366f1' }}>
                                    {!emp.profilepic && emp.fullname?.[0]?.toUpperCase()}
                                 </div>
                                 <div className="details">
                                    <span className="name">{emp.fullname}</span>
                                    <span className="email">{emp.email}</span>
                                 </div>
                              </div>
                           </td>
                           <td>
                              <span className="dept-tag">{emp.department || "General"}</span>
                           </td>
                           <td>
                              <span className={`role-badge ${emp.orgRole}`}>{emp.orgRole?.replace('_', ' ')}</span>
                           </td>
                           <td>
                              <span className="status-indicator online">Active</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>

      <div className="hr-divider"></div>

      <div className="invite-card">
        <h3>Bulk Invite via CSV</h3>
        <p>Upload a CSV file with <code>email</code> and <code>department</code> columns.</p>
        
        <div className="upload-section">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            id="csv-upload"
            className="hidden-input"
          />
          <label htmlFor="csv-upload" className={`file-label ${file ? 'has-file' : ''}`}>
            {file ? file.name : "Choose CSV File"}
          </label>
          
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="upload-btn"
          >
            {loading ? "Processing..." : "Upload & Invite"}
          </button>
        </div>

        {results && (
          <div className="results-panel">
            <h4>Process Summary</h4>
            <div className="results-grid">
              <div className="res-item">
                <span className="res-label">Total Processed</span>
                <span className="res-val">{results.totalProcessed}</span>
              </div>
              <div className="res-item">
                <span className="res-label">Successfully Added</span>
                <span className="res-val success">{results.updated}</span>
              </div>
              <div className="res-item">
                <span className="res-label">Not Found / Errors</span>
                <span className="res-val error">{results.notFound?.length || 0}</span>
              </div>
            </div>
            {results.notFound?.length > 0 && (
              <div className="error-list">
                <h5>Emails not found (users must register first):</h5>
                <ul>
                  {results.notFound.slice(0, 10).map((email, i) => (
                    <li key={i}>{email}</li>
                  ))}
                  {results.notFound.length > 10 && <li>...and {results.notFound.length - 10} more</li>}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="instructions">
        <h4>CSV Template Example</h4>
        <pre>
          email,department{"\n"}
          john@example.com,Engineering{"\n"}
          jane@example.com,Marketing
        </pre>
      </div>
    </div>
  );
}
