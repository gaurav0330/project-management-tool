import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";

const GET_TASK_HISTORY = gql`
  query GetTaskHistory($taskId: ID) {
    getTaskHistory(taskId: $taskId) {
      updatedBy
      updatedAt
      oldStatus
      newStatus
    }
  }
`;

const TaskAssignmentStackedBarChart = ({ taskId }) => {
  const { loading, error, data } = useQuery(GET_TASK_HISTORY, {
    variables: { taskId },
  });

  if (loading) {
    return <p>Loading task history data...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading task history data.</p>;
  }

  const transformedData = data.getTaskHistory.reduce((acc, entry) => {
    const date = dayjs(entry.updatedAt).format("YYYY-MM-DD");
    const existingEntry = acc.find(item => item.date === date);
    if (existingEntry) {
      existingEntry[entry.newStatus] = (existingEntry[entry.newStatus] || 0) + 1;
    } else {
      acc.push({ date, [entry.newStatus]: 1 });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(transformedData[0] || {}).filter(key => key !== "date").map((status, index) => (
          <Bar key={index} dataKey={status} stackId="a" fill={`hsl(${index * 60}, 70%, 50%)`} name={status} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TaskAssignmentStackedBarChart; 