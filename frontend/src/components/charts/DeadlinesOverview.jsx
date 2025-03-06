import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";

const GET_DEADLINES_OVERVIEW = gql`
  query GetOverdueAndUpcomingTasks($projectId: ID!) {
    getOverdueAndUpcomingTasks(projectId: $projectId) {
      overdueTasks {
        taskId
        title
        dueDate
      }
      upcomingTasks {
        taskId
        title
        dueDate
      }
    }
  }
`;

const DeadlinesOverviewLineChart = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_DEADLINES_OVERVIEW, {
    variables: { projectId },
  });

  if (loading) {
    return <p>Loading deadlines data...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading deadlines data.</p>;
  }

  const transformedData = [
    ...data.getOverdueAndUpcomingTasks.overdueTasks.map(task => ({
      date: dayjs(task.dueDate).format("YYYY-MM-DD"),
      type: "Overdue",
    })),
    ...data.getOverdueAndUpcomingTasks.upcomingTasks.map(task => ({
      date: dayjs(task.dueDate).format("YYYY-MM-DD"),
      type: "Upcoming",
    })),
  ];

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Deadlines Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="type" stroke="#FF0000" name="Overdue Tasks" />
          <Line type="monotone" dataKey="type" stroke="#0088FE" name="Upcoming Tasks" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeadlinesOverviewLineChart;
