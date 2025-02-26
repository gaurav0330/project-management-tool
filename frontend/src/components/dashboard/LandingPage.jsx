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
    <div className="py-16 text-white bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="container flex flex-col items-center justify-between px-4 mx-auto md:flex-row">
        {/* Left Section */}
        <motion.div
          className="mb-8 md:w-1/2 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Trello brings all your tasks, teammates, and tools together
          </h1>
          <p className="mb-8 text-lg">
            Keep everything in the same place—even if your team isn't.
          </p>
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-4 py-2 text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-700">
              Sign up—it's free!
            </button>
          </div>
          <a href="#" className="inline-block mt-4 text-blue-300 hover:underline">
            Watch video
          </a>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5 }}
        >
          <img
            src={landingImage}
            alt="Project Management Tool"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="mt-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold">Why Choose Trello?</h2>
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
    <div className="py-16 text-black bg-gradient-to-b from-gray-50 to-gray-200">
    <h2 className="mb-12 text-4xl font-bold text-center">Features</h2>
    <div className="flex flex-wrap justify-center space-x-4">
      <motion.div
        className="p-8 mb-8 transition duration-500 transform bg-white rounded-lg shadow-lg w-80 hover:scale-105"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={taskImg}
          alt="Task Management"
          className="object-cover w-full h-32 mb-4 rounded-md"
        />
        <FaTasks className="mb-4 text-3xl text-indigo-500" />
        <h3 className="mb-2 text-2xl font-semibold">Task Management</h3>
        <p className="text-gray-700">Organize and prioritize your tasks with ease.</p>
      </motion.div>
      <motion.div
        className="p-8 mb-8 transition duration-500 transform bg-white rounded-lg shadow-lg w-80 hover:scale-105"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={colImg}
          alt="Collaboration"
          className="object-cover w-full h-32 mb-4 rounded-md"
        />
        <FaUsers className="mb-4 text-3xl text-indigo-500" />
        <h3 className="mb-2 text-2xl font-semibold">Collaboration</h3>
        <p className="text-gray-700">Work together with your team in real-time.</p>
      </motion.div>
      <motion.div
        className="p-8 mb-8 transition duration-500 transform bg-white rounded-lg shadow-lg w-80 hover:scale-105"
        whileHover={{ scale: 1.05 }}
      >
        <img
          src={intImg}
          alt="Integrations"
          className="object-cover w-full h-32 mb-4 rounded-md"
        />
        <FaPlug className="mb-4 text-3xl text-indigo-500" />
        <h3 className="mb-2 text-2xl font-semibold">Integrations</h3>
        <p className="text-gray-700">Connect with your favorite tools and services.</p>
      </motion.div>
    </div>
  </div>
  );
}

export function TestimonialsSection() {
  return (
    <div className="py-16 text-black bg-gradient-to-b from-gray-100 to-gray-200">
      <h2 className="mb-12 text-4xl font-bold text-center">Testimonials</h2>
      <div className="flex flex-wrap justify-center space-x-4">
        <motion.div
          className="p-8 mb-8 transition duration-500 transform bg-white rounded-lg shadow-lg w-80 hover:scale-105"
          whileHover={{ scale: 1.05 }}
        >
          <FaQuoteLeft className="mb-4 text-3xl text-indigo-500" />
          <p className="italic text-gray-700">"Trello has transformed the way our team works!"</p>
          <span className="block mt-4 font-semibold text-indigo-600">- Alex, Project Manager</span>
        </motion.div>
        <motion.div
          className="p-8 mb-8 transition duration-500 transform bg-white rounded-lg shadow-lg w-80 hover:scale-105"
          whileHover={{ scale: 1.05 }}
        >
          <FaQuoteLeft className="mb-4 text-3xl text-indigo-500" />
          <p className="italic text-gray-700">"A must-have tool for any team looking to improve productivity."</p>
          <span className="block mt-4 font-semibold text-indigo-600">- Jamie, Team Lead</span>
        </motion.div>
      </div>
    </div>
  );
}