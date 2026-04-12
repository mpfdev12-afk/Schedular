import React, { useState, useEffect } from "react";
import "./Pharmacy.scss";
import { sendDataToapi } from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { FaPills, FaShoppingCart, FaTrash, FaCheckCircle, FaSearch, FaHistory } from "react-icons/fa";

const OTC_CATALOG = [
  { id: "otc1", name: "Paracetamol 500mg", type: "Tablet", price: 40, originalPrice: 60 },
  { id: "otc2", name: "Multivitamin Gold", type: "Capsule", price: 299, originalPrice: 450 },
  { id: "otc3", name: "Digital Thermometer", type: "Device", price: 199, originalPrice: 350 },
  { id: "otc4", name: "ORS Apple Drink", type: "Liquid", price: 35, originalPrice: 45 }
];

export default function Pharmacy() {
  const navigate = useNavigate();
  const location = useLocation();
  const rxMedicines = location.state?.medicines || []; // Passed from PrescriptionView
  const prescriptionId = location.state?.prescriptionId;

  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1); // 1: Shop, 2: Checkout, 3: Success
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-add prescribed medicines to cart
  useEffect(() => {
    if (rxMedicines.length > 0) {
      const initialItems = rxMedicines.map(m => ({
        id: `rx-${Math.random()}`,
        name: m.name,
        price: 150, // Mock price for Rx items
        qty: 1,
        fromRx: true
      }));
      setCart(initialItems);
      toast.info("Prescribed medicines added to cart");
    }
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(c => c.name === item.name);
    if (existing) {
      setCart(cart.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    toast.success(`${item.name} added`);
  };

  const removeFromCart = (name) => {
    setCart(cart.filter(c => c.name !== name));
  };

  const totalAmount = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

  const handleOrder = async () => {
    if (!address) return toast.error("Please enter delivery address");
    
    setLoading(true);
    try {
      const res = await sendDataToapi("/health/pharmacy-order", {
        items: cart,
        address,
        prescriptionId,
        totalAmount
      });
      if (res?.success) {
        setStep(3);
        setCart([]);
      }
    } catch (err) {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pharmacy-container">
      <div className="view-header">
        <BackButton />
        <div className="title-area">
          <h1>{step === 3 ? "Order Placed" : "E-Pharmacy"}</h1>
          <p>Verified medicines delivered to your doorstep</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="shop" 
            className="pharmacy-shop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {rxMedicines.length > 0 && (
              <div className="rx-alert-banner glass-card">
                <FaPills className="alert-icon" />
                <div className="alert-text">
                  <strong>Prescription Found</strong>
                  <p>Commonly prescribed items have been auto-added to your cart.</p>
                </div>
              </div>
            )}

            <div className="shop-layout">
              <div className="catalog-side">
                <div className="search-bar glass-card">
                  <FaSearch />
                  <input 
                    type="text" 
                    placeholder="Search medicines or health products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="trending-section">
                  <h3>Popular Items</h3>
                  <div className="item-grid">
                    {OTC_CATALOG.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                      <div key={item.id} className="item-card glass-card">
                        <div className="item-thumb">📦</div>
                        <div className="item-info">
                          <span className="type">{item.type}</span>
                          <h4>{item.name}</h4>
                          <div className="price-row">
                            <span className="price">₹{item.price}</span>
                            <span className="old">₹{item.originalPrice}</span>
                          </div>
                        </div>
                        <button className="add-btn" onClick={() => addToCart(item)}>+</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cart-side glass-card">
                <div className="cart-header">
                  <h3><FaShoppingCart /> Your Cart</h3>
                  <span className="item-count">{cart.length} items</span>
                </div>
                
                <div className="cart-list">
                  {cart.length > 0 ? (
                    cart.map((item, idx) => (
                      <div key={idx} className="cart-item">
                        <div className="item-details">
                          <span className="name">{item.name} {item.fromRx && <span className="rx-tag">Rx</span>}</span>
                          <span className="qty-price">₹{item.price} × {item.qty}</span>
                        </div>
                        <button className="remove-btn" onClick={() => removeFromCart(item.name)}><FaTrash /></button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-cart">Cart is empty</div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="cart-footer">
                    <div className="total-row">
                      <span>Total</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => setStep(2)}>
                      Proceed to Checkout →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="checkout" 
            className="pharmacy-checkout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="checkout-grid">
              <div className="checkout-form glass-card">
                <h3>Delivery Address</h3>
                <textarea 
                  placeholder="Enter full address for medicine delivery..."
                  rows={5}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                
                <div className="delivery-info">
                  <div className="info-pill">🚚 Express Delivery (24 hrs)</div>
                  <div className="info-pill">🛡️ Quality Insured</div>
                </div>

                <div className="checkout-actions">
                  <button className="back-btn" onClick={() => setStep(1)}>← Back to Shop</button>
                  <button 
                    className="pay-btn" 
                    onClick={handleOrder}
                    disabled={loading}
                  >
                    {loading ? "Ordering..." : "Confirm & Pay on Delivery"}
                  </button>
                </div>
              </div>

              <div className="order-summary-box glass-card">
                <h3>Order Summary</h3>
                <div className="summary-list">
                   {cart.map((item, idx) => (
                      <div key={idx} className="summary-item">
                        <span>{item.qty} × {item.name}</span>
                        <span>₹{item.qty * item.price}</span>
                      </div>
                   ))}
                </div>
                <div className="summary-total">
                  <div className="row">
                    <span>Items Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="row">
                    <span>Delivery Fee</span>
                    <span>₹0 <strike>₹40</strike></span>
                  </div>
                  <div className="final-total">
                    <span>Amount Payable</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="success" 
            className="success-view-pharmacy"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-content glass-card">
              <div className="check-icon"><FaCheckCircle /></div>
              <h2>Order Placed!</h2>
              <p>Your medicines are being packed. Our partner pharmacist will call you if any clarification is needed.</p>
              
              <div className="order-status-timeline">
                <div className="status-step active">Order Placed</div>
                <div className="status-step">Pharmacist Verification</div>
                <div className="status-step">Out for Delivery</div>
              </div>

              <button className="primary-btn" onClick={() => navigate("/physical-hub")}>Back to Health Hub</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
