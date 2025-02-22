import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"; // Importing social media icons

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" className="hover:text-blue-500">
            <FaFacebook className="text-2xl" />
          </a>
          <a href="#" className="hover:text-blue-500">
            <FaTwitter className="text-2xl" />
          </a>
          <a href="#" className="hover:text-blue-500">
            <FaLinkedin className="text-2xl" />
          </a>
          <a href="#" className="hover:text-blue-500">
            <FaInstagram className="text-2xl" />
          </a>
        </div>
        <p className="mb-4">&copy; 2023 Your Company. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
        <div className="mt-4">
          <p>1234 Street Name, City, State, 12345</p>
          <p>Email: contact@yourcompany.com | Phone: (123) 456-7890</p>
        </div>
      </div>
    </footer>
  );
} 