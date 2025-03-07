import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Other/sideBar";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";
import AssignTasks from "../../components/tasks/AssignTasks";
import CreateProjectPage from "../../pages/ProjectManager/CreateProjectPage";
import TaskApprovalPage from "./TaskApprovalPage";
import AssignedTasks from "../../components/tasks/AssignedTasks";
import Mytasks from "../../components/TeamLeadComponent/MyTasks";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaFolder, FaClock, FaCheckCircle, FaTasks } from "react-icons/fa";
import Footer from "../../components/Other/Footer2";


import TeamLeadsList from "./TeamLeadsList";
import TeamMembersList from "./TeamMemberList";
import AnalyticsDashboard from "./AnalyticsDashboard";
import TaskStatusTimeline from "../../components/charts/TaskAssignment";
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

  const project = data?.getProjectById;

  return (
    <div>
    <div 
      className="flex min-h-screen bg-gray-100" 
  
    >
      {/* Sidebar */}
      <div className="w-64 h-full min-h-screen bg-white shadow-lg ">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>

      {/* Main Content Area */}
      <div className="w-4/5 p-8 overflow-auto">
        {activeComponent === "managelead" ? (
          <AssignTeamLead {...{ projectId }} />
        ) : activeComponent === "dashboard" ? (
          navigate("/ProjectDashboard")
        ) : activeComponent === "approvetask" ? (
          <TaskApprovalPage projectId={projectId} />
        ) : activeComponent === "tasks" ? (
          <AssignTasks />
        ) :
          activeComponent === "members" ? (
            <TeamMembersList projectId={projectId}/>
          ) :
          activeComponent === "manageteam" ? (
          <TeamLeadsList projectId={projectId} />
          ) :
          activeComponent === "assignedTasks" ? (
            <AssignedTasks />
          ) :
          activeComponent === "TimeLine" ? (
            <TaskStatusTimeline projectId={projectId} />
          ) :
          activeComponent === "analytics" ? (
            <AnalyticsDashboard projectId={projectId} />
          ) :
            activeComponent === "projectHome" ? (
              window.location.reload()
            )
              : (
                <>
                <ProjectDetailsCard project={project} loading={loading} />
                </>

        )}
                </div>
      </div>

      {/* Footer */}
      <div>
      {/* <Footer /> */}
    </div>
    </div>
  );
}
