import React from 'react'
import ProjectCard from '../../components/projects/ProjectCard'
import KPIWidgets from '../../components/charts/KPIWidgets';
import TaskStatusPieChart from '../../components/projects/TaskStatus';
import BurndownChart from '../../components/charts/BurnDownChart';

const project = {
  name: "Project Alpha",
  status: "In Progress",
  progress: 65,
  deadline: "2023-12-31",
  budget: "10,000",
  lastUpdated: "2023-10-01",
};

const taskStatusData = [
  { name: "To Do", value: 40 },
  { name: "In Progress", value: 30 },
  { name: "Done", value: 30 },
];

const stats = {
  tasksCompleted: 50,
  openIssues: 10,
  sprintVelocity: 30,
};

const burndownData = [
  { name: "Day 1", value: 100 },
  { name: "Day 2", value: 90 },
  { name: "Day 3", value: 80 },
  { name: "Day 4", value: 70 },
  { name: "Day 5", value: 60 },
  { name: "Day 6", value: 50 },
  { name: "Day 7", value: 40 },
];

const AdminDashboard = () => {
  return (
    <>
    <ProjectCard project={project} />
    <KPIWidgets stats={stats} />
    <TaskStatusPieChart data={taskStatusData} />
    <BurndownChart data={burndownData} />
    </>
  )
}

export default AdminDashboard