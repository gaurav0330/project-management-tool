import React, { useState } from "react";
import TaskOverview from "../../components/TeamLeadComponent/TaskOverview";
import WorkloadChart from "../../components/TeamLeadComponent/WorkLoadChart";
import RecentTasks from "../../components/TeamLeadComponent/RecentTask";
import FilterControls from "../../components/TeamLeadComponent/FilterControls";
import ExportButton from "../../components/TeamLeadComponent/ExportButton";

const TaskDistributionPage = () => {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Homepage Redesign", assignee: "John Doe", avatar: "https://randomuser.me/api/portraits/men/1.jpg", dueDate: "Mar 25, 2025", status: "Completed", priority: "High" },
    { id: 2, name: "API Integration", assignee: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/2.jpg", dueDate: "Mar 28, 2025", status: "In Progress", priority: "Medium" },
    { id: 3, name: "User Testing", assignee: "Mike Johnson", avatar: "https://randomuser.me/api/portraits/men/3.jpg", dueDate: "Apr 1, 2025", status: "Pending", priority: "Low" },
  ]);

  const workloadData = [
    { name: "John Doe", tasks: 45 },
    { name: "Jane Smith", tasks: 38 },
    { name: "Mike Johnson", tasks: 27 },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Distribution Dashboard</h1>
      <FilterControls />
      <TaskOverview total={248} completed={156} pending={92} />
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
