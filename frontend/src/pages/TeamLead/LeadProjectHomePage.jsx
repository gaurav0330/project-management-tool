import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Other/sideBar";
import AssignTeamMembers from "./AssignTeamMembersPage";
import CreateTeam from "./CreateTeam";
import MyTeams from "./MyTeams";
import AssignTasks from "./AssignTaskPage";
import MyTasks from "../../components/TeamLeadComponent/MyTasks";
import TaskSubmissionPage from "./TaskSubmissionLeadPage";
import TaskManagementPage from "./TaskManagementPage";
import TaskDistributionPage from "./TaskDistributionPage";
import DisplayTeamTaskPage from "./DisplayTeamTaskPage";
import AssignedTasks from "../../components/tasks/AssignedTasks";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaFolder, FaClock, FaCheckCircle, FaTasks } from "react-icons/fa";
import Footer from "../../components/Other/Footer2";
import ProjectDetailsCard from "../../components/Other/ProjectDeailsCard";

const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    getProjectById(id: $id) {
      id
      title
      description
      status
      startDate
      endDate
      category
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

  useEffect(() => {
    if (activeComponent === "projectHome") {
      window.location.reload();
    }
  }, [activeComponent]);

  
  if (error) return <p className="text-center text-red-500">Error fetching project: {error.message}</p>;

  const project = data?.getProjectById;

  return (
    <div>
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 h-full min-h-screen bg-white shadow-lg">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>

      {/* Main Content Area */}
      <div className="w-4/5 p-8 overflow-auto">
        {activeComponent === "createteam" ? (
          <CreateTeam projectId={projectId} />     
        ) : activeComponent === "approvetask" ? (
          <TaskSubmissionPage projectId={projectId}/>
        ) 
        : activeComponent === "myteams" ? (
          <MyTeams />
        ) : activeComponent === "taskDistribution" ? (
          <TaskDistributionPage />
        ) 
        : activeComponent === "mytasks" ? (
          <MyTasks />
        ) : (

            <ProjectDetailsCard project={data?.getProjectById} loading={loading} />
        )}
      </div>
    </div>
    {/* <Footer /> */}
    </div>
  );
}
