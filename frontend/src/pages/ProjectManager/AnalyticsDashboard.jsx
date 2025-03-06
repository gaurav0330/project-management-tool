import React from "react";
import ProjectProgress from "../../components/charts/ProjectProgress";
import TaskStatusPieChart from "../../components/charts/TaskStatus";
import TeamPerformance from "../../components/charts/TeamPerformance";
import TaskDistribution from "../../components/charts/TaskAssignment";
import DeadlinesOverview from "../../components/charts/DeadlinesOverview";
import IssuesList from "../../components/charts/IssuesList";


const AnalyticsDashboard = ({ projectId }) => {
  return (
    <div className="grid min-h-screen grid-cols-2 gap-6 p-6 bg-gray-100">
      {/* Top Row */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <ProjectProgress projectId={projectId} />
      </div>
      <div className="mt-2 bg-white rounded-lg shadow-md"> 
        <TaskStatusPieChart projectId={projectId} />
      </div>

      {/* Middle Row */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <TeamPerformance projectId={projectId} />
      </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <TaskDistribution projectId={projectId} />
      </div>

      {/* Bottom Row */}
      <div className="col-span-2 p-4 bg-white rounded-lg shadow-md">
        <DeadlinesOverview projectId={projectId} />
      </div>
      <div className="col-span-2 p-4 bg-white rounded-lg shadow-md">
        <IssuesList projectId={projectId} />
      </div>
      <div className="col-span-2 p-4 bg-white rounded-lg shadow-md">
        {/* <GanttChart projectId={projectId} /> */}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
