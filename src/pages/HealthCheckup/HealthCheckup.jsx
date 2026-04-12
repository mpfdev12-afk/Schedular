import React, { useState } from "react";
import "./HealthCheckup.scss";
import { sendDataToapi } from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldVirus, FaHeartbeat, FaMicroscope, FaHome, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const PACKAGES = [
  {
    id: "essential",
    name: "Essential Health Checkup",
    price: 899,
    originalPrice: 1499,
    discount: "40% off",
    icon: <FaShieldVirus />,
    tests: ["CBC (24 parameters)", "Blood Sugar (Fasting)", "Lipid Profile", "Thyroid (TSH)", "Liver Function (LFT)", "Kidney Function (KFT)"],
    features: ["Home sample collection", "Digital report in 24 hrs"]
  },
  {
    id: "comprehensive",
    name: "Comprehensive Wellness",
    price: 1499,
    originalPrice: 2999,
    discount: "50% off",
    icon: <FaHeartbeat />,
    tests: ["Everything in Essential +", "Vitamin D2/D3", "Vitamin B12", "HbA1c (Diabetes)", "Iron Studies", "Urine Routine"],
    features: ["Advised for 30+ years", "Home sample collection"]
  }
];

export default function HealthCheckup() {
  const navigate = useNavigate();
  const location = useLocation();
  const recommendedTest = location.state?.recommendedTest; // Passed from PrescriptionView

  const [step, setStep] = useState(1); // 1: Select Package, 2: Details, 3: Success
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    slot: "07:00 AM - 09:00 AM",
    address: ""
  });
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!bookingData.date || !bookingData.address) {
      return toast.error("Please fill in the date and address");
    }

    setLoading(true);
    try {
      const res = await sendDataToapi("/health/booking", {
        packageName: selectedPkg.name,
        price: selectedPkg.price,
        scheduledDate: bookingData.date,
        scheduledSlot: bookingData.slot,
        address: bookingData.address,
        prescriptionId: location.state?.prescriptionId
      });

      if (res?.success) {
        setStep(3);
        toast.success("Booking confirmed!");
      }
    } catch (err) {
      toast.error("Failed to book checkup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-checkup-container">
      <div className="view-header">
        <BackButton />
        <div className="title-area">
          <h1>{step === 3 ? "Booking Confirmed" : "Book Health Checkup"}</h1>
          <p>Preventive health screening for early detection</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1" 
            className="package-selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {recommendedTest && (
              <div className="recommendation-banner glass-card">
                <div className="rec-icon">📋</div>
                <div className="rec-text">
                  <strong>Recommended for you</strong>
                  <p>"{recommendedTest}" as advised by your doctor.</p>
                </div>
              </div>
            )}

            <div className="package-grid">
              {PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className={`package-card glass-card ${recommendedTest && pkg.id === 'comprehensive' ? 'highlighted' : ''}`}
                >
                  <div className="pkg-header">
                    <div className="pkg-icon">{pkg.icon}</div>
                    <div className="pkg-title">
                      <h3>{pkg.name}</h3>
                      <span className="discount-badge">{pkg.discount}</span>
                    </div>
                  </div>
                  
                  <ul className="test-list">
                    {pkg.tests.map((t, idx) => (
                      <li key={idx} className={recommendedTest && t.includes(recommendedTest) ? 'bold-test' : ''}>
                        • {t}
                      </li>
                    ))}
                  </ul>

                  <div className="pkg-features">
                    {pkg.features.map((f, idx) => <span key={idx} className="feat"><FaCheckCircle /> {f}</span>)}
                  </div>

                  <div className="pkg-footer">
                    <div className="price-tag">
                      <span className="current">₹{pkg.price}</span>
                      <span className="old">₹{pkg.originalPrice}</span>
                    </div>
                    <button 
                      className="book-btn"
                      onClick={() => {
                        setSelectedPkg(pkg);
                        setStep(2);
                      }}
                    >
                      Select Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2" 
            className="booking-form-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="selected-summary glass-card">
              <div className="summary-left">
                <span className="label">Selected Package</span>
                <h4>{selectedPkg.name}</h4>
              </div>
              <div className="summary-right">
                <span className="price">₹{selectedPkg.price}</span>
              </div>
            </div>

            <div className="form-sections">
              <div className="form-box glass-card">
                <div className="section-title"><FaCalendarAlt /> Appointment Details</div>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Time Slot (Morning preferred for fasting tests)</label>
                  <select 
                    value={bookingData.slot}
                    onChange={(e) => setBookingData({...bookingData, slot: e.target.value})}
                  >
                    <option>06:00 AM - 08:00 AM</option>
                    <option>08:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 12:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-box glass-card">
                <div className="section-title"><FaHome /> Collection Address</div>
                <div className="form-group">
                  <label>Home/Office Address</label>
                  <textarea 
                    placeholder="Enter full address for sample collection..."
                    rows={4}
                    value={bookingData.address}
                    onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="actions">
              <button className="back-link" onClick={() => setStep(1)}>← Change Package</button>
              <button 
                className="confirm-booking-btn"
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? "Confirming..." : "Confirm Booking (+20 VP 🎉)"}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3" 
            className="success-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="success-card glass-card">
              <div className="celebration">🎉</div>
              <h3>Order Placed Successfully!</h3>
              <p>Your health checkup is scheduled for <strong>{bookingData.date}</strong>.</p>
              <div className="next-steps">
                <p><strong>What's next?</strong></p>
                <ul>
                  <li>Phlebotomist will call you 30 mins before arrival.</li>
                  <li>10-12 hours fasting is required for accurate results.</li>
                  <li>Reports will be available in your Health Hub within 24-48 hours.</li>
                </ul>
              </div>
              <button className="primary-btn" onClick={() => navigate("/physical-hub")}>Go to Physical Hub</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
