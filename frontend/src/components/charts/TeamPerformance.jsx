import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LabelList 
} from "recharts";
import { useQuery, gql } from "@apollo/client";

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

// Updated colors for better visibility
const COLORS = {
  total: "#4CAF50", // Green for Total Tasks
  completed: "#FF9800", // Orange for Completed Tasks
};

// Skeleton loading styles
const skeletonStyle = {
  width: '100%',
  height: '350px',
  backgroundColor: '#e0e0e0',
  borderRadius: '8px',
  marginBottom: '16px',
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

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={teams} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="teamName" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, maxTasks]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value, name) => name === "Completion Rate (%)" ? `${value}%` : value} />
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
  );
};

export default TeamPerformanceBarChart;
