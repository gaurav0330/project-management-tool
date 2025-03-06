import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useQuery, gql } from "@apollo/client";

const GET_PROJECT_PROGRESS = gql`
  query getProjectProgress($projectId: ID!) {
    getProjectProgress(projectId: $projectId) {
      totalTasks
      completedTasks
      progressPercentage
    }
  }
`;

const COLORS = ["#00C49F", "#FFBB28"];

const ProjectProgress = ({ projectId }) => {
  const { data, loading, error } = useQuery(GET_PROJECT_PROGRESS, {
    variables: { projectId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching project progress</p>;

  const completed = data.getProjectProgress.completedTasks;
  const remaining = data.getProjectProgress.totalTasks - completed;

  const chartData = [
    { name: "Completed", value: completed },
    { name: "Remaining", value: remaining },
  ];

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl">
      <h2 className="mb-2 text-xl font-semibold">Project Progress</h2>
      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <p className="text-lg font-bold text-center">
        {data.getProjectProgress.progressPercentage}% Completed
      </p>
    </div>
  );
};

export default ProjectProgress;