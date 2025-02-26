import React, { useState } from "react";
import Sidebar from "../../components/Other/sideBar";
import ProjectOverview from "../../components/dashboard/ProjectOverview";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";
import AssignTasks from "../../components/tasks/AssignTasks";
import CreateProjectPage from '../../pages/ProjectManager/CreateProjectPage';
import TaskApprovalPage from "./TaskApprovalPage";
import TeamMemberDashboardPage from "../TeamMember/teamMemberDashboardPage";
import TeamLeadDashboard from "../../pages/TeamLead/TeamLeadDashboard";

const ProjectDashboard = () => {
  // State to track the active component
  const [activeComponent, setActiveComponent] = useState("overview");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0 w-64">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeComponent === "addproject" && <CreateProjectPage/>}
        {activeComponent === "taskapproval" && <TaskApprovalPage/>}
        {activeComponent === "overview" && <ProjectOverview />}
        {activeComponent === "tasks" && <AssignTasks />}
        {activeComponent === "members" && <AssignTeamLead />}
        {activeComponent === "teammember" && < TeamMemberDashboardPage/>}
        {activeComponent === "teamlead" && <TeamLeadDashboard/>}
      </div>
    </div>
  );
};

export default ProjectDashboard;
