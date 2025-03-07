import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";

// Skeleton loading styles
const skeletonStyle = {
  width: "100%",
  height: "320px",
  backgroundColor: "#e0e0e0",
  borderRadius: "8px",
  marginBottom: "16px",
};

// GraphQL Query to Fetch Progress Data
const GET_PROJECT_PROGRESS = gql`
  query getProjectProgress($projectId: ID!) {
    getProjectProgress(projectId: $projectId) {
      totalTasks
      completedTasks
      progressPercentage
    }
  }
`;

const ProjectProgress = ({ projectId }) => {
  const { data, loading, error } = useQuery(GET_PROJECT_PROGRESS, {
    variables: { projectId },
  });

  if (loading) return <div style={skeletonStyle} />; 
  if (error) return <p className="text-red-500 text-center">Error fetching project progress.</p>;

  const { totalTasks, completedTasks, progressPercentage } = data.getProjectProgress;

  if (totalTasks === 0) {
    return <p className="text-gray-500 text-center">No tasks yet.</p>;
  }

  const remainingTasks = totalTasks - completedTasks;
  const COLORS = ["#4CAF50", "#FF5722"]; // Green for Completed, Orange for Remaining

  const chartData = [
    { name: "Completed", value: completedTasks },
    { name: "Remaining", value: remainingTasks },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg text-center border border-gray-200">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">📊 Project Progress</h2>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
            paddingAngle={3}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="text-lg font-medium text-gray-700">Progress: {progressPercentage.toFixed(2)}%</div>
        <div className="w-full h-4 bg-gray-300 rounded-full mt-2">
          <div
            className="h-4 rounded-full transition-all duration-500"
            style={{
              width: `${progressPercentage}%`,
              backgroundColor: progressPercentage >= 80 ? "#4CAF50" : "#FF9800",
            }}
          />
        </div>
      </div>

      {/* Numerical Data */}
      <div className="flex justify-between mt-6 text-gray-700 text-lg font-semibold">
        <div>
          ✅ Completed: <span className="text-green-600">{completedTasks}</span>
        </div>
        <div>
          ⏳ Remaining: <span className="text-orange-600">{remainingTasks}</span>
        </div>
        <div>
          📌 Total: <span className="text-blue-600">{totalTasks}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;
