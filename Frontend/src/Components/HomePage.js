import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="overlay">
        <h1>Welcome to <span className="highlight">Food Donate</span></h1>
        <h3>Login as</h3>
        <div className="buttons">
          <button onClick={() => navigate("/login")}>User</button>
          <button onClick={() => navigate("/admin-login")}>Admin</button>
          <button onClick={() => navigate("/delivery-login")}>Delivery</button>
        </div>
        <p className="food-donation-info">
          Food donation is a wonderful way to help those in need. By sharing excess food, we can reduce food waste and provide nutritious meals to those who are struggling. Join us in making a difference in the lives of others.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
