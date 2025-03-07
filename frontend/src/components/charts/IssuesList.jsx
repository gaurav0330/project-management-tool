import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid 
} from "recharts";
import { useQuery, gql } from "@apollo/client";

// GraphQL Query
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

// Colors for different statuses
const STATUS_COLORS = {
  Open: "bg-red-500 text-white",
  "In Progress": "bg-yellow-500 text-white",
  Resolved: "bg-green-500 text-white",
};

// Skeleton loader styles
const skeletonStyle = {
  width: "100%",
  height: "300px",
  backgroundColor: "#e0e0e0",
  borderRadius: "8px",
  marginBottom: "16px",
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

  // Transform data to count issues by status
  const statusCounts = data.getProjectIssues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {});

  // Create bar chart data
  const chartData = Object.keys(statusCounts).map(status => ({
    status,
    count: statusCounts[status],
  }));

  // Total Issues
  const totalIssues = data.getProjectIssues.length;

  // Calculate percentage distribution
  const percentageData = Object.keys(statusCounts).map(status => ({
    status,
    percentage: ((statusCounts[status] / totalIssues) * 100).toFixed(2),
  }));

  // Most Frequent Assignee
  const assigneeCount = data.getProjectIssues.reduce((acc, issue) => {
    acc[issue.assignedTo] = (acc[issue.assignedTo] || 0) + 1;
    return acc;
  }, {});

  const mostFrequentAssignee = Object.keys(assigneeCount).reduce((a, b) =>
    assigneeCount[a] > assigneeCount[b] ? a : b
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Summary Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">📊 Issues Summary</h2>
        <p className="text-lg font-medium">Total Issues: <span className="font-bold text-blue-600">{totalIssues}</span></p>
        <ul className="mt-2 text-gray-700">
          {percentageData.map((item) => (
            <li key={item.status} className="mt-1">
              {item.status}: <span className="font-bold">{item.percentage}%</span> ({statusCounts[item.status]} issues)
            </li>
          ))}
        </ul>
        <p className="mt-2 text-lg font-medium">
          Most Frequent Assignee: <span className="font-bold text-purple-600">{mostFrequentAssignee}</span>
        </p>
      </div>

      {/* Issues Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">🚀 Issues List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg shadow">
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
                  className="border border-gray-300 hover:bg-gray-50 transition duration-200 ease-in-out"
                >
                  <td className="px-4 py-2 border border-gray-300">{issue.title}</td>
                  <td className="px-4 py-2 border border-gray-300">{issue.assignedTo}</td>
                  <td className={`px-4 py-2 border border-gray-300 font-semibold ${STATUS_COLORS[issue.status] || "bg-gray-300"}`}>
                    {issue.status}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{issue.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issues Bar Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">📊 Issues Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar dataKey="count" fill="#FF8042" name="Issue Count" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IssuesList;
