import React, { useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import "./SigninForm.scss";
import { sendDataToapi } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    profilepic: null,
    contactPhone: "",
    contactEmail: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZipCode: "",
    addressCountry: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    bloodGroup: "",
    languagesSpoken: "",
    learningMaterial: "",
    domain: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const data = new FormData();

    // Primitive values
    data.append("fullname", formData.fullname);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("dob", formData.dob);
    data.append("gender", formData.gender);
    if (formData.profilepic) {
      data.append("profilepic", formData.profilepic);
    }

    // Nested objects
    data.append("contact[phone]", formData.contactPhone);
    data.append("contact[email]", formData.contactEmail);

    data.append("address[street]", formData.addressStreet);
    data.append("address[city]", formData.addressCity);
    data.append("address[state]", formData.addressState);
    data.append("address[zipCode]", formData.addressZipCode);
    data.append("address[country]", formData.addressCountry);

    data.append("emergencyContact[name]", formData.emergencyName);
    data.append("emergencyContact[relation]", formData.emergencyRelation);
    data.append("emergencyContact[phone]", formData.emergencyPhone);

    // Arrays (convert comma-separated string to array)
    JSON.parse(
      JSON.stringify(
        formData.languagesSpoken.split(",").map((lang) => lang.trim())
      )
    ).forEach((lang, i) => data.append(`languagesSpoken[${i}]`, lang));

    JSON.parse(
      JSON.stringify(
        formData.learningMaterial.split(",").map((id) => parseInt(id))
      )
    ).forEach((id, i) => data.append(`learningMaterial[${i}]`, id));

    JSON.parse(
      JSON.stringify(formData.domain.split(",").map((d) => d.trim()))
    ).forEach((d, i) => data.append(`domain[${i}]`, d));

    sendDataToapi("/users/registerUser", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res);
        window.location.href = "/category";
      })
      .catch((err) => {
        setMsg("Something wnet wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="register-container">
      {loading && <Loader />}
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>User Registration</h2>
        {msg && <p className="message">{msg}</p>}

        <div className="form-row">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input type="date" name="dob" onChange={handleChange} />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            onChange={handleChange}
          />
          <input
            type="text"
            name="bloodGroup"
            placeholder="Blood Group"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="contactPhone"
            placeholder="Phone"
            onChange={handleChange}
          />
          <input
            type="text"
            name="contactEmail"
            placeholder="Alternate Email"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="addressStreet"
            placeholder="Street"
            onChange={handleChange}
          />
          <input
            type="text"
            name="addressCity"
            placeholder="City"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="addressState"
            placeholder="State"
            onChange={handleChange}
          />
          <input
            type="text"
            name="addressZipCode"
            placeholder="Zip Code"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="addressCountry"
            placeholder="Country"
            onChange={handleChange}
          />
          <input
            type="text"
            name="languagesSpoken"
            placeholder="Languages (comma separated)"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="learningMaterial"
            placeholder="Learning Material IDs (e.g. 1,2)"
            onChange={handleChange}
          />
          <input
            type="text"
            name="domain"
            placeholder="Domain (comma separated)"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="emergencyName"
            placeholder="Emergency Contact Name"
            onChange={handleChange}
          />
          <input
            type="text"
            name="emergencyRelation"
            placeholder="Relation"
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="emergencyPhone"
            placeholder="Emergency Phone"
            onChange={handleChange}
          />
          <input
            type="file"
            name="profilepic"
            onChange={handleChange}
            accept="image/*"
          />
        </div>

        <button type="submit" disabled={loading}>
          Register
        </button>
        <div className="switch">
          <>
            Already have account? <Link to="/user/login">Login</Link>
          </>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
