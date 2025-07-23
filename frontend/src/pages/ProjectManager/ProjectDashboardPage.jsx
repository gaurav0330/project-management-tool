import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import FilterBar from "../../components/TeamMember/FilterBar";
import ProjectCard from "../../components/Other/ProjectCard";
import AssignTeamLead from "../../components/tasks/AssignTeamLead";
import AssignTasks from "../../components/tasks/AssignTasks";
import CreateProject from "./CreateProjectPage";
import TaskApprovalPage from "./TaskApprovalPage";
import TeamMemberDashboardPage from "../TeamMember/TeamMemberDashboardPage";
import TeamLeadDashboard from "../TeamLead/teamLeadDashboard";
import SkeletonCard from "../../components/UI/SkeletonCard";

const GET_PROJECTS_BY_MANAGER_ID = gql`
  query GetProjectsByManagerId($managerId: ID!) {
    getProjectsByManagerId(managerId: $managerId) {
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

const getManagerIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch {
    return null;
  }
};

export default function ProjectDashboard() {
  const { isDark } = useTheme();
  const managerId = getManagerIdFromToken();

  const { loading, error, data } = useQuery(GET_PROJECTS_BY_MANAGER_ID, {
    variables: { managerId },
    skip: !managerId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeComponent, setActiveComponent] = useState("overview");

  useEffect(() => {
    document.title = "Project Manager Dashboard";
    document.body.style.overflow = activeComponent === "addproject" ? "hidden" : "auto";
  }, [activeComponent]);

  const projects = data?.getProjectsByManagerId || [];

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || project.status === statusFilter)
  );

  const stats = [
    { label: "Total Projects", value: projects.length, icon: "📊" },
    { label: "Active Projects", value: projects.filter(p => p.status === "In Progress").length, icon: "🚀" },
    { label: "Completed", value: projects.filter(p => p.status === "Completed").length, icon: "✅" },
    { label: "Pending", value: projects.filter(p => p.status === "Pending").length, icon: "⏳" }
  ];

  if (!managerId) return <div className="text-center py-40 text-red-500">Unauthorized</div>;
  if (error) return <div className="text-center py-40 text-red-500">Error loading projects</div>;

  return (
    <div className="min-h-screen bg-bg-secondary-light dark:bg-bg-secondary-dark transition-colors duration-300 relative">
      {/* Floating Modal */}
      <AnimatePresence>
        {activeComponent === "addproject" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              className="relative w-full max-w-3xl mx-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
            >
              <CreateProject onClose={() => setActiveComponent("overview")} />
              <button
                className="absolute top-4 right-4 text-xl text-txt-secondary-light dark:text-txt-secondary-dark hover:text-red-500"
                onClick={() => setActiveComponent("overview")}
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {activeComponent === "taskapproval" ? (
        <TaskApprovalPage />
      ) : activeComponent === "tasks" ? (
        <AssignTasks />
      ) : activeComponent === "members" ? (
        <AssignTeamLead />
      ) : activeComponent === "teammember" ? (
        <TeamMemberDashboardPage />
      ) : activeComponent === "teamlead" ? (
        <TeamLeadDashboard />
      ) : (
        <div className="px-4 sm:px-6 py-4">
          <motion.div className="mb-8">
            <div className="flex flex-col gap-3 mb-6">
              <span className="self-start inline-flex items-center gap-2 px-4 py-1 text-xs font-medium rounded-full bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300">
                👨‍💼 Project Manager Panel
              </span>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="font-heading text-3xl lg:text-4xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                    Project Manager Dashboard
                  </h1>
                  <p className="font-body text-txt-secondary-light dark:text-txt-secondary-dark text-base">
                    Manage your projects, teams, and workflow — efficiently.
                  </p>
                </div>
                <button
                  onClick={() => setActiveComponent("addproject")}
                  className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                  ➕ New Project
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 bg-bg-primary-light dark:bg-bg-primary-dark border border-gray-200 dark:border-gray-700 flex items-center gap-4 shadow-sm"
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

          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {loading
              ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              : filteredProjects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
