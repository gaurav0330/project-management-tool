import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import Sidebar from "../../components/Other/sideBar";
import AssignTeamMembers from "./AssignTeamMembersPage";
import CreateTeam from "./CreateTeam";
import MyTeams from "./MyTeams";
import AssignTasks from "./AssignTaskPage";
import MyTasks from "../../components/TeamLeadComponent/MyTasks";
import TaskSubmissionPage from "./TaskSubmissionLeadPage";
import TaskManagementPage from "./TaskManagementPage";
import TaskDistributionPage from "./TaskDistributionPage";
import DisplayTeamTaskPage from "./DisplayTeamTaskPage";
import AssignedTasks from "../../components/tasks/AssignedTasks";
import ProjectDetailsCard from "../../components/Other/ProjectDeailsCard";
import SettingsPage from "../../pages/SettingsPage";
import Chat from "../Chat";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaFolder, 
  FaClock, 
  FaCheckCircle, 
  FaTasks,
  FaUsers,
  FaChartBar,
  FaClipboardList,
  FaCog,
  FaUserPlus,
  FaStar,
  FaRocket,
  FaBullseye 
} from "react-icons/fa";
import { useResponsive } from "../../hooks/useResponsive";
import MobileSidebar from "../../components/Other/MobileSidebar";

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

export default function TeamLeadDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  
  const { loading, error, data } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
  });
  
  const [activeComponent, setActiveComponent] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const project = data?.getProjectById;
  const category = project?.category;

  // Handle sidebar state change
  const handleSidebarStateChange = (collapsed, hovering) => {
    setSidebarCollapsed(collapsed);
    setIsHovering(hovering);
  };

  // Mobile-specific handlers
  const handleMobileMenuToggle = () => {
    setShowMobileSidebar(prev => !prev);
  };

  const handleMobileComponentChange = (component) => {
    setActiveComponent(component);
    setShowMobileSidebar(false); // Close mobile menu after selection
  };

  // CRITICAL FIX: Expose mobile sidebar handlers to navbar via global window object
  useEffect(() => {
    // Create a global handler that the navbar can access
    window.projectMobileSidebarHandler = {
      toggle: handleMobileMenuToggle,
      isOpen: showMobileSidebar,
      category: category,
      setShowSidebar: setShowMobileSidebar // Add direct setter
    };

    // Also listen for messages from navbar
    const handleNavbarMessage = (event) => {
      if (event.data && event.data.type === 'TOGGLE_PROJECT_SIDEBAR') {
        setShowMobileSidebar(prev => !prev);
      }
    };

    window.addEventListener('message', handleNavbarMessage);

    return () => {
      delete window.projectMobileSidebarHandler;
      window.removeEventListener('message', handleNavbarMessage);
    };
  }, [showMobileSidebar, category]);

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

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Helper function to render active component
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "createteam":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <CreateTeam projectId={projectId} />
          </motion.div>
        );
      
      case "assignmembers":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <AssignTeamMembers projectId={projectId} />
          </motion.div>
        );
      
      case "approvetask":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <TaskSubmissionPage projectId={projectId} />
          </motion.div>
        );
      
      case "myteams":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <MyTeams />
          </motion.div>
        );
      
      case "tasks":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <AssignTasks projectId={projectId} />
          </motion.div>
        );
      
      case "taskDistribution":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <TaskDistributionPage />
          </motion.div>
        );
      
      case "mytasks":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <MyTasks />
          </motion.div>
        );
      
      case "taskmanagement":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <TaskManagementPage />
          </motion.div>
        );
      
      case "displayteamtask":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <DisplayTeamTaskPage />
          </motion.div>
        );
      
      case "chat":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <Chat projectId={projectId} />
          </motion.div>
        );
      
      case "assignedTasks":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <AssignedTasks projectId={projectId} />
          </motion.div>
        );
      
      case "setting":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <SettingsPage projectId={projectId} />
          </motion.div>
        );
      
      case "projectHome":
        window.location.reload();
        return null;
      
      default:
        // Default Overview Component with Layout Animation
        return (
          <motion.div 
            className="space-y-6"
            layout
            transition={{ duration: 0.3 }}
          >
            {error && (
              <motion.div 
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                layout
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-red-800 dark:text-red-200">
                      Error Loading Project
                    </h3>
                    <p className="font-body text-red-600 dark:text-red-300 text-sm">
                      {error.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Welcome Header */}
            <motion.div
              className="relative bg-gradient-to-br from-brand-primary-500 via-brand-primary-600 to-brand-secondary-500 rounded-2xl p-8 text-white overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              layout
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <motion.div 
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaRocket className="text-3xl text-white" />
                    </motion.div>
                    <div>
                      <motion.p 
                        className="font-body text-lg opacity-90 mb-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        {getGreeting()}, Team Lead! 👋
                      </motion.p>
                      <motion.h1 
                        className="font-heading text-4xl font-bold mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        Leadership Command Center
                      </motion.h1>
                      <motion.p 
                        className="font-body text-lg opacity-90"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        Orchestrate teams, drive results, achieve excellence
                      </motion.p>
                    </div>
                  </div>

                  {/* Quick Status Indicator */}
                 
                </div>
              </div>
            </motion.div>

            {/* Project Details with Layout Animation */}
            <motion.div layout transition={{ duration: 0.3 }}>
              <ProjectDetailsCard project={project} loading={loading} />
            </motion.div>

            {/* Enhanced Stats Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              layout
            >
              {[
                { 
                  title: "Active Teams", 
                  value: "3", 
                  icon: FaUsers, 
                  color: "blue",
                  gradient: "from-blue-500 to-blue-600",
                  change: "+2 this month"
                },
                { 
                  title: "Pending Tasks", 
                  value: "12", 
                  icon: FaClock, 
                  color: "amber",
                  gradient: "from-amber-500 to-orange-500",
                  change: "-5 from last week"
                },
                { 
                  title: "Completed Tasks", 
                  value: "28", 
                  icon: FaCheckCircle, 
                  color: "green",
                  gradient: "from-green-500 to-emerald-500",
                  change: "+15 this week"
                },
                { 
                  title: "Team Performance", 
                  value: "94%", 
                  icon: FaStar, 
                  color: "purple",
                  gradient: "from-purple-500 to-indigo-500",
                  change: "+8% improvement"
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  className="bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/20 dark:border-gray-700/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  layout
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="text-white text-xl" />
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-txt-primary-light dark:text-txt-primary-dark font-semibold mb-1">
                      {stat.title}
                    </p>
                    <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-xs">
                      {stat.change}
                    </p>
                  </div>
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
        <Sidebar 
          setActiveComponent={setActiveComponent} 
          onStateChange={handleSidebarStateChange}
          category={category}
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
                category={category}
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
