import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "../../../graphql/authQueries";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import Logo from "../../../components/authComponent/Logo";

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5 text-txt-muted-light dark:text-txt-muted-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);
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
const ChevronDown = () => (
  <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-txt-muted-light dark:text-txt-muted-dark" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function SignUpPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "Project_Manager",
  });

  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.signup.token);
      navigate("/login");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ variables: formData });
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-bg-secondary-light to-white dark:from-bg-secondary-dark dark:to-black px-4 py-10 sm:px-6">
      <div className="w-full max-w-md sm:max-w-lg bg-white dark:bg-bg-primary-dark rounded-3xl shadow-xl border border-bg-accent-light dark:border-bg-accent-dark p-6 sm:p-8 transition-all">
        <div className="flex flex-col items-center mb-6">
          <Logo className="mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-heading-accent-light dark:text-heading-accent-dark">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
            Start your free trial — no credit card required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <UserIcon />
            </span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              maxLength={32}
              className="w-full pl-[2.75rem] pr-4 py-2.5 rounded-full border border-bg-accent-light dark:border-bg-accent-dark bg-bg-secondary-light dark:bg-bg-secondary-dark text-sm text-txt-primary-light dark:text-txt-primary-dark placeholder-txt-muted-light dark:placeholder-txt-muted-dark focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition"
            />
          </div>

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

          {/* Role */}
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="appearance-none w-full pl-[2.75rem] pr-8 py-2.5 rounded-full border border-bg-accent-light dark:border-bg-accent-dark bg-bg-secondary-light dark:bg-bg-secondary-dark text-sm text-txt-primary-light dark:text-txt-primary-dark focus:ring-2 focus:ring-brand-secondary-500 focus:outline-none transition cursor-pointer"
            >
              <option value="Project_Manager">Project Manager</option>
              <option value="Team_Lead">Team Lead</option>
              <option value="Team_Member">Team Member</option>
            </select>
            <ChevronDown />
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
                Creating...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
          <span className="mx-3 text-xs text-txt-muted-light dark:text-txt-muted-dark">or sign up with</span>
          <div className="flex-1 h-px bg-border-light dark:bg-border-dark" />
        </div>

        {/* Social Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-bg-accent-light dark:border-bg-accent-dark rounded-full bg-white dark:bg-bg-accent-dark text-xs text-txt-primary-light dark:text-txt-primary-dark hover:bg-gray-50 dark:hover:bg-bg-secondary-dark transition">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <g>
                <path fill="#4285F4" d="M21.8 10h-9.8v4h5.7c-.5 1.3-1.4 2.3-2.2 3v3h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
                <path fill="#34A853" d="M12 22c2.4 0 4.3-.8 5.8-2.1l-3.5-2.7c-1 .7-2.2 1.1-3.7 1.1-2.8 0-5.2-1.9-6-4.4H3v2.8A10 10 0 0012 22z" />
                <path fill="#FBBC05" d="M6 13.8a6 6 0 010-3.7v-2.8H3A10 10 0 002 12c0 1.6.4 3.1 1 4.7l3.9-2.9z" />
                <path fill="#EA4335" d="M12 6.5c1.3 0 2.4.4 3.3 1.3L18 5.3A10 10 0 0012 2a10 10 0 00-9 5.8l3.9 2.8c.8-2.6 3.2-4.1 5.1-4.1z" />
              </g>
            </svg>
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-bg-accent-light dark:border-bg-accent-dark rounded-full bg-white dark:bg-bg-accent-dark text-xs text-txt-primary-light dark:text-txt-primary-dark hover:bg-gray-50 dark:hover:bg-bg-secondary-dark transition">
            <svg width="16" height="16" fill="#1877F3" viewBox="0 0 24 24">
              <path d="M22.676 0H1.326C.595 0 0 .6 0 1.34V22.66c0 .74.595 1.34 1.326 1.34h11.495V14.74h-3.133v-3.624h3.133V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.461.099 2.794.142v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.764v2.314h3.587l-.467 3.624h-3.12V24h6.116c.73 0 1.325-.6 1.325-1.34V1.34C24 .6 23.405 0 22.675 0"/>
            </svg>
            Facebook
          </button>
        </div>

        <p className="text-center mt-6 text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
          Already have an account?{" "}
          <a href="/login" className="text-brand-primary-500 dark:text-brand-primary-400 font-medium hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
