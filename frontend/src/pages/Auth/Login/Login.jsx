import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../../graphql/authQueries";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../components/authContext";
import { useTheme } from "../../../contexts/ThemeContext";
import Logo from "../../../components/authComponent/Logo";

// Icons matching signup style
const MailIcon = () => (
  <svg className="w-5 h-5 text-txt-muted-light dark:text-txt-muted-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm16 0L12 13 4 4" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-txt-muted-light dark:text-txt-muted-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="16" height="10" x="4" y="11" rx="2" strokeWidth="1.7" />
    <path strokeWidth="1.7" strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

function LoginPage() {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();
  const { isDark } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-bg-secondary-light to-white dark:from-bg-secondary-dark dark:to-black px-4 py-10 sm:px-6">
      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-bg-primary-dark p-8 rounded-3xl shadow-xl border border-bg-accent-light dark:border-bg-accent-dark text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
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

      <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-bg-primary-dark rounded-3xl shadow-xl border border-bg-accent-light dark:border-bg-accent-dark p-6 sm:p-8 transition-all">
        <div className="flex flex-col items-center mb-6">
          <Logo className="mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-heading-accent-light dark:text-heading-accent-dark">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
            Sign in to manage your projects efficiently
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <MailIcon />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={64}
              className="w-full pl-[2.75rem] pr-4 py-2.5 rounded-full border border-bg-accent-light dark:border-bg-accent-dark bg-bg-secondary-light dark:bg-bg-secondary-dark text-sm text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-muted-light dark:placeholder-txt-muted-dark focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <LockIcon />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={32}
              className="w-full pl-[2.75rem] pr-4 py-2.5 rounded-full border border-bg-accent-light dark:border-bg-accent-dark bg-bg-secondary-light dark:bg-bg-secondary-dark text-sm text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-muted-light dark:placeholder-txt-muted-dark focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="#"
              className="text-xs text-brand-primary-500 dark:text-brand-primary-400 font-medium hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Error */}
          {error && (
            <div className="text-xs text-error bg-error/10 border border-error/30 rounded-full px-4 py-2 flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9V6a.75.75 0 111.5 0v3a.75.75 0 01-1.5 0zm1.25 5a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
              {error.message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white font-medium text-sm shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-150 active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                  <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-center mt-6 text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
          Don't have an account?{" "}
          <a href="/signup" className="text-brand-primary-500 dark:text-brand-primary-400 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
