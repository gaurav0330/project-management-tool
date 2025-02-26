import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdNotifications, MdMessage, MdHelp } from 'react-icons/md';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search projects, tasks, or team members..."
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <MdNotifications className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Messages */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <MdMessage className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Help */}
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"  onClick={() => navigate('/')}>
              <MdHelp className="w-6 h-6" />
            </button>

            {/* Profile */}
            <button
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => navigate('/login')}
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">JD</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;