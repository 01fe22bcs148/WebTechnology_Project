import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function DonationPage() {
  const navigate = useNavigate(); // Hook to navigate to another page
  const [restaurantName, setRestaurantName] = useState(""); // State to store the restaurant name

  // Fetch restaurant name from localStorage after login
  useEffect(() => {
    const name = localStorage.getItem("restaurantName");
    if (name) {
      setRestaurantName(name); // Set restaurant name to state after fetching from localStorage
    } else {
      alert("Restaurant name is not set. Please log in first.");
      navigate("/login"); // Redirect to login page if no restaurant name found
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    foodType: "", // Will store the selected food type
    mealType: "", // Veg or Non-Veg
    foodName: "", // Name of the food
    quantity: "",
    name: "",
    phone: "",
    district: "",
    address: "",
    daysGood: "", // Number of days food is good
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
    const donationData = { ...formData, restaurantName, date: currentDate };

    try {
      const response = await fetch("http://localhost:5000/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });

      const data = await response.json();
      console.log("Response Data:", data);
      if (response.ok) {
        alert(data.message || "Thank you for your donation!");
        navigate("/donation-confirmation");
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error during donation submission:", error);
      alert("An error occurred while processing your donation. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Donate Food</h1>

      {/* Restaurant Name - Automatically fetched */}
      <p>Restaurant Name: {restaurantName}</p>

      <form onSubmit={handleSubmit}>
        {/* Food Type Selection (Dropdown) */}
        <label>
          Select food type:
          <select
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            required
          >
            <option value="">Select Food Type</option>
            <option value="Raw Food">Raw Food</option>
            <option value="Cooked Food">Cooked Food</option>
            <option value="Packed Food">Packed Food</option>
          </select>
        </label>

        {/* Meal Type Selection (Dropdown) */}
        <label>
          Meal Type:
          <select
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
            required
          >
            <option value="">Select Meal Type</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </label>

        {/* Food Name Input */}
        <label>
          Food Name:
          <input
            type="text"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            required
          />
        </label>

        {/* Quantity Input */}
        <label>
          Quantity (kg/person):
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </label>

        {/* Days Food is Good */}
        <label>
          Days Food is Good:
          <input
            type="number"
            name="daysGood"
            value={formData.daysGood}
            onChange={handleChange}
            required
          />
        </label>

        <h3>Contact Details</h3>
        {/* Name Input */}
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        {/* Phone Input */}
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        {/* District Selection */}
        <label>
          District:
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          >
            <option value="">Select District</option>
            <option value="Madurai">Madurai</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>
        </label>
        {/* Address Textarea */}
        <label>
          Address:
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DonationPage;
