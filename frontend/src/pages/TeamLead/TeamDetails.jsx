import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import TeamSidebar from "../../components/Other/TeamSidebar";
import AssignTasks from "./AssignTaskPage";
import AssignTeamMembers from "./AssignTeamMembersPage";
import TaskManagementPage from "./TaskManagementPage";
import TaskDistributionPage from "./TaskDistributionPage";
import DisplayTeamTaskPage from "./DisplayTeamTaskPage";
import TaskApprovalPageLead from "../TeamLead/TaskApprovalPageLead";
import Footer from "../../components/Other/Footer2";
import ProjectDetailsCard from "../../components/Other/ProjectDeailsCard";

const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    getProjectById(id: $id) {
      id
      title
      description
      status
    }
  }
`;

export default function TeamDetails() {
  const { projectId, teamId} = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
  });

  const [activeComponent, setActiveComponent] = useState("overview");

  // Handle Sidebar Clicks
  const handleSetActiveComponent = (component) => {
    if (component === "projectHome") {
      navigate(`/teamLead/project/${projectId}`);
    } else {
      setActiveComponent(component);
    }
  };

  return ( <div>
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-full min-h-screen bg-white shadow-lg">
        <TeamSidebar setActiveComponent={handleSetActiveComponent} />
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-8 overflow-auto">
        {activeComponent === "createtasks" ? (
          <AssignTasks projectId={projectId} teamId={teamId} />
        ) : activeComponent === "addmembers" ? (
          <AssignTeamMembers />
        ) : activeComponent === "taskDistribution" ? (
          <TaskDistributionPage projectId={projectId} />
        ) : activeComponent === "approvetasks" ? (
          <TaskApprovalPageLead projectId={projectId} />
        ) : activeComponent === "managetasks" ? (
          <TaskManagementPage projectId={projectId} />
        ) : activeComponent === "teamtasks" ? (
          <DisplayTeamTaskPage />
        ) : (
          <>
            {loading ? (
              <p className="text-center text-gray-500">Loading project...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error loading project.</p>
            ) : <ProjectDetailsCard project={data?.getProjectById} loading={loading} />}
          </>
        )}
      </div>
    </div>
   {/* <Footer/> */}
    </div>
  );
}
