import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import Sidebar from "../../components/Other/sideBar";
import MobileSidebar from "../../components/Other/MobileSidebar";
import MyTasksPage from "./MyTasksPage";
import TaskSubmissionPage from "./TaskSubmissionMemberPage";
import ProjectDetailsCard from "../../components/Other/ProjectDeailsCard";
import SettingsPage from "../../pages/SettingsPage";
import Chat from "../Chat";
import { motion, AnimatePresence } from "framer-motion";
import { useResponsive } from "../../hooks/useResponsive";
import {
  FaClipboardList,
  FaPaperPlane,
  FaComments,
  FaCog,
  FaRocket,
  FaBullseye
} from "react-icons/fa";

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
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  // Fetch project data from GraphQL
  const { data, loading, error } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
  });

  // Component States
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
    setShowMobileSidebar(false);
  };

  // CRITICAL FIX: Expose mobile sidebar handlers to navbar
  useEffect(() => {
    window.projectMobileSidebarHandler = {
      toggle: handleMobileMenuToggle,
      isOpen: showMobileSidebar,
      category: category,
      setShowSidebar: setShowMobileSidebar
    };

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
      case "tasks":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <MyTasksPage projectId={projectId} />
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
      
      case "taskSubmission":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <TaskSubmissionPage />
          </motion.div>
        );
      
      case "settings":
        return (
          <motion.div 
            className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
            layout
            transition={{ duration: 0.3 }}
          >
            <SettingsPage projectId={projectId} />
          </motion.div>
        );
      
      case "dashboard":
        navigate("/dashboard");
        return null;
      
      case "projectHome":
        window.location.reload();
        return null;
      
      default:
        // Default Overview Component with enhanced Team Member styling
        return (
          <motion.div 
            className="space-y-6"
            layout
            transition={{ duration: 0.3 }}
          >
            {/* Loading State */}
            {loading && (
              <motion.div 
                className="bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/20 dark:border-gray-700/20 rounded-2xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                layout
              >
                <div className="flex items-center justify-center space-x-3">
                  <motion.div 
                    className="w-6 h-6 bg-brand-primary-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-6 h-6 bg-brand-primary-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-6 h-6 bg-brand-primary-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <p className="text-center mt-4 font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                  Loading project details...
                </p>
              </motion.div>
            )}

            {/* Error State */}
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

            {/* Enhanced Welcome Header for Team Member - MOBILE RESPONSIVE */}
            {!loading && !error && (
              <motion.div
                className={`relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-500 rounded-2xl ${isMobile ? 'p-4' : 'p-8'} text-white overflow-hidden`}
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
                  {/* Mobile Layout - Stack Vertically */}
                  {isMobile ? (
                    <div className="flex flex-col space-y-4">
                      {/* Top Section - Icon and Main Content */}
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaRocket className="text-2xl text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <motion.p 
                            className="font-body text-sm opacity-90 mb-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                          >
                            {getGreeting()}, Team Member! 👋
                          </motion.p>
                          <motion.h1 
                            className="font-heading text-xl font-bold mb-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          >
                            Your Work Hub
                          </motion.h1>
                          <motion.p 
                            className="font-body text-sm opacity-90"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                          >
                            Focus on tasks, deliver excellence
                          </motion.p>
                        </div>
                      </div>

                      {/* Bottom Section - Status Indicator */}
                      <motion.div 
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center self-start"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        <div className="flex items-center gap-2">
                          <FaBullseye className="text-lg" />
                          <div className="text-left">
                            <p className="font-heading text-xs font-semibold">My Status</p>
                            <p className="font-body text-xs opacity-80">Active</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    /* Desktop Layout - Horizontal */
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
                            {getGreeting()}, Team Member! 👋
                          </motion.p>
                          <motion.h1 
                            className="font-heading text-4xl font-bold mb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          >
                            Your Work Hub
                          </motion.h1>
                          <motion.p 
                            className="font-body text-lg opacity-90"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                          >
                            Focus on tasks, deliver excellence
                          </motion.p>
                        </div>
                      </div>

                      {/* Quick Status Indicator */}
                      <motion.div 
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        <FaBullseye className="text-2xl mb-2 mx-auto" />
                        <p className="font-heading text-sm font-semibold">My Status</p>
                        <p className="font-body text-xs opacity-80">Active</p>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Project Details with Layout Animation */}
            {!loading && !error && (
              <motion.div layout transition={{ duration: 0.3 }}>
                <ProjectDetailsCard project={project} loading={loading} />
              </motion.div>
            )}

            {/* Enhanced Quick Actions for Team Members */}
            {!loading && !error && (
              <motion.div 
                className={`grid gap-6 mt-8 ${
                  isMobile 
                    ? 'grid-cols-1' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                layout
              >
                {[
                  {
                    title: "My Tasks",
                    description: "View and manage your assigned tasks",
                    icon: FaClipboardList,
                    onClick: () => setActiveComponent("tasks"),
                    gradient: "from-blue-500 to-blue-600",
                    change: "5 active tasks"
                  },
                  {
                    title: "Submit Work",
                    description: "Submit completed tasks and updates",
                    icon: FaPaperPlane,
                    onClick: () => setActiveComponent("taskSubmission"),
                    gradient: "from-green-500 to-green-600",
                    change: "3 pending submissions"
                  },
                  {
                    title: "Team Chat",
                    description: "Communicate with your team",
                    icon: FaComments,
                    onClick: () => setActiveComponent("chat"),
                    gradient: "from-purple-500 to-purple-600",
                    change: "2 new messages"
                  },
                  {
                    title: "Settings",
                    description: "Manage preferences and profile",
                    icon: FaCog,
                    onClick: () => setActiveComponent("settings"),
                    gradient: "from-orange-500 to-red-500",
                    change: "Profile settings"
                  }
                ].map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.3 + index * 0.1,
                      ease: "easeOut"
                    }}
                    layout
                  >
                    <TeamMemberQuickActionCard {...card} isMobile={isMobile} />
                  </motion.div>
                ))}
              </motion.div>
            )}
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

// Enhanced Quick Action Card Component for Team Members
const TeamMemberQuickActionCard = ({ title, description, icon: Icon, onClick, gradient, change, isMobile }) => {
  return (
    <motion.div
      className={`bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/20 dark:border-gray-700/20 rounded-2xl ${isMobile ? 'p-4' : 'p-6'} hover:shadow-xl transition-all duration-300 cursor-pointer group`}
      whileHover={{ 
        scale: isMobile ? 1.02 : 1.05, 
        y: isMobile ? -2 : -5,
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
      <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
        <div className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className={`text-white ${isMobile ? 'text-lg' : 'text-xl'}`} />
        </div>
        <div className="text-right">
          <motion.div
            className="text-txt-secondary-light dark:text-txt-secondary-dark group-hover:text-brand-primary-500 transition-colors duration-200"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.div>
        </div>
      </div>
      <div>
        <h3 className={`font-heading ${isMobile ? 'text-base' : 'text-lg'} font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-1 group-hover:text-brand-primary-500 transition-colors duration-200`}>
          {title}
        </h3>
        <p className={`font-body ${isMobile ? 'text-xs' : 'text-sm'} text-txt-secondary-light dark:text-txt-secondary-dark mb-2`}>
          {description}
        </p>
        <p className={`font-body ${isMobile ? 'text-xs' : 'text-xs'} text-txt-secondary-light dark:text-txt-secondary-dark`}>
          {change}
        </p>
      </div>
    </motion.div>
  );
};


