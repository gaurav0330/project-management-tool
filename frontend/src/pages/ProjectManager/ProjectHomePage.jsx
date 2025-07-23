import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import Sidebar from "../../components/Other/sideBar";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";
import AssignTasks from "../../components/tasks/AssignTasks";
import CreateProjectPage from "../../pages/ProjectManager/CreateProjectPage";
import TaskApprovalPage from "./TaskApprovalPage";
import AssignedTasks from "../../components/tasks/AssignedTasks";
import TeamLeadsList from "./TeamLeadsList";
import TeamMembersList from "./TeamMemberList";
import AnalyticsDashboard from "./AnalyticsDashboard";
import TaskStatusTimeline from "../../components/charts/TaskAssignment";
import ProjectDetailsCard from "../../components/Other/ProjectDeailsCard";
import SettingsPage from "../../pages/SettingsPage";
import { motion } from "framer-motion";

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

  const project = data?.getProjectById;

  // Handle sidebar state change
  const handleSidebarStateChange = (collapsed, hovering) => {
    setSidebarCollapsed(collapsed);
    setIsHovering(hovering);
  };

  // Calculate content margin based on sidebar state
  const shouldShowFullSidebar = !sidebarCollapsed || isHovering;
  const contentMarginLeft = shouldShowFullSidebar ? '16rem' : '4rem'; // 64 (w-16) = 4rem, 256 (w-64) = 16rem

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar 
        setActiveComponent={setActiveComponent} 
        onStateChange={handleSidebarStateChange}
      />

      {/* Main Content Area */}
      <div 
        className="transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: window.innerWidth >= 1024 ? contentMarginLeft : '0',
          minHeight: '100vh'
        }}
      >
        <motion.div 
          className="p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Content Router */}
          {activeComponent === "managelead" ? (
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <AssignTeamLead projectId={projectId} />
            </div>
          ) : activeComponent === "dashboard" ? (
            navigate("/projectDashboard")
          ) : activeComponent === "approvetask" ? (
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <TaskApprovalPage projectId={projectId} />
            </div>
          ) : activeComponent === "tasks" ? (
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <AssignTasks projectId={projectId} />
            </div>
          ) : activeComponent === "members" ? (
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <TeamMembersList projectId={projectId} />
            </div>
          ) : activeComponent === "manageteam" ? (
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <TeamLeadsList projectId={projectId} />
            </div>
          ) : activeComponent === "assignedTasks" ? (
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <AssignedTasks projectId={projectId} />
            </div>
          ) : activeComponent === "TimeLine" ? (
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <TaskStatusTimeline projectId={projectId} />
            </div>
          ) : activeComponent === "setting" ? (
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <SettingsPage projectId={projectId} />
            </div>
          ) : activeComponent === "analytics" ? (
            <div className="bg-bg-primary-light dark:bg-bg-primary-dark rounded-2xl border border-gray-200/20 dark:border-gray-700/20 shadow-lg">
              <AnalyticsDashboard projectId={projectId} />
            </div>
          ) : activeComponent === "projectHome" ? (
            window.location.reload()
          ) : (
            // Default Overview Component
            <div className="space-y-6">
              {error && (
                <motion.div 
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
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

              {/* Project Details */}
              <ProjectDetailsCard project={project} loading={loading} />

              {/* Quick Actions */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <QuickActionCard
                  title="Manage Team"
                  description="View and manage team members"
                  icon="👥"
                  onClick={() => setActiveComponent("manageteam")}
                />
                <QuickActionCard
                  title="View Analytics"
                  description="Check project progress and analytics"
                  icon="📊"
                  onClick={() => setActiveComponent("analytics")}
                />
                <QuickActionCard
                  title="Timeline"
                  description="Track project timeline and milestones"
                  icon="📅"
                  onClick={() => setActiveComponent("TimeLine")}
                />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Quick Action Card Component
const QuickActionCard = ({ title, description, icon, onClick }) => {
  return (
    <motion.div
      className="bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200/20 dark:border-gray-700/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-primary-100 to-brand-primary-200 dark:from-brand-primary-900/30 dark:to-brand-primary-800/30 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
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
