import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { sendDataToapi } from "../../utils/api";
import "./SigninForm.scss";

const RegisterAdvisor = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    title: "",
    dob: "",
    gender: "",
    specialization: "",
    qualification: "",
    description: "",
    experienceYears: "",
    category: "",
    availabilityStartDay: "",
    availabilityEndDay: "",
    slotStartTime: "",
    slotEndTime: "",
    breakSlots: "",
    slotDurationMinutes: "",
    domain: "",
    languagesSpoken: "",
    contactPhone: "",
    contactEmail: "",
    profilepic: null,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const data = new FormData();

    data.append("fullname", formData.fullname);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("title", formData.title);
    data.append("dob", formData.dob);
    data.append("gender", formData.gender);
    data.append("specialization", formData.specialization);
    data.append("qualification", formData.qualification);
    data.append("description", formData.description);
    data.append("experienceYears", formData.experienceYears);
    data.append("category", formData.category);
    data.append("domain", formData.domain);

    // contact
    data.append("contact[phone]", formData.contactPhone);
    data.append("contact[email]", formData.contactEmail);

    // availability
    data.append(
      "availability[workingDays][startDay]",
      formData.availabilityStartDay
    );
    data.append(
      "availability[workingDays][endDay]",
      formData.availabilityEndDay
    );
    data.append("availability[slotStartTime]", formData.slotStartTime);
    data.append("availability[slotEndTime]", formData.slotEndTime);
    data.append(
      "availability[slotDurationMinutes]",
      formData.slotDurationMinutes
    );

    // breakSlots array
    formData.breakSlots
      .split(",")
      .forEach((val, i) =>
        data.append(`availability[breakSlots][${i}]`, parseInt(val.trim()))
      );

    // languagesSpoken array
    formData.languagesSpoken
      .split(",")
      .forEach((val, i) => data.append(`languagesSpoken[${i}]`, val.trim()));

    if (formData.profilepic) {
      data.append("profilepic", formData.profilepic);
    }

    try {
      const res = await sendDataToapi("/advisors/registerAdvisor", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.href = "/";
    } catch (err) {
      setMsg("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {loading && <Loader />}
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Advisor Registration</h2>
        {msg && <p className="message">{msg}</p>}

        <div className="form-row">
          <input
            name="fullname"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
          />
          <input name="title" placeholder="Title" onChange={handleChange} />
        </div>

        <div className="form-row">
          <input name="dob" type="date" onChange={handleChange} />
          <input name="gender" placeholder="Gender" onChange={handleChange} />
        </div>

        <div className="form-row">
          <input
            name="specialization"
            placeholder="Specialization"
            onChange={handleChange}
          />
          <input
            name="qualification"
            placeholder="Qualification"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            name="experienceYears"
            placeholder="Experience (years)"
            onChange={handleChange}
          />
          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />
          <input
            name="domain"
            placeholder="Domain (e.g mental)"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            name="languagesSpoken"
            placeholder="Languages (comma separated)"
            onChange={handleChange}
          />
          <input
            name="contactPhone"
            placeholder="Phone"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            name="contactEmail"
            placeholder="Alternate Email"
            onChange={handleChange}
          />
          <input
            name="slotStartTime"
            placeholder="Slot Start Time (e.g. 900)"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            name="slotEndTime"
            placeholder="Slot End Time (e.g. 1700)"
            onChange={handleChange}
          />
          <input
            name="slotDurationMinutes"
            placeholder="Slot Duration (minutes)"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            name="availabilityStartDay"
            placeholder="Start Day (1 for Monday)"
            onChange={handleChange}
          />
          <input
            name="availabilityEndDay"
            placeholder="End Day (5 for Friday)"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            name="breakSlots"
            placeholder="Break Slots (e.g. 1300,1400)"
            onChange={handleChange}
          />
          <input
            type="file"
            name="profilepic"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          Register
        </button>
        <div className="switch">
          <>
            Already have account? <Link to="/advisor/login">Login</Link>
          </>
        </div>
      </form>
    </div>
  );
};

export default RegisterAdvisor;
