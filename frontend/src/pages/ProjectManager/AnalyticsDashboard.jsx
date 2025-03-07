import React from "react";
import ProjectProgress from "../../components/charts/ProjectProgress";
import TaskStatusPieChart from "../../components/charts/TaskStatus";
import TeamPerformance from "../../components/charts/TeamPerformance";
import TaskDistribution from "../../components/charts/TaskAssignment";
import DeadlinesOverview from "../../components/charts/DeadlinesOverview";
import IssuesList from "../../components/charts/IssuesList";

const AnalyticsDashboard = ({ projectId }) => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Dashboard Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Project Analytics</h1>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Row - Project Progress & Task Status Overview */}
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Project Progress</h2>
          <ProjectProgress projectId={projectId} />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Task Status Overview</h2>
          <TaskStatusPieChart projectId={projectId} />
        </div>

        {/* Second Row - Team Performance (Full Width) */}
        <div className="md:col-span-2 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Team Performance</h2>
          <TeamPerformance projectId={projectId} />
        </div>
      </div>

      {/* Keep the rest of the layout as it is */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {/* Task Distribution */}
        <div className="md:col-span-2 xl:col-span-3 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Task Assignment Distribution</h2>
          <TaskDistribution projectId={projectId} />
        </div>

        {/* Deadlines Overview */}
        <div className="md:col-span-2 xl:col-span-3 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Deadlines & Milestones</h2>
          <DeadlinesOverview projectId={projectId} />
        </div>

        {/* Project Issues */}
        <div className="md:col-span-2 xl:col-span-3 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Project Issues</h2>
          <IssuesList projectId={projectId} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
