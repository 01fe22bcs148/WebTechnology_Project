import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./styles.css";

function AdminDashboard() {
  const [dashboardCounts, setDashboardCounts] = useState({
    totalUsers: 0,
    feedbacks: 0,
    totalDonations: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardResponse = await fetch("http://localhost:5000/api/dashboard-counts");
        const dashboardData = await dashboardResponse.json();
        setDashboardCounts(dashboardData);

        const donationsResponse = await fetch("http://localhost:5000/api/recent-donations");
        const donationsData = await donationsResponse.json();
        setRecentDonations(donationsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
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
        <h1>Food Donate</h1>
        <h2>Dashboard</h2>
        <div className="dashboard-summary">
          <div className="summary-item">
            <h3>Total ngos</h3>
            <p>{dashboardCounts.totalUsers}</p>
          </div>
          <div className="summary-item">
            <h3>Total restaurants</h3>
            <p>{dashboardCounts.feedbacks}</p>
          </div>
          <div className="summary-item">
            <h3>Total Donations</h3>
            <p>{dashboardCounts.totalDonations}</p>
          </div>
        </div>

        <h3>Recent Donations</h3>
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
            {recentDonations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.name}</td>
                <td>{donation.food}</td>
                <td>{donation.category}</td>
                <td>{donation.phone}</td>
                <td>{donation.date}</td>
                <td>{donation.address}</td>
                <td>{donation.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
