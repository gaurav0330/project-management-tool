import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList 
} from "recharts";
import { useQuery, gql } from "@apollo/client";

// GraphQL Query
const GET_TEAM_PERFORMANCE = gql`
  query GetTeamPerformance($projectId: ID!) {
    getTeamPerformance(projectId: $projectId) {
      teamId
      teamName
      totalTasksAssigned
      completedTasks
      completionRate
    }
  }
`;

// Colors for the bars
const COLORS = {
  total: "#4CAF50", // Green - Total Tasks
  completed: "#FF9800", // Orange - Completed Tasks
};

// Skeleton Loader
const skeletonStyle = {
  width: "100%",
  height: "350px",
  backgroundColor: "#e0e0e0",
  borderRadius: "8px",
  marginBottom: "16px",
};

const TeamPerformanceBarChart = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_TEAM_PERFORMANCE, {
    variables: { projectId },
  });

  if (loading) return <div style={skeletonStyle} />; // Skeleton loading effect
  if (error) return <p className="text-red-500 text-center">Error loading team performance data.</p>;

  const teams = data?.getTeamPerformance || [];

  if (teams.length === 0) {
    return <p className="text-gray-500 text-center">No team performance data available.</p>;
  }

  // Get max tasks for proper Y-axis scaling
  const maxTasks = Math.max(...teams.map(team => team.totalTasksAssigned), 10);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="mb-4 text-xl font-semibold text-gray-800 text-center">📊 Team Performance Overview</h2>

      {/* First Row: Bar Chart + Numerical Breakdown */}
      <div className="flex flex-wrap md:flex-nowrap gap-6">
        {/* Bar Chart (Left Side) */}
        <div className="w-full md:w-1/2">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={teams} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="teamName" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, maxTasks]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value, name) => (name === "Completion Rate (%)" ? `${value.toFixed(2)}%` : value)} />
              <Legend wrapperStyle={{ fontSize: "14px" }} />

              {/* Total Tasks Bar */}
              <Bar dataKey="totalTasksAssigned" fill={COLORS.total} name="Total Tasks">
                <LabelList dataKey="totalTasksAssigned" position="top" />
              </Bar>

              {/* Completed Tasks Bar */}
              <Bar dataKey="completedTasks" fill={COLORS.completed} name="Completed Tasks">
                <LabelList dataKey="completedTasks" position="top" />
                <LabelList dataKey="completionRate" position="insideTop" formatter={(val) => `${val}%`} fill="white" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Numerical Breakdown (Right Side) */}
        <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div key={team.teamId} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">{team.teamName}</h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-gray-700 font-medium">Total Tasks:</span>
                <span className="text-gray-900 font-bold">{team.totalTasksAssigned}</span>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-gray-700 font-medium">Completed Tasks:</span>
                <span className="text-gray-900 font-bold">{team.completedTasks}</span>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-gray-700 font-medium">Completion Rate:</span>
                <span className="text-gray-900 font-bold">{team.completionRate.toFixed(2)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${team.completionRate}%`,
                    backgroundColor: COLORS.completed,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPerformanceBarChart;

