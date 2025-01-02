import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function DeliveryRegisterPage() {
  const navigate = useNavigate();
  
  // State for form data, including district and address
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    district: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    try {
      // Send formData to the backend
      const response = await fetch("http://localhost:5000/api/delivery/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          district: formData.district,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Registration successful!");
        navigate("/delivery-login"); // Redirect to Delivery Login after successful registration
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred while registering. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Delivery Registration</h1>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* District Selection */}
        <div className="input-group">
          <label>District:</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          >
            <option value="">Select District</option>
            <option value="Madurai">Madurai</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>
        </div>

        {/* Address Textarea */}
        <div className="input-group">
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{" "}
        <button onClick={() => navigate("/delivery-login")}>Login here</button>
      </p>
    </div>
  );
}

export default DeliveryRegisterPage;
