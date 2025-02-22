// src/components/Card.js
import React from 'react';

function Card({ title, content }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-red-700">{content}</p>
    </div>
  );
}

export default Card;
