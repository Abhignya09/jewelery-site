import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">💍 Jewel AI</div>
      <div className="sidebar-user">Hi, {user?.name}</div>
      <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? "active" : "")}>
        Dashboard
      </NavLink>
      <NavLink to="/dashboard/design" className={({ isActive }) => (isActive ? "active" : "")}>
        Design Studio
      </NavLink>
      <NavLink to="/dashboard/history" className={({ isActive }) => (isActive ? "active" : "")}>
        History
      </NavLink>
      <NavLink to="/dashboard/about" className={({ isActive }) => (isActive ? "active" : "")}>
        About
      </NavLink>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
