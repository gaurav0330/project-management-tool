import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  Activity,
  AlertCircle,
} from "lucide-react";

// GraphQL Query to Fetch Progress Data
const GET_PROJECT_PROGRESS = gql`
  query getProjectProgress($projectId: ID!) {
    getProjectProgress(projectId: $projectId) {
      totalTasks
      completedTasks
      progressPercentage
    }
  }
`;

const ProjectProgress = ({ projectId }) => {
  const { data, loading, error } = useQuery(GET_PROJECT_PROGRESS, {
    variables: { projectId },
  });

  // Loading state
  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          </div>

          {/* Chart skeleton */}
          <div className="w-full h-40 md:h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>

          {/* Progress bar skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 md:p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Unable to Load Progress
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
              Error fetching project progress data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { totalTasks, completedTasks, progressPercentage } = data.getProjectProgress;

  // Empty state
  if (totalTasks === 0) {
    return (
      <div className="p-4 md:p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-txt-secondary-light dark:text-txt-secondary-dark" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              No Tasks Yet
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
              Start by creating your first task to track progress.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const remainingTasks = totalTasks - completedTasks;
  const COLORS = ["#10b981", "#f59e0b"]; // Green for Completed, Orange for Remaining

  const chartData = [
    { name: "Completed", value: completedTasks },
    { name: "Remaining", value: remainingTasks },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-bg-primary-light dark:bg-bg-primary-dark p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark">
            {data.name}
          </p>
          <p className="text-lg font-bold" style={{ color: data.color }}>
            {data.value} tasks
          </p>
          <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
            {((data.value / totalTasks) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Progress status
  const getProgressStatus = () => {
    if (progressPercentage >= 100) return { label: "Completed", color: "text-success", icon: CheckCircle };
    if (progressPercentage >= 75) return { label: "Nearly Done", color: "text-success", icon: TrendingUp };
    if (progressPercentage >= 50) return { label: "On Track", color: "text-brand-primary-600", icon: Activity };
    if (progressPercentage >= 25) return { label: "In Progress", color: "text-warning", icon: Clock };
    return { label: "Getting Started", color: "text-txt-secondary-light dark:text-txt-secondary-dark", icon: Target };
  };

  const status = getProgressStatus();
  const StatusIcon = status.icon;

  return (
    <div className="p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress Overview */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-bg-accent-light to-bg-secondary-light dark:from-bg-accent-dark dark:to-bg-secondary-dark p-4 md:p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${status.color}`} />
              <span className={`font-medium ${status.color}`}>{status.label}</span>
            </div>
            <span className="text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-txt-secondary-light dark:text-txt-secondary-dark mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 w-full"
        >
          <div className="w-full h-44 xs:h-56 sm:h-64 md:h-72 lg:h-72 xl:h-80 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div className="bg-green-50 dark:bg-green-900/20 p-3 md:p-4 rounded-xl border border-green-200/50 dark:border-green-700/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-success uppercase tracking-wide">
                Completed
              </span>
            </div>
            <p className="text-2xl font-bold text-success">{completedTasks}</p>
            <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
              {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 md:p-4 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-xs font-medium text-warning uppercase tracking-wide">
                Remaining
              </span>
            </div>
            <p className="text-2xl font-bold text-warning">{remainingTasks}</p>
            <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
              {totalTasks > 0 ? ((remainingTasks / totalTasks) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-info" />
              <span className="text-xs font-medium text-info uppercase tracking-wide">
                Total
              </span>
            </div>
            <p className="text-2xl font-bold text-info">{totalTasks}</p>
            <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
              All project tasks
            </p>
          </div>
        </motion.div>

        {/* Progress Insights */}
        {progressPercentage > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 p-3 md:p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-brand-primary-600" />
              <span className="text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark">
                Progress Insight
              </span>
            </div>
            <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              {progressPercentage >= 100
                ? "🎉 Congratulations! All tasks have been completed."
                : progressPercentage >= 75
                ? "🚀 Great progress! You're almost there."
                : progressPercentage >= 50
                ? "💪 You're halfway through the project."
                : progressPercentage >= 25
                ? "📈 Good start! Keep up the momentum."
                : "🎯 Project has just begun. Time to make progress!"}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectProgress;
