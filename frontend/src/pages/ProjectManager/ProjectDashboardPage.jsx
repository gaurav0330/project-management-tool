import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, gql } from "@apollo/client";
import {jwtDecode} from "jwt-decode";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";
import AssignTasks from "../../components/tasks/AssignTasks";
import CreateProject from "./CreateProjectPage";
import TaskApprovalPage from "./TaskApprovalPage";
import TeamMemberDashboardPage from "../TeamMember/TeamMemberDashboardPage";
import TeamLeadDashboard from "../TeamLead/teamLeadDashboard";
import SkeletonCard from "../../components/UI/SkeletonCard";
import { useWindowSize } from "../../hooks/useWindowSize";

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

// Custom hook for manager authentication
const useManagerAuth = () => {
  const [managerId, setManagerId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.id) {
        setManagerId(decoded.id);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Token decode error:", error);
      setIsAuthenticated(false);
      // Optional: Clear invalid token
      localStorage.removeItem("token");
    }
  }, []);

  return { managerId, isAuthenticated };
};

// Component constants
const COMPONENT_VIEWS = {
  OVERVIEW: "overview",
  ADD_PROJECT: "addproject",
  TASK_APPROVAL: "taskapproval",
  TASKS: "tasks",
  MEMBERS: "members",
  TEAM_MEMBER: "teammember",
  TEAM_LEAD: "teamlead"
};

const PROJECT_STATUS = {
  ALL: "All",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold"
};

export default function ProjectDashboard() {
  const { isDark } = useTheme();
  const { width } = useWindowSize();
  const { managerId, isAuthenticated } = useManagerAuth();

  // Query projects with proper error handling
  const { loading, error, data, refetch } = useQuery(GET_PROJECTS_BY_MANAGER_ID, {
    variables: { managerId },
    skip: !managerId,
    errorPolicy: "all", // Show partial data on error
    notifyOnNetworkStatusChange: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(PROJECT_STATUS.ALL);
  const [activeComponent, setActiveComponent] = useState(COMPONENT_VIEWS.OVERVIEW);

  // Document title and body overflow management
  useEffect(() => {
    document.title = "Project Manager Dashboard";
    return () => {
      document.title = "Project Management System"; // Reset on unmount
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeComponent === COMPONENT_VIEWS.ADD_PROJECT ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [activeComponent]);

  // Memoized projects data
  const projects = useMemo(() => data?.getProjectsByManagerId || [], [data]);

  // Memoized filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === PROJECT_STATUS.ALL || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  // Memoized statistics
  const stats = useMemo(() => [
    {
      label: "Total Projects",
      value: projects.length,
      icon: "📊",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    },
    {
      label: "In Progress",
      value: projects.filter((p) => p.status === PROJECT_STATUS.IN_PROGRESS).length,
      icon: "🚀",
      color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED).length,
      icon: "✅",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    },
   
  ], [projects]);

  // Memoized grid columns class
  const gridColsClass = useMemo(() => {
    if (width >= 1024) return "grid-cols-3"; // lg
    if (width >= 768) return "grid-cols-2"; // md
    return "grid-cols-1";
  }, [width]);

  // Event handlers
  const handleCloseModal = useCallback(() => {
    setActiveComponent(COMPONENT_VIEWS.OVERVIEW);
  }, []);

  const handleOpenCreateProject = useCallback(() => {
    setActiveComponent(COMPONENT_VIEWS.ADD_PROJECT);
  }, []);

  const handleProjectCreated = useCallback(() => {
    refetch(); // Refresh projects list
    handleCloseModal();
  }, [refetch, handleCloseModal]);

  // Loading state
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary-500 mx-auto mb-4"></div>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark flex items-center justify-center">
        <div className="text-center py-40">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Unauthorized Access</h2>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
            Please log in to access the Project Manager Dashboard.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark flex items-center justify-center">
        <div className="text-center py-40">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Projects</h2>
          <p className="text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
            {error.message || "An unexpected error occurred"}
          </p>
          <button onClick={() => refetch()} className="btn-primary mr-4">
            Try Again
          </button>
          <button onClick={() => window.location.reload()} className="btn-secondary">
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Render different component views
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case COMPONENT_VIEWS.TASK_APPROVAL:
        return <TaskApprovalPage />;
      case COMPONENT_VIEWS.TASKS:
        return <AssignTasks />;
      case COMPONENT_VIEWS.MEMBERS:
        return <AssignTeamLead />;
      case COMPONENT_VIEWS.TEAM_MEMBER:
        return <TeamMemberDashboardPage />;
      case COMPONENT_VIEWS.TEAM_LEAD:
        return <TeamLeadDashboard />;
      default:
        return null;
    }
  };

  const activeComponentView = renderActiveComponent();
  if (activeComponentView) {
    return activeComponentView;
  }

  return (
    <div
      className={`min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300 relative 
        ${width < 768 ? "px-0" : "px-4 sm:px-6"}`}
    >
      {/* Floating Modal */}
      <AnimatePresence>
        {activeComponent === COMPONENT_VIEWS.ADD_PROJECT && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              className="relative w-full max-w-3xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <CreateProject 
                onClose={handleCloseModal} 
                onProjectCreated={handleProjectCreated}
              />
              <button
                className="absolute top-4 right-4 text-xl text-txt-secondary-light dark:text-txt-secondary-dark hover:text-red-500 transition-colors duration-200 z-10"
                onClick={handleCloseModal}
                aria-label="Close create project modal"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Content */}
      <div className={`max-w-[1400px] mx-auto ${width < 768 ? "px-0" : "px-4 sm:px-6"} py-4`}>
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-3 mb-6">
            <span className="self-start inline-flex items-center gap-2 px-4 py-1 text-xs font-medium rounded-full bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300">
              👨‍💼 Project Manager Panel
            </span>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl lg:text-4xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                  Project Manager Dashboard
                </h1>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-base max-w-lg">
                  Manage your projects, teams, and workflow — efficiently.
                </p>
              </div>
              <button
                onClick={handleOpenCreateProject}
                className="btn-primary flex items-center gap-2 whitespace-nowrap hover:scale-105 transition-transform duration-200"
                aria-label="Create new project"
              >
                ➕ New Project
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          role="list"
          aria-label="Project statistics"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 border ${stat.color} flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
              role="listitem"
            >
              <div className="text-3xl" aria-hidden="true">{stat.icon}</div>
              <div>
                <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </motion.div>

        {/* Project Cards Grid */}
        <motion.div
          className={`grid ${gridColsClass} gap-6 mt-8`}
          role="list"
          aria-label="Projects list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {loading ? (
            Array(6)
              .fill()
              .map((_, i) => <SkeletonCard key={i} />)
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-20" role="alert" aria-live="polite">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-6xl mb-4" aria-hidden="true">
                  📋
                </div>
                <p className="text-txt-secondary-light dark:text-txt-secondary-dark text-lg mb-4">
                  {searchTerm || statusFilter !== PROJECT_STATUS.ALL
                    ? "No projects match your current filters."
                    : "No projects found. Create your first project to get started!"}
                </p>
                {!searchTerm && statusFilter === PROJECT_STATUS.ALL && (
                  <button
                    onClick={handleOpenCreateProject}
                    className="btn-primary hover:scale-105 transition-transform duration-200"
                  >
                    ➕ Create First Project
                  </button>
                )}
                {(searchTerm || statusFilter !== PROJECT_STATUS.ALL) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter(PROJECT_STATUS.ALL);
                    }}
                    className="btn-secondary hover:scale-105 transition-transform duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                role="listitem"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}