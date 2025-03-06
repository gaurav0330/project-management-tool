import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery, gql } from "@apollo/client";

const GET_PROJECT_ISSUES = gql`
  query GetProjectIssues($projectId: ID!) {
    getProjectIssues(projectId: $projectId) {
      taskId
      title
      assignedTo
      status
      remarks
    }
  }
`;

const IssuesList = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_PROJECT_ISSUES, {
    variables: { projectId },
  });

  if (loading) {
    return <p>Loading issues data...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading issues data.</p>;
  }

  const transformedData = data.getProjectIssues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(transformedData).map(status => ({
    status,
    count: transformedData[status],
  }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Issues Table */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Issues List</h2>
        <table className="min-w-full border border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300">Title</th>
              <th className="px-4 py-2 border border-gray-300">Assigned To</th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {data.getProjectIssues.map(issue => (
              <tr key={issue.taskId} className="border border-gray-300">
                <td className="px-4 py-2 border border-gray-300">{issue.title}</td>
                <td className="px-4 py-2 border border-gray-300">{issue.assignedTo}</td>
                <td className="px-4 py-2 border border-gray-300">{issue.status}</td>
                <td className="px-4 py-2 border border-gray-300">{issue.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Issues Bar Chart */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Issues Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#FF8042" name="Issue Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IssuesList;
