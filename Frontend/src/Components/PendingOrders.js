import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./styles.css";

function PendingOrders() {
  const [pendingOrders, setPendingOrders] = useState([]); // Corrected variable name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pending-orders?status=Pending"); // API endpoint
        const data = await response.json();
        setPendingOrders(data);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingOrders();
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
        <h1>Pending Orders</h1>
        {loading ? (
          <p>Loading orders...</p>
        ) : pendingOrders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Food</th>
                <th>Address</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order._id}> {/* Assuming order has _id */}
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.food}</td>
                  <td>{order.address}</td>
                  <td>{order.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending orders available.</p>
        )}
      </div>
    </div>
  );
}

export default PendingOrders;
