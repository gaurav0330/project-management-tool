import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaFolder, FaClock, FaCheckCircle, FaTasks } from "react-icons/fa";
import Sidebar from "../../components/Other/sideBar";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard";
import MyTasksPage from "./MyTasksPage";
import TaskSubmissionPage from "./TaskSubmissionMemberPage";
import Footer from "../../components/Other/Footer2"

// GraphQL Query for fetching project by ID
const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    getProjectById(id: $id) {
      id
      title
      description
      startDate
      endDate
      category
      status
    }
  }
`;

export default function TeamMemberDashboardPage() {
  const { projectId } = useParams();

  // Fetch project data from GraphQL
  const { data, loading, error } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
  });

  // Component States
  const [activeComponent, setActiveComponent] = useState("overview");

  if (loading) return <p className="text-center text-gray-500">Loading project details...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching project: {error.message}</p>;

  const project = data?.getProjectById;

  return ( <div>
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/6 min-w-[250px] flex-shrink-0 bg-white shadow-lg">
        <Sidebar setActiveComponent={setActiveComponent} />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8 overflow-auto">
        {activeComponent === "tasks" ? (
          <MyTasksPage />
        ) : activeComponent === "taskSubmission" ? (
          <TaskSubmissionPage />
        ) : (
          <>
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
                  <strong>Start Date:</strong> {project?.startDate}
                </p>
                <p className="flex items-center gap-3">
                  <FaClock className="text-red-600" />
                  <strong>End Date:</strong> {project?.endDate}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
}
