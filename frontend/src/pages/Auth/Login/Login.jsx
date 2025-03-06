import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../../graphql/authQueries";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../components/authContext";
import Logo from "../../../assets/logo.png";
import LoginIllustration from "../../../components/authComponent/LoginIllustration";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function LoginPage() {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  const [formData, setFormData] = useState({
    email: "@gmail.com",
    password: "111111",
  });

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login) {
        const { token, role } = data.login;

        // Store user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ role }));

        // Update AuthContext state
        setUserRole(role);

        // Show success message
        setOpenSnackbar(true);

        // Set the redirect path based on role
        if (role === "Project_Manager") setRedirectPath("/projectDashboard");
        else if (role === "Team_Lead") setRedirectPath("/teamleaddashboard");
        else if (role === "Team_Member") setRedirectPath("/teammemberdashboard");
        else setRedirectPath("/"); // Default redirect
      }
    },
  });

  // Effect to handle redirection after showing the snackbar
  useEffect(() => {
    if (redirectPath) {
      const timer = setTimeout(() => {
        navigate(redirectPath);
      }, 800); // Delay navigation by  2 seconds
      return () => clearTimeout(timer);
    }
  }, [redirectPath, navigate]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ variables: formData });
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="grid w-full max-w-6xl overflow-hidden bg-white shadow-xl rounded-2xl md:grid-cols-2">
        {/* Left Section */}
        <div className="p-8 md:p-12">
          <img src={Logo} height={50} width={180}/>
          <div className="max-w-md">
            <h1 className="mt-8 mb-2 text-3xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="mb-8 text-gray-500">Please enter your details to sign in</p>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 mb-4 border rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-white bg-blue-600 rounded"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {error && <p className="mt-2 text-red-500">{error.message}</p>}

            <p className="mt-6 text-center text-gray-500">
              Don't have an account?{" "}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-700">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:block bg-gray-50">
          <LoginIllustration />
        </div>
      </div>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Login Successful!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default LoginPage;
