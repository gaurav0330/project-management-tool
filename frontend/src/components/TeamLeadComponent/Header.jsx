import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <h2 className="text-xl font-semibold">Projects Overview</h2>
      <div className="flex items-center space-x-4">
        <span className="text-gray-500">🔔</span>
        <img
          src="https://randomuser.me/api/portraits/men/5.jpg"
          alt="User"
          className="w-8 h-8 rounded-full border"
        />
      </div>
    </div>
  );
};

export default Header;
