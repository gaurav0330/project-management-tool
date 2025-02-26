export default function Pagination({ totalTasks, tasksPerPage, currentPage, setCurrentPage }) {
    const totalPages = Math.ceil(totalTasks / tasksPerPage);
  
    return (
      <div className="flex justify-between items-center mt-4">
        <p>Showing {Math.min(currentPage * tasksPerPage, totalTasks)} of {totalTasks} tasks</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={`px-3 py-1 ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setCurrentPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button className="px-3 py-1 bg-gray-200 rounded" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </button>
        </div>
      </div>
    );
  }
  