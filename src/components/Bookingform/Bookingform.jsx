import React, { useState } from "react";
import "./Bookingorm.scss";

function BookingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    detail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    alert(`Submitted:\n${JSON.stringify(formData, null, 2)}`);
    // You can send formData to your backend here
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }} className="booking-form">
      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Your Name"
          required
        />
        <br />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter Your PhoneNo"
          required
        />
        <br />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Your Email"
          required
        />
        <br />
        <textarea
          name="detail"
          value={formData.detail}
          onChange={handleChange}
          placeholder="Enter Details"
          rows="4"
          required
        ></textarea>
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default BookingForm;
