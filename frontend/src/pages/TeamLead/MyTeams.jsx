import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {jwtDecode} from "jwt-decode"; // Fixed import, remove braces
import TeamCard from "../../components/Other/TeamCard";
import { 
  FaPlus, 
  FaSearch, 
  FaUsers, 
  FaCalendarAlt,
  FaSortAmountDown,
  FaTh,
  FaList,
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";

// GraphQL Query to get teams by project and lead
const GET_TEAMS_BY_PROJECT_AND_LEAD = gql`
  query GetTeamsByProjectAndLead($projectId: ID!, $leadId: ID!) {
    getTeamsByProjectAndLead(projectId: $projectId, leadId: $leadId) {
      id
      teamName
      description
      createdAt
    }
  }
`;

// Function to decode JWT and get leadId
export const getTokenLeadId = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const MyTeams = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const leadId = getTokenLeadId();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const { loading, error, data, refetch } = useQuery(GET_TEAMS_BY_PROJECT_AND_LEAD, {
    variables: { projectId, leadId },
    skip: !projectId || !leadId,
    fetchPolicy: "cache-and-network",
  });

  // Filter and sort teams
  const processedTeams = React.useMemo(() => {
    if (!data?.getTeamsByProjectAndLead) return [];

    let filteredTeams = data.getTeamsByProjectAndLead.filter((team) =>
      team.teamName.toLowerCase().includes(search.toLowerCase()) ||
      team.description?.toLowerCase().includes(search.toLowerCase())
    );

    // Sort teams
    filteredTeams.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return a.teamName.localeCompare(b.teamName);
        default:
          return 0;
      }
    });

    return filteredTeams;
  }, [data, search, sortBy]);

  const handleCreateTeam = () => {
    navigate(`/project/${projectId}/create-team`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <FaSpinner className="w-8 h-8 text-brand-primary-500 animate-spin" />
              <div className="absolute inset-0 w-8 h-8 border-2 border-brand-primary-200 dark:border-brand-primary-800 rounded-full animate-pulse"></div>
            </div>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
              Loading your teams...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-red-200 dark:border-red-800 p-8 max-w-md text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-heading text-lg font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Error Loading Teams
            </h3>
            <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-4">
              {error.message}
            </p>
            <button onClick={() => refetch()} className="btn-primary">
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const teams = processedTeams;

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark mb-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUsers className="w-5 h-5 text-white" />
                </div>
                My Teams
              </h1>
              <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                Manage and organize your project teams
              </p>
            </div>

            <motion.button
              onClick={handleCreateTeam}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaPlus className="w-4 h-4" />
              Create Team
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Controls Bar */}
        <motion.div
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
              <input
                type="text"
                placeholder="Search teams by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-bg-accent-light dark:bg-bg-accent-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-txt-primary-light dark:text-txt-primary-dark font-body transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl p-1 border border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-brand-primary-500 text-white shadow-md"
                    : "text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                }`}
              >
                <FaTh className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-brand-primary-500 text-white shadow-md"
                    : "text-txt-secondary-light dark:text-txt-secondary-dark hover:text-txt-primary-light dark:hover:text-txt-primary-dark"
                }`}
              >
                <FaList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
            <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              {teams.length} team{teams.length !== 1 ? "s" : ""} found
              {search && ` for "${search}"`}
            </p>
            <div className="flex items-center gap-2">
              <FaSortAmountDown className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
              <span className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Sorted by {sortBy === "newest" ? "Date (Newest)" : sortBy === "oldest" ? "Date (Oldest)" : "Name"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Teams Content */}
        <AnimatePresence mode="wait">
          {teams.length > 0 ? (
            <motion.div
              key="teams-content"
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              layout
            >
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  layout
                >
                  <TeamCard
                    team={team}
                    projectId={projectId}
                    navigate={navigate}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUsers className="w-10 h-10 text-brand-primary-500" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-3">
                  {search ? "No Teams Found" : "No Teams Yet"}
                </h3>
                <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark mb-6">
                  {search
                    ? `No teams match your search "${search}". Try adjusting your search terms.`
                    : "You haven't created any teams yet. Start building your first team to collaborate effectively."}
                </p>
                {!search && (
                  <motion.button
                    onClick={handleCreateTeam}
                    className="btn-primary flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlus className="w-4 h-4" />
                    Create Your First Team
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTeams;
