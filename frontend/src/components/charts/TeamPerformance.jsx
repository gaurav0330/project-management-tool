import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
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

const TeamPerformanceBarChart = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_TEAM_PERFORMANCE, {
    variables: { projectId },
  });

  if (loading) {
    return <p>Loading team performance data...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading team performance data.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data.getTeamPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="teamName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalTasksAssigned" fill="#8884d8" name="Total Tasks" />
        <Bar dataKey="completedTasks" fill="#82ca9d" name="Completed Tasks" />
        <Bar dataKey="completionRate" fill="#ffc658" name="Completion Rate (%)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TeamPerformanceBarChart;
