import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";
import ProjectCard from "../../components/Other/ProjectCard";
import MyTasksPage from "./MyTasksPage";
import TaskSubmissionPage from "./TaskSubmissionMemberPage";
import SkeletonCard from "../../components/UI/SkeletonCard";
import Sidebar from "../../components/Other/sideBar";
import MobileSidebar from "../../components/Other/MobileSidebar";
import { useResponsive } from "../../hooks/useResponsive";

// ✅ GraphQL Query
const GET_PROJECTS_BY_MEMBER = gql`
  query GetProjectsByMember($memberId: ID!) {
    getProjectsByMember(memberId: $memberId) {
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

const getMemberIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch {
    return null;
  }
};

export default function TeamMemberDashboardPage() {
  const { isDark } = useTheme();
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  const memberId = getMemberIdFromToken();

  const { loading, error, data } = useQuery(GET_PROJECTS_BY_MEMBER, {
    variables: { memberId },
    skip: !memberId,
    fetchPolicy: "network-only",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [activeComponent, setActiveComponent] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    document.title = "Team Member Dashboard";
    document.body.style.overflow =
      activeComponent === "addproject" ? "hidden" : "auto";
  }, [activeComponent]);

  // Mobile-specific handlers
  const handleMobileMenuToggle = () => {
    setShowMobileSidebar((prev) => !prev);
  };

  const handleMobileComponentChange = (component) => {
    setActiveComponent(component);
    setShowMobileSidebar(false);
  };

  // Handle sidebar state change
  const handleSidebarStateChange = (collapsed, hovering) => {
    setSidebarCollapsed(collapsed);
    setIsHovering(hovering);
  };

  // CRITICAL FIX: Expose mobile sidebar handlers to navbar
  useEffect(() => {
    window.projectMobileSidebarHandler = {
      toggle: handleMobileMenuToggle,
      isOpen: showMobileSidebar,
      setShowSidebar: setShowMobileSidebar,
    };

    const handleNavbarMessage = (event) => {
      if (event.data && event.data.type === "TOGGLE_PROJECT_SIDEBAR") {
        setShowMobileSidebar((prev) => !prev);
      }
    };

    window.addEventListener("message", handleNavbarMessage);

    return () => {
      delete window.projectMobileSidebarHandler;
      window.removeEventListener("message", handleNavbarMessage);
    };
  }, [showMobileSidebar]);

  // Calculate layout dimensions
  const getLayoutConfig = () => {
    if (isMobile) {
      return {
        contentMarginLeft: "0",
        contentWidth: "100vw",
        showSidebar: false,
        showMobileSidebar: showMobileSidebar,
      };
    }

    if (isTablet) {
      return {
        contentMarginLeft: sidebarCollapsed && !isHovering ? "4rem" : "12rem",
        contentWidth:
          sidebarCollapsed && !isHovering
            ? "calc(100vw - 4rem)"
            : "calc(100vw - 12rem)",
        showSidebar: true,
        showMobileSidebar: false,
      };
    }

    // Desktop
    const shouldShowFullSidebar = !sidebarCollapsed || isHovering;
    return {
      contentMarginLeft: shouldShowFullSidebar ? "16rem" : "4rem",
      contentWidth: shouldShowFullSidebar
        ? "calc(100vw - 16rem)"
        : "calc(100vw - 4rem)",
      showSidebar: true,
      showMobileSidebar: false,
    };
  };

  const layoutConfig = getLayoutConfig();

  const projects = data?.getProjectsByMember || [];

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  const stats = [
    { label: "Total Projects", value: projects.length, icon: "📊" },
    {
      label: "Active Projects",
      value: projects.filter(
        (p) => p.status === "ACTIVE" || p.status === "IN_PROGRESS"
      ).length,
      icon: "🚀",
    },
    {
      label: "Completed",
      value: projects.filter((p) => p.status === "COMPLETED").length,
      icon: "✅",
    },
  ];

  if (!memberId)
    return <div className="text-center py-40 text-red-500">Unauthorized</div>;
  if (error)
    return (
      <div className="text-center py-40 text-red-500">
        Error loading projects
      </div>
    );

  // Helper function to render active component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "tasks":
        return <MyTasksPage />;
      case "taskSubmission":
        return <TaskSubmissionPage />;
      default:
        return (
          /* Main Dashboard Content */
          <div className={`${isMobile ? "px-3" : "px-4 sm:px-6"} py-4`}>
            <motion.div className="mb-6 lg:mb-8">
              <div className="flex flex-col gap-3 mb-6">
                <span className="self-start inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300">
                  👨‍💻 Team Member Panel
                </span>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1
                      className={`font-heading ${
                        isMobile ? "text-2xl" : "text-3xl lg:text-4xl"
                      } font-bold text-heading-primary-light dark:text-heading-primary-dark`}
                    >
                      Team Member Dashboard
                    </h1>
                    <p
                      className={`font-body text-txt-secondary-light dark:text-txt-secondary-dark ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      View your assigned projects and manage your tasks.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ✅ Stats Cards */}
            <motion.div
              className={`grid gap-4 lg:gap-6 mb-6 lg:mb-8 ${
                isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl ${
                    isMobile ? "p-4" : "p-6"
                  } bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 flex items-center gap-4 shadow-sm hover:scale-105 transition-transform duration-300`}
                >
                  <div className={`${isMobile ? "text-2xl" : "text-3xl"}`}>
                    {s.icon}
                  </div>
                  <div>
                    <p
                      className={`${
                        isMobile ? "text-xs" : "text-sm"
                      } text-txt-secondary-light dark:text-txt-secondary-dark`}
                    >
                      {s.label}
                    </p>
                    <p
                      className={`${
                        isMobile ? "text-lg" : "text-xl"
                      } font-bold text-heading-primary-light dark:text-heading-primary-dark`}
                    >
                      {s.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* ✅ Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`rounded-2xl ${
                isMobile ? "p-4" : "p-6"
              } bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 shadow-sm mb-6 lg:mb-8`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isMobile ? "w-4 h-4" : "w-5 h-5"
                    } text-txt-secondary-light dark:text-txt-secondary-dark`}
                  />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full ${
                      isMobile ? "pl-8 pr-3 py-2.5 text-sm" : "pl-10 pr-4 py-3"
                    } bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all`}
                  />
                </div>

                {/* Filter and View Controls */}
                <div className="flex items-center gap-2 lg:gap-3">
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`${
                      isMobile ? "px-3 py-2.5 text-sm" : "px-4 py-3"
                    } bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all flex-1 min-w-0`}
                  >
                    <option value="All">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-xl p-1 border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`${
                        isMobile ? "p-1.5" : "p-2"
                      } rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-brand-primary-500 text-white shadow-md"
                          : "text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                      }`}
                    >
                      <Grid3X3
                        className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`}
                      />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`${
                        isMobile ? "p-1.5" : "p-2"
                      } rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-brand-primary-500 text-white shadow-md"
                          : "text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                      }`}
                    >
                      <List
                        className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ✅ Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Loading Skeletons */}
              {loading && (
                <div
                  className={`grid gap-4 lg:gap-6 ${
                    viewMode === "grid"
                      ? isMobile
                        ? "grid-cols-1"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {[...Array(6)].map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredProjects.length === 0 && (
                <div
                  className={`rounded-2xl ${
                    isMobile ? "p-8" : "p-16"
                  } bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 shadow-sm text-center`}
                >
                  <div
                    className={`${
                      isMobile ? "text-4xl mb-3" : "text-6xl mb-4"
                    }`}
                  >
                    📋
                  </div>
                  <h3
                    className={`${
                      isMobile ? "text-xl" : "text-2xl"
                    } font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2`}
                  >
                    No projects assigned
                  </h3>
                  <p
                    className={`text-txt-secondary-light dark:text-txt-secondary-dark mb-6 ${
                      isMobile ? "text-sm" : ""
                    }`}
                  >
                    {searchTerm || statusFilter !== "All"
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't been assigned to any projects yet"}
                  </p>
                </div>
              )}

              {/* Projects Grid/List */}
              {!loading && !error && filteredProjects.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`grid gap-4 lg:gap-6 ${
                      viewMode === "grid"
                        ? isMobile
                          ? "grid-cols-1"
                          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ProjectCard
                          project={project}
                          viewMode={viewMode}
                          className={`h-full w-full max-w-full ${
                            isMobile ? "hover:scale-[1.01]" : "hover:scale-105"
                          } transition-transform duration-300 overflow-hidden`}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>

            {/* ✅ Results Summary */}
            {!loading && !error && filteredProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 lg:mt-8 text-center"
              >
                <p
                  className={`text-txt-secondary-light dark:text-txt-secondary-dark ${
                    isMobile ? "text-sm" : ""
                  }`}
                >
                  Showing{" "}
                  <span className="font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                    {filteredProjects.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                    {data?.getProjectsByMember?.length || 0}
                  </span>{" "}
                  projects
                </p>
              </motion.div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      {/* Desktop/Tablet Sidebar */}
      {layoutConfig.showSidebar && (
        <Sidebar
          setActiveComponent={setActiveComponent}
          onStateChange={handleSidebarStateChange}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && layoutConfig.showMobileSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-bg-primary-light dark:bg-bg-primary-dark border-r border-gray-200 dark:border-gray-700 z-50 overflow-y-auto"
            >
              <MobileSidebar
                setActiveComponent={handleMobileComponentChange}
                activeComponent={activeComponent}
                onClose={() => setShowMobileSidebar(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.div
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isDesktop ? layoutConfig.contentMarginLeft : "0",
          width: layoutConfig.contentWidth,
          marginTop: "64px", // Account for fixed navbar
        }}
      >
        <div className="h-full">
          {/* Content Router */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeComponent}
              initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isMobile ? 0 : -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderActiveComponent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
