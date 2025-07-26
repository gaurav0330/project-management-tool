import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../../graphql/authQueries";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../components/authContext";
import { useTheme } from "../../../contexts/ThemeContext";
import Logo from "../../../assets/logo.png";
import Login3DIllustration from "../../../components/authComponent/Login3DIllustration";

function LoginPage() {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const { isDark } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  const [formData, setFormData] = useState({
    email: "@gmail.com",
    password: "111111",
  });

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.login) {
        const { token, role } = data.login;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ role }));

        setUserRole(role);

        setShowSuccess(true);

        if (role === "Project_Manager") setRedirectPath("/projectDashboard");
        else if (role === "Team_Lead") setRedirectPath("/teamleaddashboard");
        else if (role === "Team_Member") setRedirectPath("/teammemberdashboard");
        else setRedirectPath("/");
      }
    },
  });

  useEffect(() => {
    if (redirectPath && showSuccess) {
      const timer = setTimeout(() => {
        navigate(redirectPath);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [redirectPath, navigate, showSuccess]);

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
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-12">
      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-primary-light dark:bg-bg-primary-dark p-8 rounded-3xl shadow-lg border border-brand-accent-500 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-brand-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Login Successful!
            </h3>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-bg-primary-light dark:bg-bg-primary-dark shadow-2xl rounded-3xl overflow-hidden">
        {/* Left - Login Form */}
        <div className="p-10 md:p-12 flex flex-col justify-center">
          <img
            src={Logo}
            height={50}
            width={180}
            alt="YojanaDesk Logo"
            className="mb-10"
          />
          <h1 className="font-heading text-4xl font-bold mb-3 text-heading-primary-light dark:text-heading-primary-dark">
            Welcome Back
          </h1>
          <p className="mb-10 font-body text-lg text-txt-secondary-light dark:text-txt-secondary-dark">
            Sign in to manage your projects efficiently
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md w-full">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-heading-primary-light dark:text-heading-primary-dark"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark placeholder:text-txt-muted-light dark:placeholder:text-txt-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-heading-primary-light dark:text-heading-primary-dark"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark placeholder:text-txt-muted-light dark:placeholder:text-txt-muted-dark focus:outline-none focus:ring-2 focus:ring-brand-primary-500 transition"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm font-medium text-brand-primary-500 hover:text-brand-primary-600 dark:text-brand-primary-400 dark:hover:text-brand-primary-300 transition"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <p className="mt-4 p-4 text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-body">
                {error.message}
              </p>
            )}
          </form>

          {/* Signup Link */}
          <p className="mt-8 text-center text-txt-secondary-light dark:text-txt-secondary-dark font-body">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-brand-primary-500 hover:text-brand-primary-600 dark:text-brand-primary-400 dark:hover:text-brand-primary-300 transition"
            >
              Sign up here
            </a>
          </p>
        </div>

        {/* Right - 3D Illustration */}
        <div className="hidden md:flex bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 p-12 items-center justify-center">
          <Login3DIllustration />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
