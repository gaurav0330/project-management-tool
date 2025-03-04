import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdNotifications, MdMessage, MdHelp } from "react-icons/md";
import { jwtDecode } from "jwt-decode"; 
import { gql, useQuery } from "@apollo/client"; // Import GraphQL query hook

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

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id); // Extract userId from token
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);

  // Fetch user details from backend
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId },
    skip: !userId, // Skip query if userId is not available
  });

  const user = data?.getUser || {};

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search projects, tasks, or team members..."
              />
            </div>
          </div>

          {/* Right Side - Show items based on authentication */}
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-100">
                  <MdNotifications className="w-6 h-6" />
                  <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
                </button>

                {/* Messages */}
                <button className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-100">
                  <MdMessage className="w-6 h-6" />
                  <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
                </button>

                {/* Help */}
                <button className="p-2 text-gray-600 rounded-lg hover:bg-gray-100" onClick={() => navigate("/")}>
                  <MdHelp className="w-6 h-6" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100">
                      <span className="text-sm font-medium text-primary-600">
                        {loading ? "..." : user.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="hidden text-left md:block">
                      <p className="text-sm font-medium text-gray-700">{loading ? "Loading..." : user.username || "User"}</p>
                      <p className="text-xs text-gray-500">{loading ? "..." : user.role || "Member"}</p>
                    </div>
                  </button>

                  {/* Logout Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 w-40 p-2 mt-2 bg-white rounded-lg shadow-lg">
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-red-600 rounded-lg hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
