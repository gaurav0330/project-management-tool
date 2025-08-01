import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  PieChart,
  Users,
  Target,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Activity,
} from "lucide-react";
import ProjectProgress from "../../components/charts/ProjectProgress";
import TaskStatusPieChart from "../../components/charts/TaskStatus";
import TeamPerformance from "../../components/charts/TeamPerformance";
import TaskDistribution from "../../components/charts/TaskAssignment";
import DeadlinesOverview from "../../components/charts/DeadlinesOverview";
import IssuesList from "../../components/charts/IssuesList";

const AnalyticsDashboard = ({ projectId }) => {
  // Memoize the chart cards
  const chartCards = useMemo(
    () => [
      {
        title: "Project Progress",
        component: <ProjectProgress projectId={projectId} />,
        icon: <BarChart3 className="w-5 h-5" />,
        description: "Overall project completion status",
        color: "from-blue-500 to-blue-600",
        delay: 0.1,
      },
      {
        title: "Task Status Overview",
        component: <TaskStatusPieChart projectId={projectId} />,
        icon: <PieChart className="w-5 h-5" />,
        description: "Distribution of task statuses",
        color: "from-green-500 to-green-600",
        delay: 0.2,
      },
      {
        title: "Team Performance",
        component: <TeamPerformance projectId={projectId} />,
        icon: <Users className="w-5 h-5" />,
        description: "Individual team member performance metrics",
        color: "from-purple-500 to-purple-600",
        fullWidth: true,
        delay: 0.3,
      },
      {
        title: "Task Assignment Distribution",
        component: <TaskDistribution projectId={projectId} />,
        icon: <Target className="w-5 h-5" />,
        description: "How tasks are distributed across team members",
        color: "from-orange-500 to-orange-600",
        fullWidth: true,
        delay: 0.4,
      },
      {
        title: "Deadlines & Milestones",
        component: <DeadlinesOverview projectId={projectId} />,
        icon: <Calendar className="w-5 h-5" />,
        description: "Upcoming deadlines and project milestones",
        color: "from-indigo-500 to-indigo-600",
        fullWidth: true,
        delay: 0.5,
      },
      {
        title: "Project Issues",
        component: <IssuesList projectId={projectId} />,
        icon: <AlertTriangle className="w-5 h-5" />,
        description: "Current issues and blockers requiring attention",
        color: "from-red-500 to-red-600",
        fullWidth: true,
        delay: 0.6,
      },
    ],
    [projectId]
  );

  // Memoize ChartCard
  const ChartCard = useMemo(
    () =>
      ({
        title,
        component,
        icon,
        description,
        color,
        fullWidth,
        delay,
      }) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay }}
          className={`card group hover:shadow-2xl transition-all duration-300 ${
            fullWidth
              ? "col-span-1 md:col-span-2 xl:col-span-3"
              : "col-span-1"
          }`}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {icon}
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark">
                  {title}
                </h2>
                <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-primary-100 dark:bg-brand-primary-800 text-brand-primary-700 dark:text-brand-primary-300">
                Live Data
              </span>
            </div>
          </div>

          {/* Chart Content */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 dark:to-gray-800/20 rounded-lg pointer-events-none" />
            <div className="relative z-10">{component}</div>
          </div>
        </motion.div>
      ),
    []
  );

  return (
    <div className="bg-bg-secondary-light dark:bg-bg-secondary-dark min-h-full w-full">
      <div className="p-2 xs:p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-2xl shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl xs:text-4xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark">
                Project Analytics
              </h1>
              <p className="text-base xs:text-lg text-txt-secondary-light dark:text-txt-secondary-dark">
                Comprehensive insights and performance metrics
              </p>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 xs:p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  PROGRESS
                </span>
              </div>
              <p className="text-lg xs:text-2xl font-bold text-blue-800 dark:text-blue-200">
                75%
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 xs:p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  TASKS
                </span>
              </div>
              <p className="text-lg xs:text-2xl font-bold text-green-800 dark:text-green-200">
                24/32
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-3 xs:p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  TEAM
                </span>
              </div>
              <p className="text-lg xs:text-2xl font-bold text-purple-800 dark:text-purple-200">
                8
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-3 xs:p-4 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                  DAYS LEFT
                </span>
              </div>
              <p className="text-lg xs:text-2xl font-bold text-orange-800 dark:text-orange-200">
                12
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {chartCards.map((card, index) => (
            <ChartCard key={`${card.title}-${projectId}`} {...card} />
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 p-3 xs:p-4 bg-bg-primary-light dark:bg-bg-primary-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
            <button className="text-sm text-brand-primary-600 dark:text-brand-primary-400 hover:text-brand-primary-700 dark:hover:text-brand-primary-300 font-medium transition-colors">
              Refresh Data
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
