import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import Sidebar from "../../components/Other/sideBar";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";
import AssignTasks from "../../components/tasks/AssignTasks";
import TaskApprovalPage from "./TaskApprovalPage";
import AssignedTasks from "../../components/tasks/AssignedTasks";
import ManageTeam from "./ManageTeam";
import TeamMembersList from "./TeamMemberList";
import AnalyticsDashboard from "./AnalyticsDashboard";
import TaskStatusTimeline from "../../components/charts/TaskAssignment";
import ProjectDetailsCard from "../../components/Other/ProjectDeailsCard";
import SettingsPage from "../../pages/SettingsPage";
import Chat from "../Chat";
import { motion, AnimatePresence } from "framer-motion";
import CreateWebhookConfig from "./CreateWebhookConfig ";
import { useResponsive } from "../../hooks/useResponsive";
import MobileSidebar from "../../components/Other/MobileSidebar"; // Import the new component

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

export default function ProjectDashboard() {
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

  // Helper function to render active component (your existing code remains the same)
  const renderActiveComponent = (activeComponent, projectId, project, loading, error, setActiveComponent) => {
    // ... your existing renderActiveComponent logic (keep as is)
    if (activeComponent === "managelead") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <AssignTeamLead projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "dashboard") {
      navigate("/projectDashboard");
      return null;
    } else if (activeComponent === "approvetask") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <TaskApprovalPage projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "tasks") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <AssignTasks projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "members") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <TeamMembersList projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "manageteam") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <ManageTeam projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "integrations") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <CreateWebhookConfig projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "assignedTasks") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <AssignedTasks projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "chat") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <Chat projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "TimeLine") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <TaskStatusTimeline projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "setting") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <SettingsPage projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "analytics") {
      return (
        <motion.div 
          className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
          layout
          transition={{ duration: 0.3 }}
        >
          <AnalyticsDashboard projectId={projectId} />
        </motion.div>
      );
    } else if (activeComponent === "projectHome") {
      window.location.reload();
      return null;
    } else {
      // Default Overview Component
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
                    Unable to fetch project details. Please try again.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Project Details with Layout Animation */}
          <motion.div layout transition={{ duration: 0.3 }}>
            <ProjectDetailsCard project={project} loading={loading} />
          </motion.div>

          {/* Quick Actions with Staggered Animation */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            layout
            transition={{ duration: 0.3 }}
          >
            {[
              {
                title: "Manage Team",
                description: "View and manage team members",
                icon: "👥",
                onClick: () => setActiveComponent("manageteam")
              },
              {
                title: "View Analytics",
                description: "Check project progress and analytics",
                icon: "📊",
                onClick: () => setActiveComponent("analytics")
              },
              {
                title: "Timeline",
                description: "Track project timeline and milestones",
                icon: "📅",
                onClick: () => setActiveComponent("TimeLine")
              }
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.2 + index * 0.1,
                  ease: "easeOut"
                }}
                layout
              >
                <QuickActionCard {...card} />
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
              {renderActiveComponent(activeComponent, projectId, project, loading, error, setActiveComponent)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Enhanced Quick Action Card Component (keep as is)
const QuickActionCard = ({ title, description, icon, onClick }) => {
  return (
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
          className="w-12 h-12 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-xl flex items-center justify-center text-2xl"
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-1">
            {title}
          </h3>
          <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
