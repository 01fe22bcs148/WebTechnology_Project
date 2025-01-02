import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

// Mock data for food orders
const foodOrders = [
  {
    id: 1,
    food: "Rice",
    quantity: "10 kg",
    donor: "John Doe",
    address: "123 Street, Madurai",
  },
  {
    id: 2,
    food: "Bread",
    quantity: "5 kg",
    donor: "Jane Smith",
    address: "789 Boulevard, Coimbatore",
  },
];

function FoodOrderListPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Food Order Lists</h1>
      <table>
        <thead>
          <tr>
            <th>Food</th>
            <th>Quantity</th>
            <th>Donor</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {foodOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.food}</td>
              <td>{order.quantity}</td>
              <td>{order.donor}</td>
              <td>{order.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate("/ngo-dashboard")}>Back to Dashboard</button>
    </div>
  );
}

export default FoodOrderListPage;
