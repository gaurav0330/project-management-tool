const FilterBar = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, setSortBy }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <input
        type="text"
        placeholder="Search tasks..."
        className="p-2 border rounded w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex space-x-4">
        <select
          className="p-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="In Progress">In Progress</option>
          <option value="To Do">To Do</option>
          <option value="Done">Completed</option>
        </select>

        <select className="border p-2 rounded" onChange={(e) => setSortBy(e.target.value)}>
          <option value="Priority">Sort by Priority</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">+ New Project</button>
      </div>
    </div>
  );
};

export default FilterBar;
