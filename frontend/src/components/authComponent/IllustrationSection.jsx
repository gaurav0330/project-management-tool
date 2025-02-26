import React from 'react';

const IllustrationSection = () => {
  return (
    <div className="flex-1 flex flex-col justify-center space-y-6 mt-12">
      <img
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
        alt="Team collaboration"
        className="rounded-lg shadow-lg object-cover"
      />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Streamline Your Project Management
        </h2>
        <p className="text-gray-600">
          Join thousands of teams who trust ProjectFlow to manage their projects efficiently.
        </p>
      </div>
    </div>
  );
};

export default IllustrationSection;