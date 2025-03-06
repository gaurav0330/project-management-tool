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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-full min-h-screen bg-white shadow-lg">
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
          activeComponent === "assignedTasks" ? (
            <AssignedTasks />
          ) :
            activeComponent === "projectHome" ? (
              window.location.reload()
            )
              : (
                <>
                  {/* {loading ? (
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
             */}



                  <motion.h2
                    className="mb-6 text-4xl font-extrabold text-gray-900"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaTasks className="inline-block mr-2 text-blue-600" />
                    {project?.title || "Project Details"}
                  </motion.h2>
                  <motion.div
                    className="p-8 bg-white shadow-xl rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="mb-4 text-xl text-gray-800">{project?.description}</p>
                    <div className="mt-6 space-y-4 text-gray-700">
                      <p className="flex items-center gap-3">
                        <FaFolder className="text-blue-600" />
                        <strong>Category:</strong> {project?.category}
                      </p>
                      <p className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-600" />
                        <strong>Status:</strong> {project?.status}
                      </p>
                      <p className="flex items-center gap-3">
                        <FaCalendarAlt className="text-purple-600" />
                        <strong>Start Date:</strong> {project?.startDate.split("T")[0]}
                      </p>
                      <p className="flex items-center gap-3">
                        <FaClock className="text-red-600" />
                        <strong>End Date:</strong> {project?.endDate.split("T")[0]}
                      </p>
                    </div>
                  </motion.div> </>

        )}
                </div>
      </div>
      );
}
