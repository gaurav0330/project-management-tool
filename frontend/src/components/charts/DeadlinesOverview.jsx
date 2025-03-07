import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";

const GET_DEADLINES_OVERVIEW = gql`
  query GetOverdueAndUpcomingTasks($projectId: ID!) {
    getOverdueAndUpcomingTasks(projectId: $projectId) {
      overdueTasks {
        taskId
        title
        dueDate
        assignedTo
      }
      upcomingTasks {
        taskId
        title
        dueDate
        assignedTo
      }
    }
  }
`;

const skeletonStyle = {
  width: '100%',
  height: '300px',
  backgroundColor: '#e0e0e0',
  borderRadius: '8px',
  marginBottom: '16px',
};

const DeadlinesOverview = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_DEADLINES_OVERVIEW, {
    variables: { projectId },
  });

  if (loading) {
    return (
      <div className="p-6 bg-white text-gray-900 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Deadlines Overview</h2>
        <div style={skeletonStyle} />
        <div style={skeletonStyle} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading deadlines data.</p>;
  }

  const overdueTasks = data.getOverdueAndUpcomingTasks.overdueTasks;
  const upcomingTasks = data.getOverdueAndUpcomingTasks.upcomingTasks;

  // Total Task Count
  const totalTasks = overdueTasks.length + upcomingTasks.length;

  // Average Overdue Days Calculation
  const today = dayjs();
  const totalOverdueDays = overdueTasks.reduce((sum, task) => sum + today.diff(dayjs(task.dueDate), "day"), 0);
  const avgOverdueDays = overdueTasks.length ? (totalOverdueDays / overdueTasks.length).toFixed(1) : 0;

  // Closest Upcoming Deadline
  const sortedUpcoming = [...upcomingTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const nextDeadline = sortedUpcoming.length ? dayjs(sortedUpcoming[0].dueDate).format("YYYY-MM-DD") : "N/A";

  // Transform data for Bar Chart
  const groupedData = {};
  [...overdueTasks, ...upcomingTasks].forEach((task) => {
    const date = dayjs(task.dueDate).format("YYYY-MM-DD");
    if (!groupedData[date]) {
      groupedData[date] = { date, Overdue: 0, Upcoming: 0 };
    }
    groupedData[date][overdueTasks.includes(task) ? "Overdue" : "Upcoming"] += 1;
  });

  const chartData = Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="p-6 bg-white text-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Deadlines Overview</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-200 text-center rounded-lg">
          <h3 className="text-lg font-semibold">📌 Total Tasks</h3>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        <div className="p-4 bg-red-200 text-center rounded-lg">
          <h3 className="text-lg font-semibold">❌ Overdue Tasks</h3>
          <p className="text-2xl font-bold">{overdueTasks.length}</p>
        </div>
        <div className="p-4 bg-blue-200 text-center rounded-lg">
          <h3 className="text-lg font-semibold">⏳ Upcoming Tasks</h3>
          <p className="text-2xl font-bold">{upcomingTasks.length}</p>
        </div>
        <div className="p-4 bg-yellow-200 text-center rounded-lg">
          <h3 className="text-lg font-semibold">⌛ Avg. Overdue Days</h3>
          <p className="text-2xl font-bold">{avgOverdueDays} days</p>
        </div>
        <div className="p-4 bg-green-200 text-center rounded-lg">
          <h3 className="text-lg font-semibold">🔜 Next Deadline</h3>
          <p className="text-2xl font-bold">{nextDeadline}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Overdue" fill="#FF0000" name="Overdue Tasks" />
            <Bar dataKey="Upcoming" fill="#0088FE" name="Upcoming Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Task List Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg border border-gray-300">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 border-b text-left">Task ID</th>
              <th className="p-3 border-b text-left">Title</th>
              <th className="p-3 border-b text-left">Due Date</th>
              <th className="p-3 border-b text-left">Assigned To</th>
              <th className="p-3 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {[...overdueTasks, ...upcomingTasks].map((task) => (
              <tr
                key={task.taskId}
                className="border-t border-gray-300 hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                <td className="p-3">{task.taskId}</td>
                <td className="p-3">{task.title}</td>
                <td className="p-3">{dayjs(task.dueDate).format("YYYY-MM-DD")}</td>
                <td className="p-3">{task.assignedTo}</td>
                <td className={`p-3 font-semibold ${overdueTasks.includes(task) ? "text-red-600" : "text-green-600"}`}>
                  {overdueTasks.includes(task) ? "Overdue" : "Upcoming"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeadlinesOverview;
