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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TaskStatusPieChart = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_TASK_STATUS, {
    variables: { projectId },
  });

  if (loading) {
    return <p>Loading task status data...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading task status data.</p>;
  }

  const { statusBreakdown } = data.getTaskStatusBreakdown;

  const chartData = Object.entries(statusBreakdown).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie data={chartData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TaskStatusPieChart;
