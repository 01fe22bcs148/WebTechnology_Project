import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function DonatesPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Retrieve the NGO district from localStorage
  const ngoDistrict = localStorage.getItem("ngoDistrict");

  useEffect(() => {
    if (!ngoDistrict) {
      alert("Please login first.");
      navigate("/admin-login"); // Redirect to login page if no district found in localStorage
      return;
    }

    // Fetch donations based on the NGO's district
    const fetchDonations = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/donations?district=${ngoDistrict}`
        );
        const data = await response.json();
        if (response.ok) {
          setDonations(data); // Update the state with the latest donations
        } else {
          console.error(data.message);
          setDonations([]); // Handle empty result set
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [ngoDistrict, navigate]);

  // Handle the acceptance of a donation
  const handleAcceptDonation = async (donationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/donations/accept/${donationId}`,
        {
          method: "PATCH",
        }
      );
      const data = await response.json();
  
      if (response.ok) {
        // Handle response when donation is already accepted
        if (data.message === "Donation already accepted.") {
          alert("This donation has already been accepted.");
          return; // Do nothing if donation is already accepted
        }
  
        // Update the donation status directly in state to reflect it immediately
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation._id === donationId
              ? { ...donation, status: "Accepted" } // Update the status locally
              : donation
          )
        );
        alert("Donation accepted successfully!");
      } else {
        alert(data.message || "Failed to accept donation.");
      }
    } catch (error) {
      console.error("Error accepting donation:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  

  return (
    <div className="donates-container">
      <h1>Food Donations</h1>
      {loading ? (
        <p>Loading donations...</p>
      ) : donations.length > 0 ? (
        <table className="donates-table">
          <thead>
            <tr>
              <th>Food Type</th>
              <th>Meal Type</th>
              <th>Food Name</th>
              <th>Quantity</th>
              <th>Donor Name</th>
              <th>Phone</th>
              <th>District</th>
              <th>Address</th>
              <th>Days Good</th>
              <th>Restaurant</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th> {/* Add column for actions */}
            </tr>
          </thead>
          <tbody>
          {donations
              .filter((donation) => donation.status !== "Accepted" && donation.status !== "Delivered") // Filter out accepted or delivered donations
              .map((donation) => (
              <tr key={donation._id}>
                <td>{donation.foodType}</td>
                <td>{donation.mealType}</td>
                <td>{donation.foodName}</td>
                <td>{donation.quantity}</td>
                <td>{donation.name}</td>
                <td>{donation.phone}</td>
                <td>{donation.district}</td>
                <td>{donation.address}</td>
                <td>{donation.daysGood}</td>
                <td>{donation.restaurantName}</td>
                <td>{new Date(donation.date).toLocaleString()}</td>
                <td>{donation.status || "Pending"}</td>
                <td>
                  {donation.status !== "Accepted" && (
                    <button
                    onClick={() => handleAcceptDonation(donation._id)}
                      className="accept-button"
                    >
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No donations available for your district.</p>
      )}
    </div>
  );
}

export default DonatesPage;
