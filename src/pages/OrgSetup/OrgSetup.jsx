import React, { useState, useEffect } from "react";
import "./OrgSetup.scss";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaBuilding, FaGlobe, FaPalette, FaRocket, FaGlobeAmericas, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { sendDataToapi, updateDatatoapi } from "../../utils/api";
import { toast, ToastContainer } from "react-toastify";
import LiveLogo from "../../components/Navbar/LiveLogo";
import Loader from "../../components/Loader/Loader";

const STEPS = [
  { id: 1, title: "Foundation", icon: <FaBuilding /> },
  { id: 2, title: "Identity", icon: <FaPalette /> },
  { id: 3, title: "Security", icon: <FaGlobe /> },
  { id: 4, title: "Deploy", icon: <FaRocket /> }
];

export default function OrgSetup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Guard: Redirect to login if not authenticated
  useEffect(() => {
    // Check for _id to ensure the user object isn't just the empty initial state
    if (!user || !user._id) {
      toast.info("Please sign in to set up your business account");
      navigate("/user/login?redirect=/org-setup");
    }
  }, [user, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logo: "",
    primaryColor: "#6366f1",
    authorizedEmailDomains: []
  });
  
  const [newDomain, setNewDomain] = useState("");
  const [orgCreated, setOrgCreated] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleCreateOrg = async () => {
    if (!formData.name || !formData.slug) return toast.error("Please fill required fields");
    setLoading(true);
    try {
      const res = await sendDataToapi("/org/register", JSON.stringify({
        name: formData.name,
        slug: formData.slug,
        plan: "enterprise", // Default trial plan
        maxSeats: 100,
        authorizedEmailDomains: formData.authorizedEmailDomains
      }), "application/json");

      if (res?.data?.success) {
        setOrgCreated(true);
        nextStep();
      }
    } catch (err) {
      toast.error(err.message || "Failed to reserve your corporate slug");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const res = await updateDatatoapi("/org/branding", JSON.stringify({
        logo: formData.logo,
        primaryColor: formData.primaryColor,
        authorizedEmailDomains: formData.authorizedEmailDomains
      }), "application/json");
      
      if (res?.data?.success) {
        toast.success("Portal Deployed Successfully!");
        setTimeout(() => navigate("/hr-console"), 2000);
      }
    } catch (err) {
      toast.error("Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  const addDomain = () => {
    if (!newDomain) return;
    const clean = newDomain.replace(/@/g, "").trim().toLowerCase();
    if (formData.authorizedEmailDomains.includes(clean)) return;
    setFormData({ ...formData, authorizedEmailDomains: [...formData.authorizedEmailDomains, clean] });
    setNewDomain("");
  };

  const removeDomain = (d) => {
    setFormData({ ...formData, authorizedEmailDomains: formData.authorizedEmailDomains.filter(item => item !== d) });
  };

  return (
    <div className="org-setup-page">
      {loading && <Loader />}
      <div className="setup-bg"></div>
      
      <div className="setup-workflow-container">
        {/* Progress Sidebar */}
        <div className="setup-stepper">
          <div className="stepper-branding">
            <LiveLogo size={40} />
            <h3>B2B Portal Setup</h3>
          </div>
          <div className="steps-list">
            {STEPS.map(s => (
              <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                <div className="step-icon">{step > s.id ? <FaCheck /> : s.icon}</div>
                <div className="step-label">{s.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <main className="setup-content">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="step-card"
              >
                <h2>Let's build your foundation</h2>
                <p>Define your company's identity on the Fmpire network.</p>
                
                <div className="step-content">
      <div className="form-group animate-slide-up">
        <label>Organization Name</label>
        <div className="input-with-icon">
          <FaBuilding />
          <input 
            type="text" 
            placeholder="e.g. Acme Corp" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>
      
      <div className="form-group animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <label>Corporate URL Slug</label>
        <div className="slug-input-group">
          <span className="prefix">fmpire.com/</span>
          <input 
            type="text" 
            placeholder="acme" 
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })}
          />
        </div>
        <p className="field-hint">Your employees will access the portal via {formData.slug || 'slug'}.fmpire.com</p>
      </div>

      <div className="form-group animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <label>Authorized Primary Domain</label>
        <div className="domain-setup-group">
          <div className="input-with-icon">
            <FaGlobeAmericas />
            <input 
              type="text" 
              placeholder="e.g. acme-corp.com" 
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDomain())}
            />
            <button type="button" onClick={addDomain} className="add-domain-inline"><FaPlus /></button>
          </div>
          <div className="domain-chips mt-2">
            {formData.authorizedEmailDomains.map(d => (
              <span key={d} className="domain-chip">
                {d} <FaTimes onClick={() => removeDomain(d)} />
              </span>
            ))}
          </div>
        </div>
        <p className="field-hint">Any user signing up with @domain.com will be auto-linked.</p>
      </div>

      <button className="setup-primary-btn" onClick={handleCreateOrg}>
        Reserve Slug & Continue
      </button>
    </div>
          </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="step-card identity-step"
              >
                <div className="step-form">
                  <h2>Visual Identity</h2>
                  <p>Customize how your employees see the portal.</p>

                  <div className="form-group">
                    <label>Logo URL (White transparent preferred)</label>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      value={formData.logo}
                      onChange={e => setFormData({ ...formData, logo: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Brand Primary Color</label>
                    <div className="color-picker-row">
                      <input 
                        type="color" 
                        value={formData.primaryColor}
                        onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                      />
                      <span>{formData.primaryColor}</span>
                    </div>
                  </div>
                  
                  <div className="actions">
                    <button className="secondary-btn" onClick={prevStep}>Back</button>
                    <button className="primary-btn" onClick={nextStep}>Looks Good</button>
                  </div>
                </div>

                {/* LIVE PREVIEW AREA */}
                <div className="live-preview-container">
                   <div className="preview-label">Live Portal Preview</div>
                   <div className="portal-mockup" style={{ '--primary': formData.primaryColor }}>
                      <div className="mock-nav">
                        {formData.logo ? <img src={formData.logo} alt="Preview" /> : <div className="placeholder-logo"></div>}
                        <div className="mock-user"></div>
                      </div>
                      <div className="mock-body">
                         <div className="mock-sidebar"></div>
                         <div className="mock-main">
                            <div className="mock-hero" style={{ background: formData.primaryColor, opacity: 0.1 }}></div>
                            <div className="mock-card">
                               <div className="mock-title" style={{ color: formData.primaryColor }}>Corporate Wellness</div>
                               <div className="mock-btn" style={{ background: formData.primaryColor }}>Book Session</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="step-card"
              >
                <h2>Domain Security</h2>
                <div className="security-summary-card">
                   <div className="security-icon-large">
                     <FaGlobe />
                   </div>
                   <h3>Identity Verified</h3>
                   <p>The following domains are now authorized for automatic employee linkage:</p>
                   
                   <div className="domain-list-final">
                      {formData.authorizedEmailDomains.map(d => (
                        <div key={d} className="domain-tag-final">@{d}</div>
                      ))}
                      {formData.authorizedEmailDomains.length === 0 && <p className="text-error">No domains authorized. Users must be manually invited.</p>}
                   </div>
                   
                   <div className="security-feature-list">
                      <div className="feature"><FaCheck /> JIT (Just-In-Time) Account Linkage</div>
                      <div className="feature"><FaCheck /> Domain-restricted Registrations</div>
                   </div>
                </div>

                <div className="actions">
                  <button className="secondary-btn" onClick={prevStep}>Back to Identity</button>
                  <button className="primary-btn" onClick={nextStep}>Review & Deploy</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="step-card deploy-step"
              >
                <div className="success-icon"><FaRocket /></div>
                <h2>Ready for Launch!</h2>
                <p>Your corporate wellness environment is configured and ready for your employees.</p>
                
                <div className="summary-card">
                  <div className="summary-item"><strong>Company:</strong> {formData.name}</div>
                  <div className="summary-item"><strong>Subdomain:</strong> {formData.slug}.fmpire.com</div>
                  <div className="summary-item"><strong>Domain:</strong> @{formData.authorizedEmailDomains[0] || "None"}</div>
                </div>

                <div className="actions">
                  <button className="secondary-btn" onClick={prevStep}>Change Settings</button>
                  <button className="primary-btn launch" onClick={handleFinalize}>Deploy Portal Now</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
