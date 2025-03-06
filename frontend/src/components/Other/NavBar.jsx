import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdHome, MdNotifications, MdMessage, MdHelp } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { gql, useQuery } from "@apollo/client"; // Import GraphQL query hook
import logo from '../../assets/logo.png';
import Alert from '@mui/material/Alert';
import LogoutButton from "./Logout";

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
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id); // Extract userId from token
        setUserRole(decodedToken.role); // Extract user role from token
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

  // const handleLogout = () => {
  //   if (<Alert> </Alert>) {
  //     localStorage.removeItem("token");
  //     navigate("/login");
  //   }
  // };

  const handleDashboardRedirect = () => {
    if (userRole) {
      switch (userRole) {
        case 'Project_Manager':
          navigate('/projectDashboard');
          break;
        case 'Team_Lead':
          navigate('/teamleaddashboard'); // Redirect to Team Lead dashboard
          break;
        case 'Team_Member':
          navigate('/teammemberdashboard'); // Redirect to Team Member dashboard
          break;
        default:
          navigate('/'); // Default dashboard
          break;
      }
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
  <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-1xl">
    {/* Logo on the left */}
    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
      <img src={logo} alt="Logo" className="w-auto h-10" /> {/* Logo image */}
    </div>

    {/* Right Side - Show items based on authentication */}
    <div className="flex items-center space-x-4">
      {token ? (
        <>
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 transition duration-200 rounded-lg hover:bg-gray-100">
            <MdNotifications className="w-6 h-6" />
            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
          </button>

          {/* Messages */}
          <button className="relative p-2 text-gray-600 transition duration-200 rounded-lg hover:bg-gray-100">
            <MdMessage className="w-6 h-6" />
            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
          </button>

          {/* Go to Dashboard Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={handleDashboardRedirect}
          >
            <MdHome size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center p-2 space-x-3 transition duration-200 rounded-lg hover:bg-gray-100"
              onClick={() => ""}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <span className="text-sm font-medium text-blue-600">
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
                  className="block w-full px-4 py-2 text-sm text-left text-red-600 transition duration-200 rounded-lg hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Logout Button at the rightmost end */}
          <LogoutButton />
        </>
      ) : (
        <>
          <button
            className="px-4 py-2 text-gray-700 transition duration-200 border border-gray-300 rounded-lg hover:bg-gray-100"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="px-4 py-2 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </>
      )}
    </div>
  </div>
</nav>


  );
};

export default Navbar;
