import React from "react";
import { motion } from "framer-motion";
import landingImage from "../../assets/landing.png";
import taskImg from "../../assets/task.jpg";
import colImg from "../../assets/shakehand.jpg"
import intImg from "../../assets/int.jpg"

import { FaQuoteLeft } from "react-icons/fa";
import { FaTasks, FaUsers, FaPlug } from "react-icons/fa";


export default function TrelloSection() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section */}
        <motion.div
          className="md:w-1/2 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trello brings all your tasks, teammates, and tools together
          </h1>
          <p className="text-lg mb-8">
            Keep everything in the same place—even if your team isn't.
          </p>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">
              Sign up—it's free!
            </button>
          </div>
          <a href="#" className="text-blue-300 hover:underline mt-4 inline-block">
            Watch video
          </a>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={landingImage}
            alt="Project Management Tool"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">Why Choose Trello?</h2>
            <p className="text-lg">
              Trello helps teams move work forward. Collaborate, manage projects, and reach new productivity peaks.
            </p>
          </div>
        </motion.div>
      </div>    
    </div>
  );
}

export function FeaturesSection() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-200 text-black py-16">
    <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
    <div className="flex flex-wrap justify-center space-x-4">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-80 mb-8 transform transition duration-500 hover:scale-105"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={taskImg}
          alt="Task Management"
          className="w-full h-32 object-cover rounded-md mb-4"
        />
        <FaTasks className="text-indigo-500 text-3xl mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Task Management</h3>
        <p className="text-gray-700">Organize and prioritize your tasks with ease.</p>
      </motion.div>
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-80 mb-8 transform transition duration-500 hover:scale-105"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={colImg}
          alt="Collaboration"
          className="w-full h-32 object-cover rounded-md mb-4"
        />
        <FaUsers className="text-indigo-500 text-3xl mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Collaboration</h3>
        <p className="text-gray-700">Work together with your team in real-time.</p>
      </motion.div>
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-80 mb-8 transform transition duration-500 hover:scale-105"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={intImg}
          alt="Integrations"
          className="w-full h-32 object-cover rounded-md mb-4"
        />
        <FaPlug className="text-indigo-500 text-3xl mb-4" />
        <h3 className="text-2xl font-semibold mb-2">Integrations</h3>
        <p className="text-gray-700">Connect with your favorite tools and services.</p>
      </motion.div>
    </div>
  </div>
  );
}

export function TestimonialsSection() {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 text-black py-16">
      <h2 className="text-4xl font-bold text-center mb-12">Testimonials</h2>
      <div className="flex flex-wrap justify-center space-x-4">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg w-80 mb-8 transform transition duration-500 hover:scale-105"
          whileHover={{ scale: 1.05 }}
        >
          <FaQuoteLeft className="text-indigo-500 text-3xl mb-4" />
          <p className="italic text-gray-700">"Trello has transformed the way our team works!"</p>
          <span className="block mt-4 font-semibold text-indigo-600">- Alex, Project Manager</span>
        </motion.div>
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg w-80 mb-8 transform transition duration-500 hover:scale-105"
          whileHover={{ scale: 1.05 }}
        >
          <FaQuoteLeft className="text-indigo-500 text-3xl mb-4" />
          <p className="italic text-gray-700">"A must-have tool for any team looking to improve productivity."</p>
          <span className="block mt-4 font-semibold text-indigo-600">- Jamie, Team Lead</span>
        </motion.div>
      </div>
    </div>
  );
}