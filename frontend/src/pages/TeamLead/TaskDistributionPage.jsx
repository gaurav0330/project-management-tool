import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import TaskOverview from "../../components/TeamLeadComponent/TaskOverview";
import WorkloadChart from "../../components/TeamLeadComponent/WorkLoadChart";
import RecentTasks from "../../components/TeamLeadComponent/RecentTask";
import FilterControls from "../../components/TeamLeadComponent/FilterControls";
import ExportButton from "../../components/TeamLeadComponent/ExportButton";
import { motion } from "framer-motion";

const GET_TASKS_BY_TEAM_LEAD = gql`
  query GetTasksByTeamLead($teamLeadId: ID!, $projectId: ID!) {
    getTasksByTeamLead(teamLeadId: $teamLeadId, projectId: $projectId) {
      id
      title
      assignedTo
      status
      priority
      dueDate
      assignName
    }
  }
`;

const TaskDistributionPage = ({ projectId }) => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const teamLeadId = decodedToken?.id || null;

  const { loading, error, data } = useQuery(GET_TASKS_BY_TEAM_LEAD, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId,
  });

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (data && data.getTasksByTeamLead) {
      setTasks(
        data.getTasksByTeamLead.map((task) => ({
          id: task.id,
          name: task.title,
          assignee: task.assignName || "Unassigned",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          dueDate: new Date(parseInt(task.dueDate)).toDateString(),
          status: task.status,
          priority: task.priority,
        }))
      );
    }
  }, [data]);

  const workloadData = tasks.reduce((acc, task) => {
    const assignee = task.assignee || "Unassigned";
    const existing = acc.find((item) => item.name === assignee);
    if (existing) {
      existing.tasks += 1;
    } else {
      acc.push({ name: assignee, tasks: 1 });
    }
    return acc;
  }, []);

  const highWorkloadUsers = workloadData.filter((user) => user.tasks > 5);
  const workloadWarning = highWorkloadUsers.length > 0;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const completionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  if (loading) return <p className="text-center text-gray-500">Loading tasks...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching tasks!</p>;

  return (
    <motion.div 
      className="p-6 max-w-6xl mx-auto border-2 border-gray-300 rounded-lg shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Task Distribution Dashboard</h1>
      <FilterControls />

      <motion.div className="grid grid-cols-3 gap-4 mt-6">
        <motion.div className="bg-blue-100 p-4 rounded-lg shadow-md text-center" whileHover={{ scale: 1.1 }}>
          <h2 className="text-lg font-semibold text-blue-800">Total Tasks</h2>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </motion.div>
        <motion.div className="bg-green-100 p-4 rounded-lg shadow-md text-center" whileHover={{ scale: 1.1 }}>
          <h2 className="text-lg font-semibold text-green-800">Completed</h2>
          <p className="text-2xl font-bold">{completedTasks} ({completionRate}%)</p>
        </motion.div>
        <motion.div className="bg-red-100 p-4 rounded-lg shadow-md text-center" whileHover={{ scale: 1.1 }}>
          <h2 className="text-lg font-semibold text-red-800">Pending</h2>
          <p className="text-2xl font-bold">{totalTasks - completedTasks}</p>
        </motion.div>
      </motion.div>

      {workloadWarning && (
        <motion.div className="mt-6 bg-yellow-100 p-4 rounded-lg border border-yellow-400 text-yellow-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold">⚠ Workload Imbalance Detected!</h2>
          <p>
            The following team members have too many tasks assigned:
            <ul className="list-disc pl-6">
              {highWorkloadUsers.map((user) => (
                <li key={user.name}><strong>{user.name}</strong> - {user.tasks} tasks</li>
              ))}
            </ul>
          </p>
          <p className="mt-2">Consider redistributing tasks for better efficiency.</p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-6 mt-6">
        <WorkloadChart data={workloadData} />
        <RecentTasks tasks={tasks} />
      </div>

      <div className="flex justify-end mt-6">
        <ExportButton />
      </div>
    </motion.div>
  );
};

export default TaskDistributionPage;
