import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminType, setAdminType] = useState("admin");
  const [loading, setLoading] = useState(false); // Loading state for the login process

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const ngoDistrict = localStorage.getItem("ngoDistrict"); // Get district from localStorage
    const loginData = { email, password, adminType, district: ngoDistrict }; // Add district to the request

    try {
      const response = await fetch("http://localhost:5000/api/login/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData), // Send district along with the other fields
      });

      const data = await response.json();

      if (response.ok) {
        if (adminType === "ngo" && data.district) {
          localStorage.setItem("ngoDistrict", data.district);
          localStorage.setItem("ngoEmail", email); 
          console.log("Stored NGO District:", data.district); // Store the NGO district
        } else {
          console.error("District not found in response:", data);
        }

        alert(data.message); // Show success message
        if (adminType === "admin") {
          navigate("/admin-dashboard");
        } else if (adminType === "ngo") {
          navigate("/ngo-dashboard");
        }
      } else {
        alert(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container">
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
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
          <label>Admin Type:</label>
          <select
            value={adminType}
            onChange={(e) => setAdminType(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="ngo">NGO</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={() => navigate("/admin-register")}>Register Now</button>
      </p>
    </div>
  );
}

export default AdminLoginPage;
