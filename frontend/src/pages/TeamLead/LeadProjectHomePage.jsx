import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Other/sideBar";
import AssignMembers from "../../components/TeamLeadComponent/AssignMembers";
import AssignedTasks from "../../components/tasks/AssignedTasks";
import TaskManagementPage from "./TaskManagementPage";
import TaskDistributionPage from "./TaskDistributionPage";
import DisplayTeamTaskPage from "./DisplayTeamTaskPage"
import TaskApprovalPage from "../ProjectManager/TaskApprovalPage";
import { act } from "react";
import AssignTeamMembers from "./AssignTeamMembersPage";
import CreateTeam from "./CreateTeam";
import MyTeams from "./MyTeams";
import AssignTasks from "./AssignTaskPage";

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

export default function ProjectDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
  });
  const [activeComponent, setActiveComponent] = useState("overview");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-full min-h-screen bg-white shadow-lg">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>

      {/* Main Content Area */}
      <div className="w-4/5 p-8 overflow-auto">
        { activeComponent === "projectHome" ? (  
          window.location.reload()
         ) 
        :
        activeComponent === "createteam" ? (
          <CreateTeam />
        ) :
        // activeComponent === "overview" ? (
        //   navigate('/teamleaddashboard')
        // ) :
        activeComponent === "approvetask" ? (
          <TaskApprovalPage />
        ) :
        activeComponent === "addmembers" ? (
          <AssignTeamMembers />
        )
        : activeComponent === "CreateTask" ? (
          <AssignTasks/>
        ) :
        activeComponent === "myteams" ? (
          <MyTeams />
        ) :
        activeComponent === "assignedTasks" ? (
          <AssignedTasks />
        ):
        activeComponent === "taskDistribution" ? (
          <TaskDistributionPage />
        ) : activeComponent === "tasks" ? (
          <TaskManagementPage />
        ) :
        activeComponent === "teamtasks" ? (
          <DisplayTeamTaskPage />
        ) :
        (
          <>
            {loading ? (
              <p className="text-center text-gray-500">Loading project...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error loading project.</p>
            ) : (
              <div>
                <h1 className="mb-4 text-2xl font-bold">{data.getProjectById.title}</h1>
                <p className="mb-2 text-gray-700">{data.getProjectById.description}</p>
                <p className="text-sm font-semibold text-gray-500">Status: {data.getProjectById.status}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
