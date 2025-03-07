import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";

const GET_TASK_HISTORY = gql`
  query GetTaskHistory($taskId: ID!) {
    getTaskHistory(taskId: $taskId) {
      updatedBy
      updatedAt
      oldStatus
      newStatus
    }
  }
`;

const statusColors = {
  "To Do": "#f59e0b",
  "In Progress": "#3b82f6",
  "Needs Revision": "#ef4444",
  "Done": "#10b981",
};

// Skeleton loading styles
const skeletonStyle = {
  width: '100%',
  height: '350px',
  backgroundColor: '#e0e0e0',
  borderRadius: '8px',
  marginBottom: '16px',
};

const TaskStatusTimeline = () => {
  const { loading, error, data } = useQuery(GET_TASK_HISTORY, {
    variables: { taskId: "67c423fd995c5d645cfe97df" },
  });

  if (loading) {
    return (
      <div className="p-6 bg-white text-gray-900 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">📊 Task Status Timeline</h2>
        <div style={skeletonStyle} /> {/* Skeleton for the chart */}
        <div style={skeletonStyle} /> {/* Skeleton for the table */}
      </div>
    );
  }

  if (error) {
    console.error("GraphQL Error:", error);
    return <p className="text-red-500">Error loading task history: {error.message}</p>;
  }

  const transformedData = data.getTaskHistory.map((entry, index) => ({
    index,
    date: dayjs(Number(entry.updatedAt)).format("MMM DD, HH:mm"),
    status: entry.newStatus,
  }));

  return (
    <div className="p-6 bg-white text-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">📊 Task Status Timeline</h2>

      {/* Step Line Chart */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="index"
              tickFormatter={(tick) => transformedData[tick]?.date || ""}
              tick={{ fontSize: 12, fill: "#555" }}
            />
            <YAxis
              dataKey="status"
              type="category"
              tickFormatter={(status) => status}
              allowDuplicatedCategory={false}
              tick={{ fontSize: 12, fill: "#555" }}
            />
            <Tooltip />
            <Line
              type="stepAfter"
              dataKey="status"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, fill: "#6366f1" }}
              activeDot={{ r: 8, fill: "#4f46e5" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status Table */}
      <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-sm font-semibold">📅 Updated At</th>
              <th className="p-4 text-sm font-semibold">📌 New Status</th>
            </tr>
          </thead>
          <tbody>
            {transformedData.map((entry, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                <td className="p-4">{entry.date}</td>
                <td className="p-4">
                  <span
                    className="px-4 py-1 text-white text-sm font-medium rounded-full shadow-md"
                    style={{ backgroundColor: statusColors[entry.status] || "#374151" }}
                  >
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskStatusTimeline;
