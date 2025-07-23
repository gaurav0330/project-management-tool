import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "../../../graphql/authQueries";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import Logo from "../../../components/authComponent/Logo";
import IllustrationSection from "../../../components/authComponent/IllustrationSection";

function SignUpPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "@gmail.com",
    password: "111111",
    role: "Project_Manager",
  });

  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.signup.token);
      navigate("/login");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ variables: formData });
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-bg-primary-light dark:bg-bg-primary-dark shadow-2xl rounded-3xl overflow-hidden transition-colors duration-300">
        {/* Left Section */}
        <div className="p-8 md:p-12 flex flex-col bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 text-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>
          
          <div className="relative z-10">
            <Logo />
            <IllustrationSection />
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 md:p-12 bg-bg-primary-light dark:bg-bg-primary-dark transition-colors duration-300">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-heading text-4xl font-bold mb-3 text-heading-primary-light dark:text-heading-primary-dark">
                Create your account
              </h1>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-lg">
                Start your 30-day free trial. No credit card required.
              </p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="font-body text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark block">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all duration-200 font-body"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="font-body text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all duration-200 font-body"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="font-body text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all duration-200 font-body"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="font-body text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark block">
                  Select Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-secondary-light dark:bg-bg-secondary-dark text-txt-primary-light dark:text-txt-primary-dark border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all duration-200 font-body cursor-pointer"
                >
                  <option value="Project_Manager">👨‍💼 Project Manager</option>
                  <option value="Team_Lead">👩‍💻 Team Lead</option>
                  <option value="Team_Member">👨‍💻 Team Member</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 hover:from-brand-primary-600 hover:to-brand-secondary-600 text-white font-button font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="font-body text-red-600 dark:text-red-400 text-sm text-center">
                  {error.message}
                </p>
              </div>
            )}

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-brand-primary-500 hover:text-brand-primary-600 dark:text-brand-primary-400 dark:hover:text-brand-primary-300 transition-colors duration-200"
                >
                  Sign in here
                </a>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-8 flex items-center">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              <span className="px-4 font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                or continue with
              </span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            </div>

            {/* Social Login Options */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 font-body">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 font-body">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
