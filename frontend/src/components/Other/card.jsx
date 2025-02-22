// src/components/Card.js
import React from 'react';

function Card({ title, content }) {
  return (
<<<<<<< HEAD
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-red-700">{content}</p>
=======

    <div className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl rounded-2xl p-6 border border-gray-300 text-white transform transition duration-300 hover:scale-105">
    <div className="bg-red-500 text-white p-4">Hello, Tailwind!</div>
      <h3 className="text-2xl font-bold mb-3 drop-shadow-lg">{title}</h3>
      <p className="text-lg opacity-90">{content}</p>
      <div className="mt-4 flex justify-end">
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium shadow-md hover:bg-blue-100">Learn More</button>
      </div>
>>>>>>> origin/master
    </div>
  );
}

export default Card;