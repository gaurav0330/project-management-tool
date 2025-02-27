import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../../graphql/authQueries";
import { useNavigate } from "react-router-dom";
import Logo from "../../../components/authComponent/Logo";
import LoginIllustration from "../../../components/authComponent/LoginIllustration";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.login.token);
      alert("Login successful!");
      // navigate("/dashboard");
    },
  });

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full grid md:grid-cols-2 overflow-hidden">
        {/* Left Section */}
        <div className="p-8 md:p-12">
          <Logo />
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 mb-8">Please enter your details to sign in</p>

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
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {error && <p className="text-red-500 mt-2">{error.message}</p>}

            <p className="mt-6 text-center text-gray-500">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
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
    </div>
  );
}

export default LoginPage;
