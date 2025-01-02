import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

// Mock data for donation history
const donationHistory = [
  {
    id: 1,
    food: "Rice",
    quantity: "10 kg",
    dateTime: "2024-12-22 14:00",
    address: "123 Street, Madurai",
  },
  {
    id: 2,
    food: "Bread",
    quantity: "5 kg",
    dateTime: "2024-12-23 16:30",
    address: "789 Boulevard, Coimbatore",
  },
];

function NGOHistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Donation History</h1>
      <table>
        <thead>
          <tr>
            <th>Food</th>
            <th>Quantity</th>
            <th>Date/Time</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {donationHistory.map((donation) => (
            <tr key={donation.id}>
              <td>{donation.food}</td>
              <td>{donation.quantity}</td>
              <td>{donation.dateTime}</td>
              <td>{donation.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/ngo-dashboard")}>Back to Dashboard</button>
    </div>
  );
}

export default NGOHistoryPage;
