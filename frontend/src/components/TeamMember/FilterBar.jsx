const FilterBar = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, setSortBy }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search projects..."
        className="w-full md:w-1/3 px-4 py-2
          bg-bg-primary-light dark:bg-bg-primary-dark
          text-txt-primary-light dark:text-txt-primary-dark
          placeholder-txt-secondary-light dark:placeholder-txt-secondary-dark
          border border```
          border-gray-300 dark:border-gray-700
          rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500
          transition-all duration-200 font-body"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 w-full md:w-auto
            bg-bg-primary-light dark:bg-bg-primary-dark
            text-txt-primary-light dark:text-txt-primary-dark
            border border-gray-300 dark:border-gray-700
            rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500
            transition-all duration-200 font-body"
        >
          <option value="All">All Status</option>
          <option value="In Progress">In Progress</option>
          <option value="To Do">To Do</option>
          <option value="Done">Completed</option>
        </select>

        {/* Sort Dropdown */}
        <select
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 w-full md:w-auto
            bg-bg-primary-light dark:bg-bg-primary-dark
            text-txt-primary-light dark:text-txt-primary-dark
            border border-gray-300 dark:border-gray-700
            rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500
            transition-all duration-200 font-body"
        >
          <option value="Priority">Sort by Priority</option>
          <option value="StartDate">Sort by Start Date</option>
          <option value="EndDate">Sort by End Date</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
