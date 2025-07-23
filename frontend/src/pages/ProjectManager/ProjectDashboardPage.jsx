import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";
import AssignTasks from "../../components/tasks/AssignTasks";
import CreateProjectPage from "./CreateProjectPage";
import TaskApprovalPage from "./TaskApprovalPage";
import TeamMemberDashboardPage from "../TeamMember/TeamMemberDashboardPage";
import TeamLeadDashboard from "../TeamLead/teamLeadDashboard";
import SkeletonCard from "../../components/UI/SkeletonCard";

// Function to get managerId from the token
const getManagerIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

// GraphQL Query to Fetch Projects by Manager ID
const GET_PROJECTS_BY_MANAGER_ID = gql`
  query GetProjectsByManagerId($managerId: ID!) {
    getProjectsByManagerId(managerId: $managerId) {
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

export default function ProjectDashboard() {
  const { isDark } = useTheme();
  const managerId = getManagerIdFromToken();

  const { loading, error, data } = useQuery(GET_PROJECTS_BY_MANAGER_ID, {
    variables: { managerId },
    skip: !managerId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeComponent, setActiveComponent] = useState("overview");

  useEffect(() => {
    document.title = "Project Manager Dashboard";
  }, []);

  if (!managerId) {
    return (
      <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-heading text-2xl font-bold mb-2 text-heading-primary-light dark:text-heading-primary-dark">
            Unauthorized Access
          </h2>
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
            No valid token found. Please login again.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="font-heading text-2xl font-bold mb-2 text-heading-primary-light dark:text-heading-primary-dark">
            Error Loading Projects
          </h2>
          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
            There was an issue loading your projects. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const projects = data?.getProjectsByManagerId || [];

  // Filter projects based on search and status
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  // Quick stats
  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: "📊",
      color: "brand-primary",
    },
    {
      label: "Active Projects",
      value: projects.filter((p) => p.status === "In Progress").length,
      icon: "🚀",
      color: "brand-secondary",
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === "Completed").length,
      icon: "✅",
      color: "brand-accent",
    },
    {
      label: "Pending",
      value: projects.filter((p) => p.status === "Pending").length,
      icon: "⏳",
      color: "warning",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      {activeComponent === "addproject" ? (
        <CreateProjectPage />
      ) : activeComponent === "taskapproval" ? (
        <TaskApprovalPage />
      ) : activeComponent === "tasks" ? (
        <AssignTasks />
      ) : activeComponent === "members" ? (
        <AssignTeamLead />
      ) : activeComponent === "teammember" ? (
        <TeamMemberDashboardPage />
      ) : activeComponent === "teamlead" ? (
        <TeamLeadDashboard />
      ) : (
        <div className="px-4 sm:px-6 py-4">
          {/* Header Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl lg:text-4xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                  Project Manager Dashboard
                </h1>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-lg">
                  Manage your projects, track progress, and oversee your team's
                  work
                </p>
              </div>

              <button
                onClick={() => setActiveComponent("addproject")}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Project
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl p-6 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl flex gap-4 items-center overflow-hidden transition-all duration-300"
              >
                {/* Floating Icon */}
                <div className="relative w-14 h-14 shrink-0 z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary-100 to-brand-secondary-100 dark:from-brand-primary-900/20 dark:to-brand-secondary-900/20 rounded-full blur-sm"></div>
                  <div className="relative w-full h-full rounded-full bg-white dark:bg-bg-secondary-dark text-2xl flex items-center justify-center shadow-inner">
                    {stat.icon}
                  </div>
                </div>

                {/* Stat Content */}
                <div>
                  <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark mb-1">
                    {stat.label}
                  </p>
                  <p className="font-heading text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filter Section */}
          <motion.div
            className="card mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-4">
              Filter Projects
            </h3>
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </motion.div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                Your Projects ({filteredProjects.length})
              </h3>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark hover:bg-brand-primary-100 dark:hover:bg-brand-primary-900/30 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button className="p-2 rounded-lg bg-bg-accent-light dark:bg-bg-accent-dark text-txt-primary-light dark:text-txt-primary-dark hover:bg-brand-primary-100 dark:hover:bg-brand-primary-900/30 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-8xl mb-4 opacity-20">📁</div>
                <h3 className="font-heading text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                  No Projects Found
                </h3>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-6">
                  {searchTerm || statusFilter !== "All"
                    ? "Try adjusting your filters to see more projects"
                    : "Get started by creating your first project"}
                </p>
                <button
                  onClick={() => setActiveComponent("addproject")}
                  className="btn-primary"
                >
                  Create Your First Project
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
