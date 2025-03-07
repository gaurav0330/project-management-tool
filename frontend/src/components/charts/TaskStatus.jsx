import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";

// GraphQL Query
const GET_TASK_STATUS = gql`
  query GetTaskStatusBreakdown($projectId: ID!) {
    getTaskStatusBreakdown(projectId: $projectId) {
      statusBreakdown {
        toDo
        inProgress
        needsRevision
        completed
      }
    }
  }
`;

// Colors: Green (Completed), Orange (In Progress), Yellow (Needs Revision), Red (To Do)
const COLORS = {
  completed: "#4CAF50",
  inProgress: "#FF9800",
  needsRevision: "#FFC107",
  toDo: "#F44336",
};

// Format Status Text
const formatStatus = (status) => {
  const formattedStatus = {
    toDo: "To Do",
    inProgress: "In Progress",
    needsRevision: "Needs Revision",
    completed: "Completed",
  };
  return formattedStatus[status] || status;
};

// Skeleton Loader
const skeletonStyle = {
  width: "100%",
  height: "300px",
  backgroundColor: "#e0e0e0",
  borderRadius: "8px",
  marginBottom: "16px",
};

const TaskStatusPieChart = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_TASK_STATUS, {
    variables: { projectId },
  });

  if (loading) return <div style={skeletonStyle} />;
  if (error) return <p className="text-red-500 text-center">Error loading task status data.</p>;

  const { statusBreakdown } = data.getTaskStatusBreakdown;
  
  // Convert data into an array format
  const chartData = Object.entries(statusBreakdown)
    .map(([status, count]) => ({
      status: formatStatus(status),
      count,
      color: COLORS[status] || "#8884d8",
    }))
    .filter((item) => item.count > 0);

  if (chartData.length === 0) {
    return <p className="text-gray-500 text-center">No tasks yet.</p>;
  }

  const totalTasks = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="mb-4 text-xl font-semibold text-gray-800 text-center">📌 Task Status Breakdown</h2>

      {/* Pie Chart */}
      <div className="relative flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Total Tasks in Center */}
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700">
          {totalTasks} Tasks
        </div>
      </div>

      {/* Task Status Breakdown */}
      <div className="mt-6 space-y-2">
        {chartData.map((item) => (
          <div key={item.status} className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-gray-700 font-medium">{item.status}:</span>
            <span className="text-gray-900 font-bold">{item.count}</span>
            
            {/* Progress Bar */}
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 rounded-full"
                style={{
                  width: `${(item.count / totalTasks) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusPieChart;
