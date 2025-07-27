import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import Sidebar from "../../components/Other/sideBar";
import MyTasksPage from "./MyTasksPage";
import TaskSubmissionPage from "./TaskSubmissionMemberPage";
import ProjectDetailsCard from "../../components/Other/ProjectDeailsCard";
import SettingsPage from "../../pages/SettingsPage";
import Chat from "../Chat";
import { motion, AnimatePresence } from "framer-motion";

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

  // Fetch project data from GraphQL
  const { data, loading, error } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
  });

  // Component States
  const [activeComponent, setActiveComponent] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [contentWidth, setContentWidth] = useState("calc(100vw - 16rem)");

  const project = data?.getProjectById;

  // Handle sidebar state change with smooth animation
  const handleSidebarStateChange = (collapsed, hovering) => {
    setSidebarCollapsed(collapsed);
    setIsHovering(hovering);
  };

  // Calculate content dimensions with smooth transitions
  useEffect(() => {
    const shouldShowFullSidebar = !sidebarCollapsed || isHovering;
    const newWidth = shouldShowFullSidebar ? "calc(100vw - 16rem)" : "calc(100vw - 4rem)";
    
    // Add a small delay to make the transition smoother
    const timer = setTimeout(() => {
      setContentWidth(newWidth);
    }, 50);

    return () => clearTimeout(timer);
  }, [sidebarCollapsed, isHovering]);

  // Calculate content margin based on sidebar state
  const shouldShowFullSidebar = !sidebarCollapsed || isHovering;
  const contentMarginLeft = shouldShowFullSidebar ? '16rem' : '4rem';

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar 
        setActiveComponent={setActiveComponent} 
        onStateChange={handleSidebarStateChange}
      />

      {/* Main Content Area with Smooth Transitions */}
      <motion.div 
        className="min-h-screen"
        animate={{ 
          marginLeft: window.innerWidth >= 1024 ? contentMarginLeft : '0',
          width: window.innerWidth >= 1024 ? contentWidth : '100vw'
        }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth animation
        }}
      >
        <motion.div 
          className="p-6 lg:p-8 h-full"
          layout // Enables automatic layout animations
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Content Router with Layout Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeComponent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeComponent === "tasks" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <MyTasksPage projectId={projectId} />
                </motion.div>
              ) : activeComponent === "chat" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <Chat projectId={projectId} />
                </motion.div>
              ) : activeComponent === "taskSubmission" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <TaskSubmissionPage />
                </motion.div>
              ) : activeComponent === "settings" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <SettingsPage projectId={projectId} />
                </motion.div>
              ) : activeComponent === "dashboard" ? (
                navigate("/dashboard")
              ) : activeComponent === "projectHome" ? (
                window.location.reload()
              ) : (
                // Default Overview Component with Layout Animation
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

                  {/* Welcome Message */}
                  {!loading && !error && (
                    <motion.div 
                      className="bg-gradient-to-r from-brand-primary-50 to-brand-secondary-50 dark:from-brand-primary-900/20 dark:to-brand-secondary-900/20 border border-brand-primary-200 dark:border-brand-primary-700 rounded-2xl p-6"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      layout
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-br from-brand-primary-500 to-brand-secondary-500 rounded-xl flex items-center justify-center text-2xl"
                          whileHover={{ 
                            scale: 1.1,
                            rotate: 5,
                            transition: { duration: 0.2 }
                          }}
                        >
                          👋
                        </motion.div>
                        <div>
                          <h2 className="font-heading text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                            Welcome back, Team Member!
                          </h2>
                          <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark">
                            Here's your project overview and quick actions
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Project Details with Layout Animation */}
                  {!loading && !error && (
                    <motion.div layout transition={{ duration: 0.3 }}>
                      <ProjectDetailsCard project={project} loading={loading} />
                    </motion.div>
                  )}

                  {/* Quick Actions for Team Members */}
                  {!loading && !error && (
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                      layout
                      transition={{ duration: 0.3 }}
                    >
                      {[
                        {
                          title: "My Tasks",
                          description: "View and manage your assigned tasks",
                          icon: "📋",
                          onClick: () => setActiveComponent("tasks"),
                          gradient: "from-blue-500 to-blue-600"
                        },
                        {
                          title: "Submit Work",
                          description: "Submit completed tasks and updates",
                          icon: "📤",
                          onClick: () => setActiveComponent("taskSubmission"),
                          gradient: "from-green-500 to-green-600"
                        },
                        {
                          title: "Chat",
                          description: "Communicate with your team",
                          icon: "💬",
                          onClick: () => setActiveComponent("chat"),
                          gradient: "from-purple-500 to-purple-600"
                        },
                        {
                          title: "Settings",
                          description: "Manage your preferences and profile",
                          icon: "⚙️",
                          onClick: () => setActiveComponent("settings"),
                          gradient: "from-purple-500 to-purple-600"
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
                          <TeamMemberQuickActionCard {...card} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Task Statistics */}
                  {!loading && !error && (
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      layout
                    >
                      <TaskStatCard 
                        title="Pending Tasks" 
                        count="5" 
                        icon="⏳" 
                        color="text-yellow-600 dark:text-yellow-400"
                        bgColor="bg-yellow-50 dark:bg-yellow-900/20"
                      />
                      <TaskStatCard 
                        title="In Progress" 
                        count="3" 
                        icon="🔄" 
                        color="text-blue-600 dark:text-blue-400"
                        bgColor="bg-blue-50 dark:bg-blue-900/20"
                      />
                      <TaskStatCard 
                        title="Completed" 
                        count="12" 
                        icon="✅" 
                        color="text-green-600 dark:text-green-400"
                        bgColor="bg-green-50 dark:bg-green-900/20"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Enhanced Quick Action Card Component for Team Members
const TeamMemberQuickActionCard = ({ title, description, icon, onClick, gradient }) => {
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
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl text-white shadow-lg`}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <h3 className="font-heading text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-1 group-hover:text-brand-primary-500 transition-colors duration-200">
            {title}
          </h3>
          <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
            {description}
          </p>
        </div>
        <motion.div
          className="text-txt-secondary-light dark:text-txt-secondary-dark group-hover:text-brand-primary-500 transition-colors duration-200"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          →
        </motion.div>
      </div>
    </motion.div>
  );
};

// Task Statistics Card Component
const TaskStatCard = ({ title, count, icon, color, bgColor }) => {
  return (
    <motion.div
      className={`${bgColor} border border-gray-200/20 dark:border-gray-700/20 rounded-2xl p-6`}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      layout
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-body text-sm text-txt-secondary-light dark:text-txt-secondary-dark mb-1">
            {title}
          </p>
          <motion.p 
            className={`font-heading text-3xl font-bold ${color}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {count}
          </motion.p>
        </div>
        <motion.div 
          className="text-3xl"
          whileHover={{ 
            scale: 1.2,
            rotate: 10,
            transition: { duration: 0.2 }
          }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};
