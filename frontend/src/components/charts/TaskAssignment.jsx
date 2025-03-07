import React from "react";
import { useQuery, gql } from "@apollo/client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import dayjs from "dayjs";

const GET_TASKS_HISTORY = gql`
  query GetTasksHistory($projectId: ID!) {
    getTasksHistory(projectId: $projectId) {
      taskId
      title
      history {
        updatedBy
        updatedAt
        oldStatus
        newStatus
        updatedByName
      }
    }
  }
`;

const statusCategories = [
  { name: "To Do", color: "border-gray-300 bg-gray-100", borderColor: "border-gray-500" },
  { name: "In Progress", color: "border-yellow-300 bg-yellow-100", borderColor: "border-yellow-500" },
  { name: "Needs Revision", color: "border-red-300 bg-red-100", borderColor: "border-red-500" },
  { name: "Done", color: "border-green-300 bg-green-100", borderColor: "border-green-500" },
  { name: "Pending Approval", color: "border-blue-300 bg-blue-100", borderColor: "border-blue-500" },
  { name: "Approved", color: "border-purple-300 bg-purple-100", borderColor: "border-purple-500" },
  { name: "Completed", color: "border-teal-300 bg-teal-100", borderColor: "border-teal-500" },
];

const KanbanBoard = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_TASKS_HISTORY, {
    variables: { projectId },
  });

  if (loading) return <p className="text-center text-gray-500">Loading tasks...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error.message}</p>;

  // Organize tasks by status & count totals
  const taskMap = {};
  const statusCounts = {};
  statusCategories.forEach((status) => {
    taskMap[status.name] = [];
    statusCounts[status.name] = 0;
  });

  data?.getTasksHistory?.forEach((task) => {
    if (task.history.length > 0) {
      const latestStatus = task.history[task.history.length - 1];
      taskMap[latestStatus.newStatus]?.push({ ...task, latestStatus });
      statusCounts[latestStatus.newStatus] += 1;
    }
  });

  const onDragEnd = (result) => {
    console.log("Drag is disabled, no updates allowed.");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      {/* Main Container with Border */}
      <div className="w-full max-w-7xl border-2 border-gray-300 shadow-lg bg-white rounded-lg p-6">
        {/* Summary Section */}
        <div className="flex flex-wrap justify-center mb-6 space-x-4">
          {statusCategories.map(({ name, borderColor }) => (
            <div
              key={name}
              className={`p-3 rounded-lg shadow-md ${borderColor} border-2 bg-white transition-transform transform hover:scale-105`}
            >
              <h3 className="text-sm font-semibold text-gray-700">{name}</h3>
              <p className="text-lg font-bold text-gray-900">{statusCounts[name] || 0}</p>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-6 overflow-auto">
            {statusCategories.map(({ name, color, borderColor }) => (
              <div
                key={name}
                className={`w-1/5 p-4 rounded-lg shadow-lg border-2 ${color} ${borderColor} transition-all duration-300 hover:shadow-xl`}
              >
                <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">{name}</h2>
                <Droppable droppableId={name} isDropDisabled={true}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[250px] space-y-3">
                      {taskMap[name].length > 0 ? (
                        taskMap[name].map((task, index) => (
                          <Draggable key={task.title} draggableId={task.title} index={index} isDragDisabled={true}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${borderColor} transform transition-transform hover:scale-105 hover:bg-gray-50`}
                              >
                                <p className="text-sm font-semibold text-gray-800">Task Title: {task.title}</p>
                                <p className="text-xs text-gray-500">
                                  Last Updated: {dayjs(Number(task.latestStatus.updatedAt)).format("MMM DD, HH:mm")}
                                </p>
                                <p className="text-xs font-medium text-gray-700">Updated By: {task.latestStatus.updatedByName}</p>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center">No tasks</p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
