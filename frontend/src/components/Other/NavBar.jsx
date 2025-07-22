import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdHome,
  MdNotifications,
  MdMessage,
} from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // ✅ Fixed import with curly braces
import { useQuery, gql } from "@apollo/client";
import logo from "../../assets/logo.png";
import ThemeToggle from "../ThemeToggle";
import LogoutButton from "./Logout";

const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id username role
    }
  }
`;

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (token) {
      try {
        const { id, role } = jwtDecode(token);
        setUserId(id);
        setUserRole(role);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, [token]);

  const { data, loading } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId,
  });
  const user = data?.getUser || {};

  const goDashboard = () => {
    switch (userRole) {
      case "Project_Manager": 
        navigate("/projectDashboard");
        break;
      case "Team_Lead":      
        navigate("/teamleaddashboard");
        break;
      case "Team_Member":    
        navigate("/teammemberdashboard");
        break;
      default:               
        navigate("/");
        break;
    }
  };

  // close mobile menu on resize
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = () => setMobileOpen(false);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [mobileOpen]);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-bg-primary-light dark:bg-bg-primary-dark shadow transition-colors">
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {token ? (
            <>
              {/* Notifications */}
              <button className="p-2 rounded-md hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition">
                <MdNotifications size={20} className="text-txt-primary-light dark:text-txt-primary-dark" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Messages - Hide for Project Manager */}
              {userRole !== "Project_Manager" && (
                <button
                  className="p-2 rounded-md hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition"
                  onClick={() => navigate("/chat")}
                >
                  <MdMessage size={20} className="text-txt-primary-light dark:text-txt-primary-dark" />
                </button>
              )}

              {/* Dashboard Button */}
              <button
                className="flex items-center p-2 bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-md transition"
                onClick={goDashboard}
              >
                <MdHome size={20} />
              </button>

              {/* User Profile */}
              <div className="relative" ref={dropdownRef}>
                <button className="flex items-center p-2 space-x-2 rounded-md hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition">
                  <div className="w-8 h-8 bg-brand-primary-100 text-brand-primary-600 rounded-full flex items-center justify-center">
                    {loading ? "…" : (user.username?.charAt(0).toUpperCase() || "U")}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">
                      {loading ? "Loading..." : user.username || "User"}
                    </p>
                    <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                      {loading ? "..." : user.role || "Member"}
                    </p>
                  </div>
                </button>
              </div>

              <LogoutButton />
              <ThemeToggle />
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 text-txt-primary-light dark:text-txt-primary-dark hover:text-brand-primary-500 transition"
              >
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
              <ThemeToggle />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button 
            onClick={() => setMobileOpen(prev => !prev)} 
            className="p-2 text-txt-primary-light dark:text-txt-primary-dark focus:outline-none"
          >
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-primary-light dark:bg-bg-primary-dark border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex flex-col space-y-2 p-4">
            {token ? (
              <>
                <button 
                  onClick={goDashboard} 
                  className="text-left py-2 text-txt-primary-light dark:text-txt-primary-dark hover:text-brand-primary-500 transition"
                >
                  Dashboard
                </button>
                {userRole !== "Project_Manager" && (
                  <button 
                    onClick={() => navigate("/chat")} 
                    className="text-left py-2 text-txt-primary-light dark:text-txt-primary-dark hover:text-brand-primary-500 transition"
                  >
                    Chat
                  </button>
                )}
                <div className="pt-2">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="py-2 text-txt-primary-light dark:text-txt-primary-dark hover:text-brand-primary-500 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="py-2 text-brand-primary-500 hover:text-brand-primary-600 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
