import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import "./assets/style.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ConfirmationModal from "./components/ConfirmationModal";

import Home from "./pages/Home";
import TakeSurvey from "./pages/TakeSurvey";
import Submissions from "./pages/Submissions";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import EnterEmail from "./pages/EnterEmail";
import ForgotPass from "./pages/ForgotPass";
import ResetPassword from "./pages/ResetPass";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("isAuthenticated") === "true");
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("isAdmin") === "true");
  const [showLogin, setShowLogin] = useState(() => localStorage.getItem("showLogin") === "true" || true);
  const [forgotStep, setForgotStep] = useState(() => localStorage.getItem("forgotStep") || null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => { localStorage.setItem("showLogin", showLogin ? "true" : "false"); }, [showLogin]);
  useEffect(() => { localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false"); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem("isAdmin", isAdmin ? "true" : "false"); }, [isAdmin]);
  useEffect(() => {
    if (forgotStep) localStorage.setItem("forgotStep", forgotStep);
    else localStorage.removeItem("forgotStep");
  }, [forgotStep]);

  const navigate = useNavigate();

  const handleLoginOrSignup = (email) => {
    toast.success("Logging in...");
    const admin = email.toLowerCase() === "admin@gmail.com";
    setIsAuthenticated(true);
    setIsAdmin(admin);
    localStorage.setItem("isAdmin", admin ? "true" : "false");
    localStorage.removeItem("forgotStep");
    
    if (admin) navigate('/admin/overview');
    else navigate('/');
  };

  const handleLogout = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const confirmLogout = useCallback(() => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setShowLogoutConfirm(false);
    localStorage.clear();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {!isAuthenticated ? (
        <AuthScreens
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          forgotStep={forgotStep}
          setForgotStep={setForgotStep}
          handleLoginOrSignup={handleLoginOrSignup}
        />
      ) : isAdmin ? (
        <AdminDashboard handleLogout={handleLogout} />
      ) : (
        <Dashboard handleLogout={handleLogout} confirmLogout={confirmLogout} isAuthenticated={isAuthenticated} />
      )}

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        message="Are you sure you want to logout?"
      />
    </>
  );
}

function AuthScreens({ showLogin, setShowLogin, forgotStep, setForgotStep, handleLoginOrSignup }) {
  if (!forgotStep) {
    return showLogin ? (
      <Login
        onLogin={(email) => handleLoginOrSignup(email)}
        switchToSignup={() => setShowLogin(false)}
        onForgotPass={() => setForgotStep("email")}
      />
    ) : (
      <Signup
        onSignup={() => handleLoginOrSignup("user@example.com")}
        switchToLogin={() => setShowLogin(true)}
      />
    );
  } else if (forgotStep === "email") {
    return <EnterEmail goBack={() => setForgotStep(null)} goNext={() => setForgotStep("code")} />;
  } else if (forgotStep === "code") {
    return <ForgotPass goBack={() => setForgotStep("email")} goToReset={() => setForgotStep("reset")} />;
  } else {
    return <ResetPassword goBack={() => setForgotStep(null)} />;
  }
}

// --- USER DASHBOARD ---
function Dashboard({ handleLogout, confirmLogout, isAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <>
      <ScrollToTop />
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/take-survey" element={<TakeSurvey />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}
