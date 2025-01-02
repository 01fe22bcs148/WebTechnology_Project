import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DonationPage from "./components/DonationPage";
import DonationConfirmationPage from "./components/DonationConfirmationPage";
import DeliveryLoginPage from "./components/DeliveryLoginPage"; // Delivery Login
import DeliveryRegisterPage from "./components/DeliveryRegisterPage";
import DeliveryDashboardPage from "./components/DeliveryDashboardPage"; 
import TookOrdersPage from "./components/TookOrdersPage";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminRegisterPage from "./components/AdminRegisterPage";
import AdminDashboard from "./components/AdminDashboard"; // You will need to create this page
import AnalyticsPage from "./components/AnalyticsPage"; // Create this component for analytics page
import LocatedOrdersPage from "./components/LocatedOrdersPage"; // Create this component for located orders page
import FeedbackPage from "./components/FeedbackPage"; // Create this component for feedback page
import NGODashboardPage from "./components/NGODashboardPage";
import NGOHistoryPage from "./components/NGOHistoryPage";
import FoodOrderListPage from "./components/FoodOrderListPage";
import DonatesPage from "./components/DonatesPage";
import DeliveredOrders from "./components/DeliveredOrders";
import AcceptedOrders from "./components/AcceptedOrders";
import PendingOrders from "./components/PendingOrders";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/donation-confirmation" element={<DonationConfirmationPage />} /> {/* New Route */}
        <Route path="/delivery-login" element={<DeliveryLoginPage />} /> {/* Delivery Login */}
        <Route path="/delivery-register" element={<DeliveryRegisterPage />} /> {/* Delivery Register */}
        <Route path="/donation" element={<DonationPage />} />
        <Route path="/delivery-dashboard" element={<DeliveryDashboardPage />} /> {/* Delivery Dashboard */}
        <Route path="/took-orders" element={<TookOrdersPage />} /> {/* Took Orders Page */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-register" element={<AdminRegisterPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/located-orders" element={<LocatedOrdersPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/ngo-dashboard" element={<NGODashboardPage />} />
        <Route path="/ngo-history" element={<NGOHistoryPage />} />
        <Route path="/food-order-list" element={<FoodOrderListPage />} />
        <Route path="/donates" element={<DonatesPage />} />
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/delivered-orders" element={<DeliveredOrders />} />
        <Route path="/accepted-orders" element={<AcceptedOrders />} />
        <Route path="/pending-orders" element={<PendingOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
