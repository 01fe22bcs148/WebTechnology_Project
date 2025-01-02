import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function DonationConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Donation Confirmation</h1>
      <p>Your donation will be immediately collected and sent to needy people.</p>
      <button onClick={() => navigate("/")}>Return to Home Page</button>
    </div>
  );
}

export default DonationConfirmationPage;
