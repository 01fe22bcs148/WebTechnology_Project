import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function AcceptedOrders() {
  const [acceptedDonations, setAcceptedDonations] = useState([]); // Corrected variable name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcceptedDonations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/accepted22?status=Accepted"); // API endpoint
        const data = await response.json();
        setAcceptedDonations(data);
      } catch (error) {
        console.error("Error fetching accepted donations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAcceptedDonations();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Food Donate</h2>
        <ul>
          <li><Link to="/admin-dashboard">Home</Link></li>
          <li><Link to="/delivered-orders">Delivered Orders</Link></li>
          <li><Link to="/accepted-orders">Accepted Orders</Link></li>
          <li><Link to="/pending-orders">Pending Orders</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </div>
      <div className="content">
        <h1>Accepted Donations</h1>
        {loading ? (
          <p>Loading donations...</p>
        ) : acceptedDonations.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Food</th>
                <th>Category</th>
                <th>Phone No.</th>
                <th>Date/Time</th>
                <th>Address</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {acceptedDonations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.name}</td>
                  <td>{donation.foodName}</td>
                  <td>{donation.foodType}</td>
                  <td>{donation.phone}</td>
                  <td>{new Date(donation.date).toLocaleString()}</td>
                  <td>{donation.address}</td>
                  <td>{donation.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No accepted donations available.</p>
        )}
      </div>
    </div>
  );
}

export default AcceptedOrders;
