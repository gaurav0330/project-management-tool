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

// Skeleton loading styles
const skeletonStyle = {
  width: '100%',
  height: '300px',
  backgroundColor: '#e0e0e0',
  borderRadius: '8px',
  marginBottom: '16px',
};

const IssuesList = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_PROJECT_ISSUES, {
    variables: { projectId },
  });

  if (loading) {
    return (
      <div className="p-6 bg-white text-gray-900 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Issues List</h2>
        <div style={skeletonStyle} /> {/* Skeleton for the table */}
        <div style={skeletonStyle} /> {/* Skeleton for the chart */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white text-gray-900 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Issues List</h2>
        <p className="text-red-500">Error loading issues data. Please try again later.</p>
      </div>
    );
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
              <tr
                key={issue.taskId}
                className="border border-gray-300 hover:bg-gray-100 transition duration-200 ease-in-out"
              >
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
