import React from "react";

const FilterControls = ({ onDepartmentChange, onDateChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <select className="border p-2 rounded" onChange={(e) => onDepartmentChange(e.target.value)}>
        <option value="All">All Departments</option>
        <option value="Development">Development</option>
        <option value="Design">Design</option>
      </select>

      <select className="border p-2 rounded" onChange={(e) => onDateChange(e.target.value)}>
        <option value="This Month">This Month</option>
        <option value="Last Month">Last Month</option>
      </select>
    </div>
  );
};

export default FilterControls;
