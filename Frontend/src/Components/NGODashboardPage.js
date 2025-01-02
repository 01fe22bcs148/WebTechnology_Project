import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function NGODashboardPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const ngoDistrict = localStorage.getItem("ngoDistrict");
  const ngoEmail = localStorage.getItem("ngoEmail");

  useEffect(() => {
    if (!ngoDistrict || !ngoEmail) {
      setError("No district or email found. Please log in again.");
      navigate("/login");
      return;
    }

    const fetchAcceptedDonations = async () => {
      setLoading(true);
      setError(""); // Reset error state

      try {
        const apiUrl = `http://localhost:5000/api/donations11?district=${ngoDistrict}`;
        console.log("Fetching donations from URL:", apiUrl); // Log URL for debugging

        const response = await fetch(apiUrl);
        console.log("Response Status:", response.status); // Log response status

        // Check for a non-OK response status
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response data:", errorData); // Log error details
          setError(errorData.message || "Failed to fetch donations");
          return;
        }

        const data = await response.json();
        console.log("Fetched donations:", data); // Log data for debugging

        // Check if the response data is an array before setting it
        if (Array.isArray(data)) {
          setDonations(data);
        } else {
          setError("Invalid data format received from the server.");
        }
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("An error occurred while fetching donations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedDonations();
  }, [ngoDistrict, ngoEmail, navigate]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>NGO Dashboard</h2>
        <ul className="menu">
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/donates")}>Donates</li>
          <li onClick={() => navigate("/")}>Logout</li>
        </ul>

        <div className="logout-section">
          <button
            onClick={() => {
              localStorage.clear(); // Clear user session data
              navigate("/"); // Navigate to the login page
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="content">
        <h1>Welcome to the NGO Dashboard</h1>
        <p>Select an option from the menu to manage donations, feedback, and more.</p>

        <section className="donations-section">
          <h2>Your Accepted Donations</h2>

          {loading && <p>Loading donations...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && donations.length === 0 && (
            <p>No accepted donations found for your district.</p>
          )}
          {!loading && !error && donations.length > 0 && (
            <table className="donations-table">
              <thead>
                <tr>
                  <th style={{ color: "black" }}>Food</th>
                  <th style={{ color: "black" }}>Quantity</th>
                  <th style={{ color: "black" }}>Status</th>
                  <th style={{ color: "black" }}>Date</th>
                  <th style={{ color: "black" }}>Pickup Address</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.foodName}</td>
                    <td>{donation.quantity}</td>
                    <td>{donation.status || "N/A"}</td>
                    <td>
                      {donation.date
                        ? new Date(donation.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{donation.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default NGODashboardPage;
