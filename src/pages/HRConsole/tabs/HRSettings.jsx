import React, { useState, useEffect } from "react";
import { fetchDataFromApi, sendDataToapi, deleteDataFromApi } from "../../../utils/api";
import { toast } from "react-toastify";
import { FaKey, FaTrash, FaCopy, FaEye, FaEyeSlash } from "react-icons/fa";
import "./HRSettings.scss";

export default function HRSettings() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [newKeyData, setNewKeyData] = useState(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetchDataFromApi("/org/apikeys");
      if (res?.success) setKeys(res.data);
    } catch (err) {
      console.error("Failed to load API keys:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!newKeyName) return toast.error("Please enter a name for the key");
    setGenerating(true);
    try {
      const res = await sendDataToapi("/org/apikeys", { name: newKeyName });
      if (res?.success) {
        setNewKeyData(res.data);
        setNewKeyName("");
        fetchKeys();
        toast.success("API Key generated successfully");
      }
    } catch (err) {
      toast.error("Failed to generate API key");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (keyId) => {
    if (!window.confirm("Are you sure you want to revoke this API key? This cannot be undone.")) return;
    try {
      const res = await deleteDataFromApi(`/org/apikeys/${keyId}`);
      if (res?.success) {
        toast.success("API key revoked");
        fetchKeys();
      }
    } catch (err) {
      toast.error("Failed to revoke key");
    }
  };

  return (
    <div className="hr-settings-tab">
      <div className="hr-page-header">
        <div className="greeting">Organization Settings</div>
        <div className="subtitle">Manage API keys and developer configurations</div>
      </div>

      <div className="settings-section">
        <div className="section-header">
          <h3><FaKey /> API Keys</h3>
          <p>Use these keys to integrate Fmpire data into your internal HR dashboards.</p>
        </div>

        <div className="key-generator">
          <input 
            type="text" 
            placeholder="Key Name (e.g. Internal Dashboard)" 
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <button onClick={handleGenerate} disabled={generating}>
            {generating ? "Generating..." : "Generate New Key"}
          </button>
        </div>

        {newKeyData && (
          <div className="new-key-alert">
            <div className="alert-header">
              <strong>Your New API Key</strong>
              <button onClick={() => setNewKeyData(null)}>Close</button>
            </div>
            <p>Make sure to copy your API key now. You won't be able to see it again!</p>
            <div className="key-display">
              <input 
                type={showKey ? "text" : "password"} 
                readOnly 
                value={newKeyData.apiKey} 
              />
              <button onClick={() => setShowKey(!showKey)}>
                {showKey ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button onClick={() => {
                navigator.clipboard.writeText(newKeyData.apiKey);
                toast.success("Copied to clipboard");
              }}>
                <FaCopy /> Copy
              </button>
            </div>
          </div>
        )}

        <div className="keys-list">
          {loading ? (
            <div className="keys-loading">Loading keys...</div>
          ) : keys.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Last Used</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key._id}>
                    <td>{key.name}</td>
                    <td>{new Date(key.createdAt).toLocaleDateString()}</td>
                    <td>{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : "Never"}</td>
                    <td>
                      <button className="revoke-btn" onClick={() => handleRevoke(key._id)}>
                        <FaTrash /> Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-keys">No API keys generated yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
