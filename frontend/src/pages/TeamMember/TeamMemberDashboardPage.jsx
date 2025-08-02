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
  // ✅ FIXED: Added all necessary responsive values
  const { isMobile, isTablet, isDesktop, width, isMobileInDesktopMode } =
    useResponsive();
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

  // ✅ FIXED: Enhanced layout configuration with proper mobile-in-desktop-mode handling
  const getLayoutConfig = () => {
    // ✅ Force desktop behavior for any viewport width >= 1024px (including mobile-in-desktop-mode)
    if (width >= 1024) {
      const shouldShowFullSidebar = !sidebarCollapsed || isHovering;
      return {
        contentMarginLeft: shouldShowFullSidebar ? "16rem" : "4rem",
        contentWidth: shouldShowFullSidebar
          ? "calc(100vw - 16rem)"
          : "calc(100vw - 4rem)",
        showSidebar: true, // ✅ Always true for desktop width
        showMobileSidebar: false,
        treatAsDesktop: true, // ✅ Flag to indicate desktop treatment
      };
    }

    // Mobile behavior for width < 1024px
    if (width < 1024) {
      return {
        contentMarginLeft: "0",
        contentWidth: "100vw",
        showSidebar: false,
        showMobileSidebar: showMobileSidebar,
        treatAsDesktop: false,
      };
    }

    // Fallback (shouldn't reach here, but just in case)
    return {
      contentMarginLeft: "0",
      contentWidth: "100vw",
      showSidebar: false,
      showMobileSidebar: showMobileSidebar,
      treatAsDesktop: false,
    };
  };

  const layoutConfig = getLayoutConfig();

  // ✅ DEBUG: Temporary logging (remove after testing)
  useEffect(() => {
    console.log("Debug - TeamMember Responsive Values:", {
      width,
      isMobile,
      isTablet,
      isDesktop,
      isMobileInDesktopMode,
      layoutConfig,
      "Force Show Sidebar":
        layoutConfig.showSidebar || layoutConfig.treatAsDesktop,
    });
  }, [
    width,
    isMobile,
    isTablet,
    isDesktop,
    isMobileInDesktopMode,
    layoutConfig,
  ]);

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
          <div className={`${width < 1024 ? "px-3" : "px-4 sm:px-6"} py-4`}>
            <motion.div className="mb-6 lg:mb-8">
              <div className="flex flex-col gap-3 mb-6">
                <span className="self-start inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300">
                  👨‍💻 Team Member Panel
                </span>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1
                      className={`font-heading ${
                        width < 1024 ? "text-2xl" : "text-3xl lg:text-4xl"
                      } font-bold text-heading-primary-light dark:text-heading-primary-dark`}
                    >
                      Team Member Dashboard
                    </h1>
                    <p
                      className={`font-body text-txt-secondary-light dark:text-txt-secondary-dark ${
                        width < 1024 ? "text-sm" : "text-base"
                      }`}
                    >
                      View your assigned projects and manage your tasks.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ✅ Stats Cards with Integrated Search/Filter */}
            <motion.div
              className={`grid gap-2 lg:gap-3 mb-4 lg:mb-6 ${
                width < 1024 ? "grid-cols-1" : "grid-cols-1"
              }`}
            >
              {/* Stats Cards Row */}
              <motion.div
                className={`grid gap-2 lg:gap-3 ${
                  width < 1024 ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {/* First 3 stats cards */}
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-xl ${
                      width < 1024 ? "p-3" : "p-4"
                    } bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 flex items-center gap-3 shadow-sm hover:scale-105 transition-transform duration-300`}
                  >
                    <div className={`${width < 1024 ? "text-xl" : "text-2xl"}`}>
                      {s.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`${
                          width < 1024 ? "text-xs" : "text-xs"
                        } text-txt-secondary-light dark:text-txt-secondary-dark truncate`}
                      >
                        {s.label}
                      </p>
                      <p
                        className={`${
                          width < 1024 ? "text-base" : "text-lg"
                        } font-bold text-heading-primary-light dark:text-heading-primary-dark`}
                      >
                        {s.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ✅ Search & Filter Card - Separate Row Below Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-xl ${
                  width < 1024 ? "p-3" : "p-4"
                } bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-105 transition-transform duration-300`}
              >
                {/* Search and Filter Row */}
                <div
                  className={`flex ${
                    width < 1024
                      ? "flex-col gap-2"
                      : "flex-row items-center gap-4"
                  }`}
                >
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search
                      className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${
                        width < 1024 ? "w-3.5 h-3.5" : "w-4 h-4"
                      } text-txt-secondary-light dark:text-txt-secondary-dark`}
                    />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full ${
                        width < 1024
                          ? "pl-7 pr-2.5 py-2 text-sm"
                          : "pl-8 pr-3 py-2.5 text-sm"
                      } bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all`}
                    />
                  </div>

                  {/* Filter Controls */}
                  <div className="flex items-center gap-2">
                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`${
                        width < 1024
                          ? "px-2.5 py-2 text-xs"
                          : "px-3 py-2.5 text-sm"
                      } bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all min-w-0 max-w-[120px]`}
                    >
                      <option value="All">All</option>
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Done</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">Progress</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-bg-secondary-light dark:bg-bg-secondary-dark rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`${
                          width < 1024 ? "p-1.5" : "p-2"
                        } rounded-md transition-all ${
                          viewMode === "grid"
                            ? "bg-brand-primary-500 text-white shadow-md"
                            : "text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                        }`}
                      >
                        <Grid3X3
                          className={`${
                            width < 1024 ? "w-3 h-3" : "w-3.5 h-3.5"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`${
                          width < 1024 ? "p-1.5" : "p-2"
                        } rounded-md transition-all ${
                          viewMode === "list"
                            ? "bg-brand-primary-500 text-white shadow-md"
                            : "text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                        }`}
                      >
                        <List
                          className={`${
                            width < 1024 ? "w-3 h-3" : "w-3.5 h-3.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
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
                      ? width < 1024
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
                    width < 1024 ? "p-8" : "p-16"
                  } bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 shadow-sm text-center`}
                >
                  <div
                    className={`${
                      width < 1024 ? "text-4xl mb-3" : "text-6xl mb-4"
                    }`}
                  >
                    📋
                  </div>
                  <h3
                    className={`${
                      width < 1024 ? "text-xl" : "text-2xl"
                    } font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2`}
                  >
                    No projects assigned
                  </h3>
                  <p
                    className={`text-txt-secondary-light dark:text-txt-secondary-dark mb-6 ${
                      width < 1024 ? "text-sm" : ""
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
                        ? width < 1024
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
                            width < 1024
                              ? "hover:scale-[1.01]"
                              : "hover:scale-105"
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
                    width < 1024 ? "text-sm" : ""
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
      {/* ✅ ENHANCED: Desktop/Tablet Sidebar with multiple fallback conditions */}
      {(layoutConfig.showSidebar ||
        layoutConfig.treatAsDesktop ||
        width >= 1024) && (
        <Sidebar
          setActiveComponent={setActiveComponent}
          onStateChange={handleSidebarStateChange}
        />
      )}

      {/* ✅ ENHANCED: Mobile Sidebar - only show for actual mobile widths */}
      <AnimatePresence>
        {width < 1024 && layoutConfig.showMobileSidebar && (
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

      {/* ✅ ENHANCED: Main Content Area with improved responsive logic */}
      <motion.div
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={{
          marginLeft: width >= 1024 ? layoutConfig.contentMarginLeft : "0",
          width: layoutConfig.contentWidth,
          marginTop: "64px",
        }}
      >
        <div className="h-full">
          {/* Content Router */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeComponent}
              initial={{ opacity: 0, x: width < 1024 ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: width < 1024 ? 0 : -20 }}
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
