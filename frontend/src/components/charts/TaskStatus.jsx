import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery, gql } from "@apollo/client";
import { motion } from "framer-motion";
import { 
  PieChart as PieChartIcon, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Target,
  RotateCcw,
  Activity
} from "lucide-react";

// GraphQL Query
const GET_TASK_STATUS = gql`
  query GetTaskStatusBreakdown($projectId: ID!) {
    getTaskStatusBreakdown(projectId: $projectId) {
      statusBreakdown {
        toDo
        inProgress
        needsRevision
        completed
      }
    }
  }
`;

// Colors and icons mapping
const STATUS_CONFIG = {
  completed: { 
    color: "#10b981", 
    icon: CheckCircle, 
    label: "Completed",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200/50 dark:border-green-700/50"
  },
  inProgress: { 
    color: "#f59e0b", 
    icon: Clock, 
    label: "In Progress",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200/50 dark:border-yellow-700/50"
  },
  needsRevision: { 
    color: "#ef4444", 
    icon: RotateCcw, 
    label: "Needs Revision",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200/50 dark:border-red-700/50"
  },
  toDo: { 
    color: "#6b7280", 
    icon: Target, 
    label: "To Do",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-200/50 dark:border-gray-700/50"
  },
};

const TaskStatusPieChart = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_TASK_STATUS, {
    variables: { projectId },
  });

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
          </div>
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Unable to Load Task Status
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
              Error loading task status data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { statusBreakdown } = data.getTaskStatusBreakdown;
  
  // Convert data into an array format
  const chartData = Object.entries(statusBreakdown)
    .map(([status, count]) => ({
      status: STATUS_CONFIG[status]?.label || status,
      count,
      color: STATUS_CONFIG[status]?.color || "#8884d8",
      originalStatus: status,
    }))
    .filter((item) => item.count > 0);

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center">
            <PieChartIcon className="w-8 h-8 text-txt-secondary-light dark:text-txt-secondary-dark" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              No Tasks Yet
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
              Create tasks to see status breakdown.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalTasks = chartData.reduce((sum, item) => sum + item.count, 0);

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

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >


        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mb-6"
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Total Tasks in Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
              {totalTasks}
            </div>
            <div className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Total Tasks
            </div>
          </div>
        </motion.div>

        {/* Task Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          {chartData.map((item, index) => {
            const config = STATUS_CONFIG[item.originalStatus];
            const IconComponent = config?.icon || Activity;
            const percentage = ((item.count / totalTasks) * 100).toFixed(1);

            return (
              <motion.div
                key={item.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className={`p-4 rounded-xl ${config?.bgColor} border ${config?.borderColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg text-white shadow-sm"
                      style={{ backgroundColor: item.color }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-medium text-heading-primary-light dark:text-heading-primary-dark">
                        {item.status}
                      </span>
                      <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                        {percentage}% of total tasks
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.count}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 p-4 bg-bg-accent-light dark:bg-bg-accent-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-brand-primary-600" />
            <span className="text-sm font-medium text-heading-primary-light dark:text-heading-primary-dark">
              Status Summary
            </span>
          </div>
          <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
            {chartData.find(item => item.originalStatus === 'completed')?.count || 0} completed out of {totalTasks} total tasks
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TaskStatusPieChart;
