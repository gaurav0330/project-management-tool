import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";

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

// Updated colors for better visibility
const COLORS = ["#4CAF50", "#FF9800", "#FFC107", "#F44336"]; // Green, Orange, Yellow, Red

const formatStatus = (status) => {
  const formattedStatus = {
    toDo: "To Do",
    inProgress: "In Progress",
    needsRevision: "Needs Revision",
    completed: "Completed",
  };
  return formattedStatus[status] || status;
};

const skeletonStyle = {
  width: '100%',
  height: '300px',
  backgroundColor: '#e0e0e0',
  borderRadius: '8px',
  marginBottom: '16px',
};

const TaskStatusPieChart = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_TASK_STATUS, {
    variables: { projectId },
  });

  if (loading) return <div style={skeletonStyle} />;
  if (error) return <p className="text-red-500 text-center">Error loading task status data.</p>;

  const { statusBreakdown } = data.getTaskStatusBreakdown;
  const chartData = Object.entries(statusBreakdown)
    .map(([status, count]) => ({ status: formatStatus(status), count }))
    .filter((item) => item.count > 0);

  if (chartData.length === 0) {
    return <p className="text-gray-500 text-center">No tasks yet.</p>;
  }

  const totalTasks = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="mb-4 text-xl font-semibold text-gray-800 text-center">📌 Task Status Breakdown</h2>

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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700">
          {totalTasks} Tasks
        </div>
      </div>
    </div>
  );
};

export default TaskStatusPieChart;
