import React, { useState } from "react";
import { updateDatatoapi } from "../../../utils/api";
import { toast } from "react-toastify";
import { useOrgBranding } from "../../../context/OrgBrandingContext";
import {
  FaPalette,
  FaCheck,
  FaFont,
  FaFillDrip,
  FaCircle,
  FaTv,
  FaMobileAlt,
  FaGlobe,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import "./HRBrandingStudio.scss";

const FONT_OPTIONS = [
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
  { name: "Inter", value: "Inter" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Outfit", value: "Outfit" },
  { name: "Roboto", value: "Roboto" },
  { name: "Playfair Display", value: "Playfair Display" },
];

const PRESET_PALETTES = [
  { name: "Fintech", primary: "#1e293b", secondary: "#3b82f6" },
  { name: "Healthcare", primary: "#0d9488", secondary: "#2dd4bf" },
  { name: "Modern", primary: "#4f46e5", secondary: "#818cf8" },
  { name: "Creative", primary: "#db2777", secondary: "#f472b6" },
];

export default function HRBranding({ org, onUpdate }) {
  // Use extended branding from org if it exists, fallback to defaults or old fields
  const [logo, setLogo] = useState(org?.logo || "");
  const [primaryColor, setPrimaryColor] = useState(
    org?.branding?.primaryColor || org?.primaryColor || "#4f46e5",
  );
  const [fontFamily, setFontFamily] = useState(
    org?.branding?.fontFamily || "Plus Jakarta Sans",
  );
  const [borderRadius, setBorderRadius] = useState(
    org?.branding?.borderRadius ?? 12,
  );
  const [uiDensity, setUiDensity] = useState(
    org?.branding?.uiDensity || "comfortable",
  );
  const [authorizedEmailDomains, setAuthorizedEmailDomains] = useState(
    org?.authorizedEmailDomains || [],
  );
  const [newDomain, setNewDomain] = useState("");

  const [saving, setSaving] = useState(false);

  const { refreshBranding } = useOrgBranding();

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateDatatoapi("/org/branding", {
        logo,
        primaryColor,
        fontFamily,
        borderRadius,
        uiDensity,
        authorizedEmailDomains,
      });
      if (res?.success) {
        toast.success("Design System updated permanently");
        if (onUpdate) onUpdate(res.data);
        // Refresh global branding context so CSS variables update immediately
        try {
          if (typeof refreshBranding === "function") await refreshBranding();
        } catch (err) {
          /* ignore */
        }
      }
    } catch (err) {
      toast.error("Cloud synchronisation failed");
    } finally {
      setSaving(false);
    }
  };

  const applyPalette = (palette) => {
    setPrimaryColor(palette.primary);
    toast.info(`Applied ${palette.name} theme`);
  };

  const addDomain = () => {
    if (!newDomain) return;
    const cleanDomain = newDomain.replace(/@/g, "").trim().toLowerCase();
    if (authorizedEmailDomains.includes(cleanDomain))
      return toast.error("Domain already added");
    setAuthorizedEmailDomains([...authorizedEmailDomains, cleanDomain]);
    setNewDomain("");
  };

  const removeDomain = (domain) => {
    setAuthorizedEmailDomains(
      authorizedEmailDomains.filter((d) => d !== domain),
    );
  };

  return (
    <div className="hr-branding-tab">
      <div className="hr-page-header">
        <div className="header-main">
          <div className="greeting">Brand Identity Studio</div>
          <a
            href={`http://${org?.slug}.localhost:5173`}
            target="_blank"
            rel="noopener noreferrer"
            className="live-domain-badge"
            title="Open Live Portal"
          >
            <FaGlobe /> {org?.slug}.fmpire.com
          </a>
        </div>
        <div className="subtitle">
          Engineer your organisation's unique digital environment
        </div>
      </div>

      <div className="studio-layout">
        {/* ─── Editor Console ─── */}
        <div className="studio-editor">
          <div className="editor-card">
            <h3>
              <FaPalette /> 1. Visual Identity
            </h3>
            <div className="form-group">
              <label>Corporate Logo (White Transparent Preferred)</label>
              <div className="logo-upload-zone">
                <input
                  type="text"
                  placeholder="Paste URL (https://...)"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
                {logo && (
                  <img
                    src={logo}
                    alt="Mini-preview"
                    className="current-logo-mini"
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Primary Brand Color</label>
              <div className="color-grid">
                <div className="color-box">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                  <span>{primaryColor}</span>
                </div>
                {PRESET_PALETTES.map((p) => (
                  <div
                    key={p.name}
                    className="palette-dot"
                    style={{
                      background: p.primary,
                      border:
                        primaryColor === p.primary ? "2px solid #000" : "none",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() => applyPalette(p)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="editor-card">
            <h3>
              <FaFont /> 2. Typography
            </h3>
            <div className="font-selector">
              {FONT_OPTIONS.map((f) => (
                <div
                  key={f.value}
                  className={`font-option ${fontFamily === f.value ? "active" : ""}`}
                  style={{ fontFamily: f.value }}
                  onClick={() => setFontFamily(f.value)}
                >
                  {f.name}
                </div>
              ))}
            </div>
          </div>

          <div className="editor-card">
            <h3>
              <FaFillDrip /> 3. Layout Systems
            </h3>
            <div className="form-group">
              <label>Interface Surface Radius ({borderRadius}px)</label>
              <div className="range-control">
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                />
                <div className="range-labels">
                  <span>Sharp</span>
                  <span>Rounded</span>
                  <span>Soft</span>
                </div>
              </div>
            </div>
          </div>

          <div className="editor-card">
            <h3>
              <FaGlobe /> 4. Security & Access
            </h3>
            <div className="form-group">
              <label>Authorized Email Domains</label>
              <p className="field-hint">
                Users registering with these domains will auto-link to your
                dashboard.
              </p>
              <div className="domains-manager">
                <div className="domain-input-group">
                  <input
                    type="text"
                    placeholder="e.g. google.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addDomain())
                    }
                  />
                  <button
                    type="button"
                    onClick={() => addDomain()}
                    className="add-domain-btn"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="domain-tags">
                  {authorizedEmailDomains.map((d) => (
                    <div key={d} className="domain-tag">
                      <span>{d}</span>
                      <FaTimes onClick={() => removeDomain(d)} />
                    </div>
                  ))}
                  {authorizedEmailDomains.length === 0 && (
                    <div className="no-domains-hint">
                      No authorized domains set. SSO & JIT will still work.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? (
              "Deploying Design..."
            ) : (
              <>
                <FaCheck /> Push to All Employees
              </>
            )}
          </button>
        </div>

        {/* ─── The Mirror (Mockup) ─── */}
        <div className="studio-preview">
          <div className="preview-header">
            <h4>"THE MIRROR" — LIVE MOCKUP</h4>
            <div className="device-toggle">
              <FaTv /> <FaMobileAlt style={{ opacity: 0.3 }} />
            </div>
          </div>

          <div className="mirror-frame" style={{ fontFamily: fontFamily }}>
            <div className="mock-nav">
              <div className="mock-logo-area">
                {logo ? (
                  <img src={logo} alt="Mock Logo" className="mock-logo" />
                ) : (
                  <div
                    style={{
                      width: 80,
                      height: 16,
                      background: "#f1f5f9",
                      borderRadius: 4,
                    }}
                  ></div>
                )}
              </div>
              <div className="mock-user"></div>
            </div>

            <div className="mock-layout">
              <div className="mock-sidebar">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="side-line"
                    style={{
                      width: i % 2 === 0 ? "100%" : "70%",
                      background: i === 1 ? primaryColor : "#e2e8f0",
                      opacity: i === 1 ? 0.3 : 0.5,
                    }}
                  ></div>
                ))}
              </div>
              <div className="mock-content">
                <div
                  className="mock-title"
                  style={{
                    color: primaryColor,
                    borderRadius: borderRadius / 2,
                  }}
                >
                  Mental Wellness
                </div>
                <div className="mock-cards">
                  <div
                    className="mock-card"
                    style={{ borderRadius: borderRadius }}
                  >
                    <div
                      className="bar"
                      style={{
                        width: "40%",
                        background: primaryColor,
                        opacity: 0.6,
                      }}
                    ></div>
                    <div className="bar" style={{ width: "80%" }}></div>
                    <div className="bar" style={{ width: "60%" }}></div>
                  </div>
                  <div
                    className="mock-card"
                    style={{ borderRadius: borderRadius }}
                  >
                    <div
                      className="bar"
                      style={{
                        width: "90%",
                        background: primaryColor,
                        opacity: 0.6,
                      }}
                    ></div>
                    <div className="bar" style={{ width: "30%" }}></div>
                  </div>
                </div>
                <div
                  className="mock-cta"
                  style={{
                    background: primaryColor,
                    borderRadius: borderRadius,
                    padding: uiDensity === "compact" ? "8px" : "12px",
                  }}
                >
                  Book Session
                </div>
              </div>
            </div>
          </div>

          <div className="studio-hint">
            ⚡ Changes are local to this studio until you <strong>Push</strong>{" "}
            them to the production cloud.
          </div>
        </div>
      </div>
    </div>
  );
}
