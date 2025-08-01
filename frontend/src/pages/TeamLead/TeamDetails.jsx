import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import TeamSidebar from "../../components/Other/TeamSidebar";
import MobileTeamSidebar from "../../components/Other/MobileTeamSidebar";
import { useResponsive } from "../../hooks/useResponsive";
import AssignTasks from "./AssignTaskPage";
import AssignTeamMembers from "./AssignTeamMembersPage";
import TaskManagementPage from "./TaskManagementPage";
import TaskDistributionPage from "./TaskDistributionPage";
import DisplayTeamTaskPage from "./DisplayTeamTaskPage";
import TaskApprovalPageLead from "../TeamLead/TaskApprovalPageLead";
import {
  FaUsers, FaTasks, FaSpinner, FaExclamationTriangle,
  FaArrowLeft, FaUserPlus, FaClipboardCheck, FaCalendarAlt,
  FaUser, FaEnvelope, FaInfo
} from "react-icons/fa";

const GET_TEAM_BY_ID = gql`
  query GetTeamById($id: ID!) {
    getTeamById(id: $id) {
      id
      projectId
      leadId
      teamName
      description
      createdAt
    }
  }
`;

const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      email
      role
    }
  }
`;

export default function TeamDetails() {
  const { projectId, teamId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  const [activeComponent, setActiveComponent] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Fetch team data
  const { loading: teamLoading, error: teamError, data: teamData } = useQuery(GET_TEAM_BY_ID, {
    variables: { id: teamId }
  });

  // Fetch lead user data when team data is available
  const { loading: leadLoading, error: leadError, data: leadData } = useQuery(GET_USER, {
    variables: { userId: teamData?.getTeamById?.leadId },
    skip: !teamData?.getTeamById?.leadId,
  });

  const team = teamData?.getTeamById;
  const leadUser = leadData?.getUser;
  const loading = teamLoading || leadLoading;
  const error = teamError || leadError;

  // Mobile-specific handlers
  const handleMobileMenuToggle = () => {
    setShowMobileSidebar(prev => !prev);
  };

  const handleMobileComponentChange = (component) => {
    setActiveComponent(component);
    setShowMobileSidebar(false);
  };

  // CRITICAL FIX: Expose mobile sidebar handlers to navbar
  useEffect(() => {
    window.teamMobileSidebarHandler = {
      toggle: handleMobileMenuToggle,
      isOpen: showMobileSidebar,
      teamId: teamId,
      projectId: projectId,
      setShowSidebar: setShowMobileSidebar
    };

    const handleNavbarMessage = (event) => {
      if (event.data && event.data.type === 'TOGGLE_TEAM_SIDEBAR') {
        setShowMobileSidebar(prev => !prev);
      }
    };

    window.addEventListener('message', handleNavbarMessage);

    return () => {
      delete window.teamMobileSidebarHandler;
      window.removeEventListener('message', handleNavbarMessage);
    };
  }, [showMobileSidebar, teamId, projectId]);

  // Calculate layout dimensions
  const getLayoutConfig = () => {
    if (isMobile) {
      return {
        contentMarginLeft: '0',
        contentWidth: '100vw',
        showSidebar: false,
        showMobileSidebar: showMobileSidebar
      };
    }
    
    if (isTablet) {
      return {
        contentMarginLeft: sidebarCollapsed && !isHovering ? '4rem' : '12rem',
        contentWidth: sidebarCollapsed && !isHovering ? 'calc(100vw - 4rem)' : 'calc(100vw - 12rem)',
        showSidebar: true,
        showMobileSidebar: false
      };
    }

    // Desktop
    const shouldShowFullSidebar = !sidebarCollapsed || isHovering;
    return {
      contentMarginLeft: shouldShowFullSidebar ? '16rem' : '4rem',
      contentWidth: shouldShowFullSidebar ? 'calc(100vw - 16rem)' : 'calc(100vw - 4rem)',
      showSidebar: true,
      showMobileSidebar: false
    };
  };

  const layoutConfig = getLayoutConfig();

  // Sidebar state change handler
  const handleSidebarStateChange = (collapsed, hovering) => {
    setSidebarCollapsed(collapsed);
    setIsHovering(hovering);
  };

  const handleSetActiveComponent = (component) => {
    if (component === "projectHome") {
      navigate(`/teamLead/project/${projectId}`);
    } else {
      setActiveComponent(component);
    }
  };

  const handleBackToTeams = () => {
    navigate(`/teamLead/project/${projectId}`);
  };

  // Format creation date
  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = new Date(parseInt(timestamp));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "—";
    }
  };

  // Helper function to render active component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "createtasks":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg" 
            layout 
            transition={{ duration: 0.3 }}
          >
            <AssignTasks projectId={projectId} teamId={teamId} />
          </motion.div>
        );
      
      case "approvetasks":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg" 
            layout 
            transition={{ duration: 0.3 }}
          >
            <TaskApprovalPageLead projectId={projectId} />
          </motion.div>
        );
      
      case "addmembers":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg" 
            layout 
            transition={{ duration: 0.3 }}
          >
            <AssignTeamMembers projectId={projectId} teamId={teamId} />
          </motion.div>
        );
      
      case "taskDistribution":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg" 
            layout 
            transition={{ duration: 0.3 }}
          >
            <TaskDistributionPage projectId={projectId} />
          </motion.div>
        );
      
      case "managetasks":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg" 
            layout 
            transition={{ duration: 0.3 }}
          >
            <TaskManagementPage projectId={projectId} />
          </motion.div>
        );
      
      case "teamtasks":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg" 
            layout 
            transition={{ duration: 0.3 }}
          >
            <DisplayTeamTaskPage />
          </motion.div>
        );
      
      default:
        // Team Overview Panel
        return (
          <motion.div className="space-y-6" layout transition={{ duration: 0.3 }}>
            {/* Back Navigation with Team Details Badge */}
            <motion.div className="flex items-center justify-between gap-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleBackToTeams}
                  className="p-3 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark rounded-xl transition-colors duration-200 flex items-center gap-2 text-txt-secondary-light dark:text-txt-secondary-dark hover:text-brand-primary-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <FaArrowLeft className="w-4 h-4" />
                  <span className="font-body font-medium">Back to Teams</span>
                </motion.button>
              </div>

              {/* Team Details Badge */}
              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary-500 to-brand-secondary-500 text-white rounded-full shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  transition: { duration: 0.2 }
                }}
              >
                <FaInfo className="w-4 h-4" />
                <span className="font-body font-semibold text-sm">Team Details</span>
              </motion.div>
            </motion.div>

            {/* Team Info Card */}
            <motion.div
              className="bg-gradient-to-r from-brand-primary-500 via-brand-primary-600 to-brand-secondary-500 rounded-2xl p-8 text-white overflow-hidden relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              layout
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-6">
                    <motion.div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.3 }}>
                      <FaUsers className="text-3xl text-white" />
                    </motion.div>
                    <div>
                      <motion.h1 className="font-heading text-4xl font-bold mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}>
                        {loading ? "Loading team..." : team?.teamName || "—"}
                      </motion.h1>
                      <motion.p className="font-body text-lg opacity-90"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}>
                        {loading ? "" : team?.description || ""}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Team Details Grid */}
            {!loading && !error && team && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Team Lead Information */}
                <div className="bg-bg-primary-light dark:bg-bg-primary-dark p-6 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <FaUser className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                      Team Lead
                    </h3>
                  </div>

                  {leadLoading ? (
                    <div className="flex items-center gap-2">
                      <FaSpinner className="w-4 h-4 animate-spin text-brand-primary-500" />
                      <span className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-sm">
                        Loading lead info...
                      </span>
                    </div>
                  ) : leadError ? (
                    <p className="font-body text-red-600 dark:text-red-400 text-sm">
                      Error loading lead information
                    </p>
                  ) : leadUser ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FaUser className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
                        <span className="font-body text-txt-primary-light dark:text-txt-primary-dark font-medium">
                          {leadUser.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="w-4 h-4 text-txt-secondary-light dark:text-txt-secondary-dark" />
                        <span className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-sm">
                          {leadUser.email}
                        </span>
                      </div>
                      <div className="mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full font-medium inline-block">
                        {leadUser.role}
                      </div>
                    </div>
                  ) : (
                    <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-sm">
                      No lead assigned
                    </p>
                  )}
                </div>

                {/* Created Date */}
                <div className="bg-bg-primary-light dark:bg-bg-primary-dark p-6 rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                      Created
                    </h3>
                  </div>
                  <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-sm">
                    {formatDate(team.createdAt)}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error and Loading States */}
            {error && (
              <motion.div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                layout>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-red-800 dark:text-red-200">
                      Error Loading Team
                    </h3>
                    <p className="font-body text-red-600 dark:text-red-300 text-sm">
                      {error.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg p-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}>
                <div className="flex flex-col items-center gap-4">
                  <FaSpinner className="w-8 h-8 text-brand-primary-500 animate-spin" />
                  <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                    Loading team details...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              layout>
              {[
                {
                  title: "Add Members",
                  description: "Invite new team members to collaborate",
                  icon: FaUserPlus,
                  color: "from-blue-500 to-blue-600",
                  onClick: () => setActiveComponent("addmembers")
                },
                {
                  title: "Create Tasks",
                  description: "Assign new tasks to team members",
                  icon: FaTasks,
                  color: "from-green-500 to-green-600",
                  onClick: () => setActiveComponent("createtasks")
                },
                {
                  title: "Manage Tasks",
                  description: "Review and manage all team tasks",
                  icon: FaClipboardCheck,
                  color: "from-purple-500 to-purple-600",
                  onClick: () => setActiveComponent("managetasks")
                }
              ].map((action, index) => (
                <motion.div key={action.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + index * 0.1,
                    ease: "easeOut"
                  }}
                  layout>
                  <QuickActionCard {...action} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      {/* Desktop/Tablet Sidebar */}
      {layoutConfig.showSidebar && (
        <TeamSidebar
          setActiveComponent={handleSetActiveComponent}
          onStateChange={handleSidebarStateChange}
          teamId={teamId}
          projectId={projectId}
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
              <MobileTeamSidebar 
                setActiveComponent={handleMobileComponentChange}
                activeComponent={activeComponent}
                onClose={() => setShowMobileSidebar(false)}
                teamId={teamId}
                projectId={projectId}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.div 
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isDesktop ? layoutConfig.contentMarginLeft : '0',
          width: layoutConfig.contentWidth,
          marginTop: '64px' // Account for fixed navbar
        }}
      >
        <div className={`${isMobile ? 'p-4' : 'p-6 lg:p-8'} h-full`}>
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

// Keep your existing QuickActionCard component
const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
  <motion.div
    className="bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/20 dark:border-gray-700/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
    whileHover={{
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2, ease: "easeOut" }
    }}
    whileTap={{
      scale: 0.98,
      transition: { duration: 0.1 }
    }}
    onClick={onClick}
    layout
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-4">
      <motion.div
        className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
      >
        <Icon className="text-xl" />
      </motion.div>
      <div>
        <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-1 group-hover:text-brand-primary-500 transition-colors duration-200">
          {title}
        </h3>
        <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);
