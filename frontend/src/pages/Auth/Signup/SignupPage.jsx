import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "../../../graphql/authQueries";
import { useNavigate } from "react-router-dom";
import Logo from "../../../components/authComponent/Logo";
import IllustrationSection from "../../../components/authComponent/IllustrationSection";

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "@gmail.com",
    password: "111111",
    role: "Project_Manager",
 // Default role
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="grid w-full max-w-6xl overflow-hidden bg-white shadow-xl rounded-2xl md:grid-cols-2">
        {/* Left Section */}
        <div className="flex flex-col p-8 md:p-12">
          <Logo />
          <IllustrationSection />
        </div>

        {/* Right Section */}
        <div className="p-8 bg-white md:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="mb-8 text-gray-500">
              Start your 30-day free trial. No credit card required.
            </p>

            {/* Signup Form */}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-2 mb-2 border rounded"
              />
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
                className="w-full p-2 mb-2 border rounded"
              />
             <select
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="w-full p-2 mb-4 border rounded"
>
  <option value="Project_Manager">Project Manager</option>
  <option value="Team_Lead">Team Lead</option>
  <option value="Team_Member">Team Member</option>
</select>



              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-white bg-blue-600 rounded"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            {error && <p className="mt-2 text-red-500">{error.message}</p>}

            <p className="mt-6 text-center text-gray-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
