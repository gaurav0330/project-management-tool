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
  
  const { loading, error, data } = useQuery(GET_PROJECT_BY_ID, {
    variables: { id: projectId },
  });
  
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
    
    const timer = setTimeout(() => {
      setContentWidth(newWidth);
    }, 50);

    return () => clearTimeout(timer);
  }, [sidebarCollapsed, isHovering]);

  // Calculate content margin based on sidebar state
  const shouldShowFullSidebar = !sidebarCollapsed || isHovering;
  const contentMarginLeft = shouldShowFullSidebar ? '16rem' : '4rem';

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

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
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <motion.div 
          className="p-6 lg:p-8 h-full"
          layout
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
              {activeComponent === "createteam" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <CreateTeam projectId={projectId} />
                </motion.div>
              ) : activeComponent === "assignmembers" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <AssignTeamMembers projectId={projectId} />
                </motion.div>
              ) : activeComponent === "approvetask" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <TaskSubmissionPage projectId={projectId} />
                </motion.div>
              ) : activeComponent === "myteams" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <MyTeams />
                </motion.div>
              ) : activeComponent === "tasks" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <AssignTasks projectId={projectId} />
                </motion.div>
              ) : activeComponent === "taskDistribution" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <TaskDistributionPage />
                </motion.div>
              ) : activeComponent === "mytasks" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <MyTasks />
                </motion.div>
              ) : activeComponent === "taskmanagement" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <TaskManagementPage />
                </motion.div>
              ) : activeComponent === "displayteamtask" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <DisplayTeamTaskPage />
                </motion.div>
              ) : activeComponent === "assignedTasks" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <AssignedTasks projectId={projectId} />
                </motion.div>
              ) : activeComponent === "setting" ? (
                <motion.div 
                  className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
                  layout
                  transition={{ duration: 0.3 }}
                >
                  <SettingsPage projectId={projectId} />
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
                        <motion.div 
                          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        >
                          <FaBullseye  className="text-2xl mb-2 mx-auto" />
                          <p className="font-heading text-sm font-semibold">Project Status</p>
                          <p className="font-body text-xs opacity-80">On Track</p>
                        </motion.div>
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
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
