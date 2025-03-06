import React from "react";

const Filters = ({ search, setSearch, statusFilter, setStatusFilter }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Search projects..."
        className="border p-2 rounded w-1/3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="border p-2 rounded"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="On Hold">On Hold</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
};

export default Filters;
