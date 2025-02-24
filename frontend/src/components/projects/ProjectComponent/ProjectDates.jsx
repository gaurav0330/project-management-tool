import React from 'react';

const ProjectDates = ({ startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <div className="flex space-x-4">
      <div className="w-1/2">
        <label className="block text-gray-700">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div className="w-1/2">
        <label className="block text-gray-700">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </div>
  );
};

export default ProjectDates;
