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
import Chat from "./Chat";
import { motion, AnimatePresence } from "framer-motion";

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
  
  const { loading, error, data } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
  });
  
  const [activeComponent, setActiveComponent] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [contentWidth, setContentWidth] = useState("calc(100vw - 16rem)"); // Track content width

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
              {activeComponent === "managelead" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <AssignTeamLead projectId={projectId} />
                </motion.div>
              ) : activeComponent === "dashboard" ? (
                navigate("/projectDashboard")
              ) : activeComponent === "approvetask" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <TaskApprovalPage projectId={projectId} />
                </motion.div>
              ) : activeComponent === "tasks" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <AssignTasks projectId={projectId} />
                </motion.div>
              ) : activeComponent === "members" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <TeamMembersList projectId={projectId} />
                </motion.div>
              ) : activeComponent === "manageteam" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <ManageTeam projectId={projectId} />
                </motion.div>
              ) : activeComponent === "assignedTasks" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <AssignedTasks projectId={projectId} />
                </motion.div>
              )
              : activeComponent === "chat" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <Chat projectId={projectId} />
                </motion.div>
              ) 
              : activeComponent === "TimeLine" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <TaskStatusTimeline projectId={projectId} />
                </motion.div>
              ) : activeComponent === "setting" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <SettingsPage projectId={projectId} />
                </motion.div>
              ) : activeComponent === "analytics" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <AnalyticsDashboard projectId={projectId} />
                </motion.div>
              ) : activeComponent === "projectHome" ? (
                window.location.reload()
              ) : (
                // Default Overview Component with Layout Animation
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
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Enhanced Quick Action Card Component
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
