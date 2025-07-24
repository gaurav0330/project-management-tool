import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";

import FilterControls from "../../components/TeamLeadComponent/FilterControls";
import WorkloadChart from "../../components/TeamLeadComponent/WorkLoadChart";
import RecentTasks from "../../components/TeamLeadComponent/RecentTask";
import ExportButton from "../../components/TeamLeadComponent/ExportButton";

// ✅ GraphQL query
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
  let teamLeadId = null;

  try {
    const decoded = jwtDecode(token);
    teamLeadId = decoded?.id;
  } catch (err) {
    console.warn("Invalid token");
  }

  const { loading, error, data } = useQuery(GET_TASKS_BY_TEAM_LEAD, {
    variables: { teamLeadId, projectId },
    skip: !teamLeadId,
    fetchPolicy: "cache-and-network",
  });

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (data?.getTasksByTeamLead) {
      // ✅ Filter out unassigned tasks
      const assignedTasks = data.getTasksByTeamLead.filter(
        (task) => task.assignName && task.assignName.trim() !== ""
      );

      setTasks(
        assignedTasks.map((task) => ({
          id: task.id,
          name: task.title,
          assigneeName: task.assignName,
          avatar: "https://randomuser.me/api/portraits/men/1.jpg", // Optional avatar
          dueDate: new Date(parseInt(task.dueDate)).toLocaleDateString(),
          status: task.status,
          priority: task.priority,
        }))
      );
    }
  }, [data]);

  // ✅ Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0";

  // ✅ Workload analysis by member
  const workloadData = tasks.reduce((acc, task) => {
    const name = task.assigneeName;
    const existing = acc.find((item) => item.name === name);
    if (existing) existing.tasks += 1;
    else acc.push({ name, tasks: 1 });
    return acc;
  }, []);

  const highWorkloadUsers = workloadData.filter((u) => u.tasks > 5);
  const hasWorkloadWarning = highWorkloadUsers.length > 0;

  // ✅ Loading & Error UI
  if (loading)
    return <p className="text-center text-muted text-lg my-10">Loading tasks...</p>;
  if (error)
    return <p className="text-center text-error font-semibold text-lg my-10">Error loading data: {error.message}</p>;

  return (
    <motion.main
      className="section-container section-padding card"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="heading-lg text-center mb-6">Task Distribution Dashboard</h1>

      <FilterControls />

      {/* ✅ Stat Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        <motion.div
          className="bg-brand-primary-100 dark:bg-brand-primary-900 text-center py-6 px-4 rounded-xl shadow hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-txt-secondary-light dark:text-txt-secondary-dark text-md font-medium">Total Tasks</h3>
          <p className="text-3xl font-bold text-brand-primary-600 dark:text-brand-primary-400">{totalTasks}</p>
        </motion.div>

        <motion.div
          className="bg-brand-accent-100 dark:bg-brand-accent-900 text-center py-6 px-4 rounded-xl shadow hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-txt-secondary-light dark:text-txt-secondary-dark text-md font-medium">Completed</h3>
          <p className="text-3xl font-bold text-brand-accent-600 dark:text-brand-accent-400">
            {completedTasks} <span className="text-base text-muted">({completionRate}%)</span>
          </p>
        </motion.div>

        <motion.div
          className="bg-red-50 dark:bg-red-900 text-center py-6 px-4 rounded-xl shadow hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-txt-secondary-light dark:text-txt-secondary-dark text-md font-medium">Pending</h3>
          <p className="text-3xl font-bold text-red-500 dark:text-red-400">{pendingTasks}</p>
        </motion.div>
      </div>

      {/* ⚠️ Workload Warning */}
      {hasWorkloadWarning && (
        <motion.section
          className="mt-8 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 p-5 rounded-xl shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠ Workload Imbalance Detected</h2>
          <p className="text-yellow-700 dark:text-yellow-300 mb-2 text-sm">
            The following members have too many tasks assigned:
          </p>
          <ul className="pl-4 list-disc text-yellow-700 dark:text-yellow-300 text-sm">
            {highWorkloadUsers.map((user) => (
              <li key={user.name}>
                <strong>{user.name}</strong> — {user.tasks} tasks
              </li>
            ))}
          </ul>
          <p className="text-sm mt-2">Consider redistributing responsibilities.</p>
        </motion.section>
      )}

      {/* 📊 Charts + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <WorkloadChart data={workloadData} />
        <RecentTasks tasks={tasks} />
      </div>

      {/* 📤 Export Button */}
      <div className="flex justify-end mt-10">
        <ExportButton />
      </div>
    </motion.main>
  );
};

export default TaskDistributionPage;
