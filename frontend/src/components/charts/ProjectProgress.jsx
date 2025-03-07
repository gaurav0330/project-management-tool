import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";

// Skeleton loading styles
const skeletonStyle = {
  width: '100%',
  height: '320px',
  backgroundColor: '#e0e0e0',
  borderRadius: '8px',
  marginBottom: '16px',
};

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

  if (loading) return <div style={skeletonStyle} />; // Skeleton loading effect
  if (error) return <p className="text-red-500 text-center">Error fetching project progress.</p>;

  const { totalTasks, completedTasks, progressPercentage } = data.getProjectProgress;

  // Ensure meaningful data is displayed
  if (totalTasks === 0) {
    return <p className="text-gray-500 text-center">No tasks yet.</p>;
  }

  const remainingTasks = totalTasks - completedTasks;

  // Updated colors to remove blueish effect
  const COLORS = progressPercentage >= 80 ? ["#4CAF50", "#FF5722"] : ["#FFC107", "#FF9800"]; // Green and Orange shades

  const chartData = [
    { name: "Completed", value: completedTasks },
    { name: "Remaining", value: remainingTasks },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg text-center"> {/* Changed to white background */}
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">📊 Project Progress</h2>

      <ResponsiveContainer width="100%" height={320}>
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

      <p className="mt-4 text-xl font-bold text-gray-800">
        {progressPercentage.toFixed(2)}% Completed {/* Show up to 2 decimal points */}
      </p>
    </div>
  );
};

export default ProjectProgress;
