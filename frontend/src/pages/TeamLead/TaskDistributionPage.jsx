import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import {jwtDecode} from "jwt-decode";
import TaskOverview from "../../components/TeamLeadComponent/TaskOverview";
import WorkloadChart from "../../components/TeamLeadComponent/WorkLoadChart";
import RecentTasks from "../../components/TeamLeadComponent/RecentTask";
import FilterControls from "../../components/TeamLeadComponent/FilterControls";
import ExportButton from "../../components/TeamLeadComponent/ExportButton";

const GET_TASKS_BY_TEAM_LEAD = gql`
  query GetTasksByTeamLead($teamLeadId: ID!, $projectId: ID!) {
    getTasksByTeamLead(teamLeadId: $teamLeadId, projectId: $projectId) {
      id
      title
      assignedTo
      status
      priority
      dueDate
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
          assignee: task.assignedTo || "Unassigned",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg", // Replace with actual user data
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

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error fetching tasks!</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Distribution Dashboard</h1>
      <FilterControls />
      <TaskOverview total={tasks.length} completed={tasks.filter((t) => t.status === "Completed").length} pending={tasks.filter((t) => t.status !== "Completed").length} />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <WorkloadChart data={workloadData} />
        <RecentTasks tasks={tasks} />
      </div>
      <div className="flex justify-end mt-4">
        <ExportButton />
      </div>
    </div>
  );
};

export default TaskDistributionPage;
