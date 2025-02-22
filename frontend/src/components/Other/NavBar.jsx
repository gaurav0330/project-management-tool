import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src="https://www.atlassian.com/favicon.ico" alt="Logo" className="h-8 mr-2" />
          <span className="text-blue-600 font-semibold text-lg">Heera</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Solutions</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Product guide</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Templates</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
        </div>

        {/* Call to Action Button */}
        <div className="flex items-center space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Get it free
          </button>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-2 top-2.5 h-4 w-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Sign In Button */}
          <a href="#" className="text-gray-600 hover:text-gray-900">Sign in</a>
        </div>
      </div>
    </nav>
  );
}
