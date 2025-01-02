import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function AdminRegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Madurai");
  const [userType, setUserType] = useState("Admin"); // Add userType for Admin or NGO

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const userData = {
      name,
      email,
      password,
      address,
      district,
      userType,
    };
  
    try {
      // Log the user data to ensure it's correct
      console.log("Sending data to backend:", userData);
  
      // Send registration data to the backend
      const response = await fetch("http://localhost:5000/api/register/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      
  
      // Log the response status and body
      console.log("Response status:", response.status);
  
      // If the backend returns a JSON object, log the body
      const data = await response.json();
      console.log("Response body:", data);
  
      if (response.ok) {
        // On successful registration, redirect to login page
        alert(data.message || "Registration successful!");
        navigate("/admin-login");
      } else {
        // Handle registration errors
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="container">
      <h1>Admin Register</h1>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>District:</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="Madurai">Madurai</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>
        </div>
        <div className="input-group">
          <label>User Type:</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="Admin">Admin</option>
            <option value="NGO">NGO</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already a member?{" "}
        <button onClick={() => navigate("/admin-login")}>Login Now</button>
      </p>
    </div>
  );
}

export default AdminRegisterPage;
