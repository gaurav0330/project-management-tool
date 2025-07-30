import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdHome, MdNotifications } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";
import { useQuery, gql } from "@apollo/client";
import logo from "../../assets/logo.png";
import ThemeToggle from "../ThemeToggle";
import LogoutButton from "./Logout";
import { Edit2Icon } from "lucide-react";
import EditProfile from "../authComponent/EditProfile";

// Updated query as per your latest request
const GET_PROFILE = gql`
  query GetProfile($userId: ID!) {
    getProfile(userId: $userId) {
      id
      availability
      workload
      GithubUsername
      createdAt
      user {
        id
        username
        email
        role
      }
      skills {
        name
        proficiency
      }
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // EditProfile modal state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Decode token to get userId and role
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

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch profile data (includes user data embedded)
  const { data: profileQueryData, loading: profileLoading, refetch: refetchProfile } = useQuery(GET_PROFILE, {
    variables: { userId },
    skip: !userId,
    onCompleted: (data) => {
      if (data?.getProfile) setProfileData(data.getProfile);
    },
  });

  // Navigation depending on user role
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

  // Close mobile menu on resize
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = () => setMobileOpen(false);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [mobileOpen]);

  // Open EditProfile modal
  const handleEditProfileClick = () => {
    setDropdownOpen(false);
    setIsEditProfileOpen(true);
  };

  // Update profileData state after edit
  const handleProfileUpdated = (updatedProfile) => {
    setProfileData(updatedProfile);
    
    // Optionally refetch data here: refetchProfile();
  };

  // Extract user info from profileData.user if available
  const user = profileData?.user || {};

  return (
    <>
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
                <button className="p-2 rounded-md hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition relative" aria-label="Notifications">
                  <MdNotifications size={20} className="text-txt-primary-light dark:text-txt-primary-dark" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Dashboard Button */}
                <button
                  className="flex items-center p-2 bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-md transition"
                  onClick={goDashboard}
                  aria-label="Go to dashboard"
                >
                  <MdHome size={20} />
                </button>

                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  {/* User Info Button */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center p-2 space-x-2 rounded-md hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    aria-controls="user-menu"
                  >
                    <div className="w-8 h-8 bg-brand-primary-100 text-brand-primary-600 rounded-full flex items-center justify-center font-semibold select-none">
                      {profileLoading ? "…" : (user.username?.charAt(0).toUpperCase() || "U")}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">
                        {profileLoading ? "Loading..." : user.username || "User"}
                      </p>
                      <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                        {profileLoading ? "..." : user.role || "Member"}
                      </p>
                    </div>
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div
                      id="user-menu"
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700"
                      role="menu"
                      aria-label="User menu"
                    >
                      <button
                        onClick={handleEditProfileClick}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        role="menuitem"
                      >
                        <Edit2Icon className="w-4 h-4" aria-hidden="true" />
                        Edit Profile
                      </button>
                    </div>
                  )}
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
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 text-txt-primary-light dark:text-txt-primary-dark focus:outline-none"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
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

      {/* Edit Profile Modal */}
      {isEditProfileOpen && userId && (
        <EditProfile
          userId={userId}
          initialProfile={profileData}
          onClose={() => setIsEditProfileOpen(false)}
          onUpdated={handleProfileUpdated}
        />
      )}
    </>
  );
}
