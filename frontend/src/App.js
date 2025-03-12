import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManageServices from "./pages/ManageServices";
import ManageStylists from './pages/ManageStylists';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FullServices from './pages/FullServices';
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles.css";
import Dashboard from "./pages/Dashboard";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/dashboard/services" element={<FullServices/>} />
          <Route path="/dashboard/services/:id" element={<ServiceDetailsPage/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manageservices" element={<ManageServices />} />
          <Route path="/admin/managestylists" element={<ManageStylists/>} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-failed" element={<div>Payment Failed</div>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
