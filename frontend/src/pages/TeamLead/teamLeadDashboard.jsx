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
} from "lucide-react";
import ProjectCard from "../../components/Other/ProjectCard";
import SkeletonCard from "../../components/UI/SkeletonCard";

// ✅ GraphQL Query
const GET_PROJECTS_BY_LEAD_ID = gql`
  query GetProjectsByLeadId($leadId: ID!) {
    getProjectsByLeadId(leadId: $leadId) {
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

const getLeadIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.userId || decoded.id || decoded._id;
  } catch {
    return null;
  }
};

const TeamLeadDashboard = () => {
  const { isDark } = useTheme();
  const leadId = getLeadIdFromToken();

  const { loading, error, data } = useQuery(GET_PROJECTS_BY_LEAD_ID, {
    variables: { leadId },
    skip: !leadId,
    fetchPolicy: "network-only",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [activeComponent, setActiveComponent] = useState("overview");

  useEffect(() => {
    document.title = "Team Lead Dashboard";
    document.body.style.overflow = activeComponent === "addproject" ? "hidden" : "auto";
  }, [activeComponent]);

  const projects = data?.getProjectsByLeadId || [];

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  const stats = [
    { label: "Total Projects", value: projects.length, icon: "📊" },
    { 
      label: "Active Projects", 
      value: projects.filter(p => p.status === "ACTIVE" || p.status === "IN_PROGRESS").length, 
      icon: "🚀" 
    },
    { label: "Completed", value: projects.filter(p => p.status === "COMPLETED").length, icon: "✅" },
  ];

  if (!leadId) return <div className="text-center py-40 text-red-500">Unauthorized</div>;
  if (error) return <div className="text-center py-40 text-red-500">Error loading projects</div>;

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300 relative">
      {/* Main Dashboard Content */}
      <div className="px-4 sm:px-6 py-4">
        <motion.div className="mb-8">
          <div className="flex flex-col gap-3 mb-6">
            <span className="self-start inline-flex items-center gap-2 px-4 py-1 text-xs font-medium rounded-full bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300">
              👨‍💼 Team Lead Panel
            </span>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl lg:text-4xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                  Team Lead Dashboard
                </h1>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-base">
                  Manage and track your team projects efficiently.
                </p>
              </div>  
            </div>
          </div>
        </motion.div>

        {/* ✅ Stats Cards */}
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 flex items-center gap-4 shadow-sm hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl">{s.icon}</div>
              <div>
                <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                  {s.label}
                </p>
                <p className="text-xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
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
          className="rounded-2xl p-6 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 shadow-sm mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-txt-secondary-light dark:text-txt-secondary-dark" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all"
              />
            </div>

            {/* Filter and View Controls */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all"
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
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-brand-primary-500 text-white shadow-md"
                      : "text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-brand-primary-500 text-white shadow-md"
                      : "text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                  }`}
                >
                  <List className="w-4 h-4" />
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
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
            <div className="rounded-2xl p-16 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 shadow-sm text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
                No projects found
              </h3>
              <p className="text-txt-secondary-light dark:text-txt-secondary-dark mb-6">
                {searchTerm || statusFilter !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first project"}
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
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
                      className="h-full hover:scale-105 transition-transform duration-300"
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
            className="mt-8 text-center"
          >
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
              Showing{" "}
              <span className="font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                {filteredProjects.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-txt-primary-light dark:text-txt-primary-dark">
                {data?.getProjectsByLeadId?.length || 0}
              </span>{" "}
              projects
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeamLeadDashboard;
