import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const initialDonations = [];

function DeliveryDashboardPage() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState(initialDonations);
  const [view, setView] = useState("acceptedDonations");
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch donations from the server
  useEffect(() => {
    const fetchDonations = async () => {
      const email = localStorage.getItem("deliveryEmail"); 
      const district = localStorage.getItem("deliveryDistrict");
      if (!district|| !email) {
        alert("Please log in again.");
        navigate("/delivery-login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/donations?district=${district}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error:", errorData);
          alert(`Error fetching donations: ${errorData.message || "Please try again."}`);
          return;
        }
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error: An error occurred while fetching donations. Please try again.");
      }
    };

    fetchDonations();
  }, [navigate]);

  // Handle Accept Delivery
  const handleAcceptDelivery = async (donationId) => {
    const requestBody = { status: "Delivered" };  // This should be sent as "Delivered"
  
    console.log("Sending request with body:", requestBody);  // Log request body before sending
  
    try {
      const response = await fetch(`http://localhost:5000/api/donations/${donationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),  // Make sure status is set to "Delivered"
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Donation marked as delivered!");
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation._id === donationId
              ? { ...donation, status: "Delivered" }
              : donation
          )
        );
      } else {
        alert(data.message || "Failed to update the donation status.");
      }
    } catch (error) {
      console.error("Error updating donation status:", error);
      alert("An error occurred while updating the donation status. Please try again.");
    }
  };
  
  // Toggle navigation menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle view change
  const handleNavigation = (viewName) => {
    setView(viewName);
    setMenuOpen(false);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          Food <span style={{ color: "green" }}>Donate</span>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>
        {menuOpen && (
          <nav className="menu">
            <ul>
              <li onClick={() => handleNavigation("acceptedDonations")}>
                Accepted orders
              </li>
              <li onClick={() => handleNavigation("myDonations")}>orders</li>
              <li onClick={() => navigate("/")}>Logout</li>
            </ul>
          </nav>
        )}
      </header>

      <h1>Welcome, Delivery Personnel</h1>

      {/* Accepted Donations View */}
      {view === "acceptedDonations" && (
        <div>
          <h3>Accepted Donations</h3>
          {donations.filter((donation) => donation.status === "Delivered").length === 0 ? (
            <p>No accepted donations available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone No.</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Address</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {donations
                  .filter((donation) => donation.status === "Delivered")
                  .map((donation) => (
                    <tr key={donation._id}>
                      <td>{donation.name}</td>
                      <td>{donation.phone}</td>
                      <td>{donation.description}</td>
                      <td>{donation.quantity}</td>
                      <td>{donation.address}</td>
                      <td>{donation.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* My Donations View */}
      {view === "myDonations" && (
        <div>
          <h3>My Donations</h3>
          {donations.length === 0 ? (
            <p>No donations available at the moment.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone No.</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Address</th>
                  <th>Delivery Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.name}</td>
                    <td>{donation.phone}</td>
                    <td>{donation.description}</td>
                    <td>{donation.quantity}</td>
                    <td>{donation.address}</td>
                    <td>{donation.status || "Pending"}</td>
                    <td>
                      {donation.deliveryStatus === "Pending" || !donation.deliveryStatus ? (
                        <button onClick={() => handleAcceptDelivery(donation._id)}>
                          Deliver
                        </button>
                      ) : (
                        <span>{donation.deliveryStatus}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default DeliveryDashboardPage;
