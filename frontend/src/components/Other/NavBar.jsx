import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdHome, MdNotifications } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import {jwtDecode} from "jwt-decode"; // correct import without braces
import { useQuery, gql } from "@apollo/client";
import logo from "../../assets/logo.png";
import ThemeToggle from "../ThemeToggle";
import LogoutButton from "./Logout";
import { Edit2Icon } from "lucide-react";
import EditProfile from "../authComponent/EditProfile";
import { useWindowSize } from "../../hooks/useWindowSize"; // adjust import path as necessary


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

const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      email
      role
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

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const { width } = useWindowSize();
  const isMobile = width < 768;  // Tailwind md breakpoint

  // Decode token for userId and role
  useEffect(() => {
    if (token) {
      try {
        const { id, role } = jwtDecode(token);
        setUserId(id);
        setUserRole(role);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    } else {
      setUserId(null);
      setUserRole(null);
    }
  }, [token]);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apollo queries
  const { data: userQueryData, loading: userLoading } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId,
  });

  const { data: profileQueryData, loading: profileLoading, refetch: refetchProfile } = useQuery(GET_PROFILE, {
    variables: { userId },
    skip: !userId,
    onCompleted: (data) => {
      if (data?.getProfile) setProfileData(data.getProfile);
    },
  });

  // Navigate based on role
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

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = () => setMobileOpen(false);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [mobileOpen]);

  const handleEditProfileClick = () => {
    setDropdownOpen(false);
    setIsEditProfileOpen(true);
  };

  const handleProfileUpdated = (updatedProfile) => {
    setProfileData(updatedProfile);
  };

  const user = userQueryData?.getUser || {};

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-bg-primary-light dark:bg-bg-primary-dark shadow transition-colors">
        <div className="section-container flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
            aria-label="Navigate to homepage"
          >
            <img src={logo} alt="Logo" className="h-8" />
          </div>

          {/* Desktop menu */}
          {!isMobile && (
            <div className="flex items-center space-x-4">
              {token ? (
                <>
                  {/* Notifications */}
                

                  {/* Dashboard */}
                  <button
                    onClick={goDashboard}
                    className="flex items-center p-2 bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-md transition"
                    aria-label="Go to dashboard"
                  >
                    <MdHome size={20} />
                  </button>

                  {/* User profile dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="flex items-center p-2 space-x-2 rounded-md hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition"
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                      aria-controls="user-menu"
                      aria-label="User menu"
                    >
                      <div className="w-8 h-8 bg-brand-primary-100 text-brand-primary-600 rounded-full flex items-center justify-center font-semibold select-none">
                        {userLoading ? "…" : user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="text-left hidden lg:block">
                        <p className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">
                          {userLoading ? "Loading..." : user.username || "User"}
                        </p>
                        <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                          {userLoading ? "..." : user.role || "Member"}
                        </p>
                      </div>
                    </button>
                    {dropdownOpen && (
                      <div
                        id="user-menu"
                        role="menu"
                        aria-label="User menu"
                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700"
                      >
                        <button
                          onClick={handleEditProfileClick}
                          role="menuitem"
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <Edit2Icon className="w-4 h-4" aria-hidden="true" />
                          Edit Profile
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Logout & Theme toggles */}
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
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="p-2 text-txt-primary-light dark:text-txt-primary-dark focus:outline-none"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Content */}
        {isMobile && mobileOpen && (
          <div className="bg-bg-primary-light dark:bg-bg-primary-dark border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden">
            <div className="flex flex-col space-y-2 p-4">
              {token ? (
                <>
                  {/* Notifications */}
                 

                  {/* Dashboard */}
                  <button
                    onClick={() => {
                      goDashboard();
                      setMobileOpen(false);
                    }}
                    className="text-left py-2 text-txt-primary-light dark:text-txt-primary-dark hover:text-brand-primary-500 transition"
                    aria-label="Go to dashboard"
                  >
                    Dashboard
                  </button>

                  {/* Profile dropdown (simplified for mobile) */}
                  <div>
                    <button
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="flex items-center p-2 rounded-md hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition w-full"
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                      aria-controls="user-menu-mobile"
                      aria-label="User menu"
                    >
                      <div className="w-8 h-8 bg-brand-primary-100 text-brand-primary-600 rounded-full flex items-center justify-center font-semibold select-none">
                        {userLoading ? "…" : user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="ml-2 text-left">
                        <p className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">
                          {userLoading ? "Loading..." : user.username || "User"}
                        </p>
                        <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                          {userLoading ? "..." : user.role || "Member"}
                        </p>
                      </div>
                    </button>

                    {dropdownOpen && (
                      <div
                        id="user-menu-mobile"
                        role="menu"
                        aria-label="User menu"
                        className="mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-700"
                      >
                        <button
                          onClick={() => {
                            handleEditProfileClick();
                            setMobileOpen(false);
                            setDropdownOpen(false);
                          }}
                          role="menuitem"
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <Edit2Icon className="w-4 h-4" aria-hidden="true" />
                          Edit Profile
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="pt-2">
                    <LogoutButton />
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-txt-primary-light dark:text-txt-primary-dark hover:text-brand-primary-500 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-brand-primary-500 hover:text-brand-primary-600 transition"
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
