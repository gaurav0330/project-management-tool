import React from "react";

const FilterControls = ({ onDepartmentChange, onDateChange }) => (
  <div className="flex flex-wrap gap-4 mb-6">
    <select
      className="border border-gray-300 dark:border-gray-600 rounded-md p-2 text-txt-primary-light dark:text-txt-primary-dark bg-bg-primary-light dark:bg-bg-primary-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
      onChange={(e) => onDepartmentChange(e.target.value)}
      aria-label="Select Department"
    >
      <option value="All">All Departments</option>
      <option value="Development">Development</option>
      <option value="Design">Design</option>
      {/* Add more departments as needed */}
    </select>

    <select
      className="border border-gray-300 dark:border-gray-600 rounded-md p-2 text-txt-primary-light dark:text-txt-primary-dark bg-bg-primary-light dark:bg-bg-primary-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
      onChange={(e) => onDateChange(e.target.value)}
      aria-label="Select Date Range"
    >
      <option value="This Month">This Month</option>
      <option value="Last Month">Last Month</option>
      {/* Add more date ranges if needed */}
    </select>
  </div>
);


export default FilterControls;
