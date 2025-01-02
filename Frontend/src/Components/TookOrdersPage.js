import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function TookOrdersPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Orders You Have Taken</h1>
      {/* Content is empty, only headline */}
      <button onClick={() => navigate("/delivery-dashboard")}>Back to Dashboard</button>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

export default TookOrdersPage;
