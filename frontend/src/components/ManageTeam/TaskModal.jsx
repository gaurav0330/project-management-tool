import React from "react";

const TaskModal = ({ isOpen, onClose, tasks, personName, personType = "lead" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-heading">
              Tasks for {personType === "member" ? "Member" : "Lead"}: {personName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No tasks assigned to this {personType} yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 font-heading">
                      {task.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : task.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3 font-body">
                    {task.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500 dark:text-gray-400">Priority:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          task.priority === 'High'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                            : task.priority === 'Medium'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {task.priority || 'Not Set'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500 dark:text-gray-400">Due Date:</span>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </span>
                    </div>
                  </div>
                  
                  {task.remarks && (
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="font-medium text-blue-700 dark:text-blue-300 text-sm">Remarks:</span>
                      <p className="text-blue-600 dark:text-blue-200 text-sm mt-1">{task.remarks}</p>
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                    {task.updatedAt && task.updatedAt !== task.createdAt && (
                      <span className="ml-4">
                        Updated: {new Date(task.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal; 