import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function DeliveryLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login data to the backend
      const response = await fetch("http://localhost:5000/api/delivery/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("deliveryEmail", email);
        localStorage.setItem("deliveryDistrict", data.district); // Assuming the response includes the district
        alert(data.message || "Logged in successfully as Delivery!");
        navigate("/delivery-dashboard"); // Redirect to Delivery Dashboard on success
      } else {
        alert(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Delivery Login</h1>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={() => navigate("/delivery-register")}>Register here</button>
      </p>
    </div>
  );
}

export default DeliveryLoginPage;
