const FilterBar = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, setSortBy }) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <input
        type="text"
        placeholder="Search tasks..."
        className="w-1/3 p-2 border rounded"
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

        <select className="p-2 border rounded" onChange={(e) => setSortBy(e.target.value)}>
          <option value="Priority">Sort by Priority</option>
        </select>

        
      </div>
    </div>
  );
};

export default FilterBar;
