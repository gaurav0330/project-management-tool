import React from "react";

export default function TrelloSection() {
  return (
    <div className="bg-purple-500 text-white py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trello brings all your tasks, teammates, and tools together
          </h1>
          <p className="text-lg mb-8">
            Keep everything in the same place—even if your team isn’t.
          </p>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Sign up—it’s free!
            </button>
          </div>
          <a href="#" className="text-blue-300 hover:underline mt-4 inline-block">
            Watch video
          </a>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2">
          <img
            src="https://example.com/trello-illustration.png"
            alt="Trello Illustration"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
