import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import { useQuery, gql } from "@apollo/client";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bug,
  CheckCircle,
  Clock,
  User,
  TrendingUp,
  Activity,
  Hash,
  MessageSquare
} from "lucide-react";

const GET_PROJECT_ISSUES = gql`
  query GetProjectIssues($projectId: ID!) {
    getProjectIssues(projectId: $projectId) {
      taskId
      title
      assignedTo
      status
      remarks
    }
  }
`;

const STATUS_CONFIG = {
  "Open": {
    color: "#ef4444",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-700 dark:text-red-300",
    icon: AlertTriangle,
    badge: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
  },
  "In Progress": {
    color: "#f59e0b",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    textColor: "text-yellow-700 dark:text-yellow-300",
    icon: Clock,
    badge: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
  },
  "Resolved": {
    color: "#10b981",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-700 dark:text-green-300",
    icon: CheckCircle,
    badge: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
  }
};

const IssuesList = ({ projectId }) => {
  const { loading, error, data } = useQuery(GET_PROJECT_ISSUES, {
    variables: { projectId },
  });

  if (loading) {
    return (
      <div className="p-2 sm:p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-2 sm:p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Bug className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              Unable to Load Issues
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
              Error loading issues data. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const issues = data.getProjectIssues || [];
  if (issues.length === 0) {
    return (
      <div className="p-2 sm:p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-bg-accent-light dark:bg-bg-accent-dark rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark mb-2">
              No Issues Found
            </h3>
            <p className="text-txt-secondary-light dark:text-txt-secondary-dark">
              Great! No issues have been reported for this project.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Data aggregation (unchanged)
  const statusCounts = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(statusCounts).map(status => ({
    status,
    count: statusCounts[status],
    color: STATUS_CONFIG[status]?.color || "#6b7280"
  }));

  const totalIssues = issues.length;

  const assigneeCount = issues.reduce((acc, issue) => {
    acc[issue.assignedTo] = (acc[issue.assignedTo] || 0) + 1;
    return acc;
  }, {});

  const mostFrequentAssignee = Object.keys(assigneeCount).reduce(
    (a, b) => (assigneeCount[a] > assigneeCount[b] ? a : b),
    null
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-bg-primary-light dark:bg-bg-primary-dark p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-heading-primary-light dark:text-heading-primary-dark">
            {label}
          </p>
          <p className="text-lg font-bold" style={{ color: data.color }}>
            {data.value} issues
          </p>
          <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
            {((data.value / totalIssues) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-heading-primary-light dark:text-heading-primary-dark">
              Project Issues
            </h2>
            <p className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
              Track and manage project issues and blockers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="p-3 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-brand-primary-600" />
                <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                  Issues Summary
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-bg-accent-light dark:bg-bg-accent-dark rounded-lg">
                  <span className="text-txt-secondary-light dark:text-txt-secondary-dark">Total Issues</span>
                  <span className="text-2xl font-bold text-heading-primary-light dark:text-heading-primary-dark">
                    {totalIssues}
                  </span>
                </div>
                <div className="space-y-3">
                  {Object.keys(statusCounts).map((status, index) => {
                    const config = STATUS_CONFIG[status];
                    const IconComponent = config?.icon || Activity;
                    const percentage = ((statusCounts[status] / totalIssues) * 100).toFixed(1);
                    return (
                      <motion.div
                        key={status}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                        className={`p-3 rounded-lg ${config?.bgColor} border border-gray-200/50 dark:border-gray-700/50`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" style={{ color: config?.color }} />
                            <span className={`font-medium ${config?.textColor}`}>
                              {status}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-heading-primary-light dark:text-heading-primary-dark">
                              {statusCounts[status]}
                            </div>
                            <div className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                              {percentage}%
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                {mostFrequentAssignee && (
                  <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-primary-600" />
                      <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                        Most Active Assignee:
                      </span>
                      <span className="font-semibold text-brand-primary-600">
                        {mostFrequentAssignee}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          {/* Issues Chart (always full width on <640px) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="p-3 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-brand-secondary-600" />
                <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                  Issues Distribution
                </h3>
              </div>
              <div style={{ width: "100%", minHeight: 200, height: "auto" }}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="status" 
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-txt-primary-light dark:text-txt-primary-dark"
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-txt-primary-light dark:text-txt-primary-dark"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      name="Issue Count" 
                      radius={[4, 4, 0, 0]}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Issues Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card"
        >
          <div className="p-3 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bug className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-heading-primary-light dark:text-heading-primary-dark">
                Issues Details
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Task ID
                      </div>
                    </th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      Title
                    </th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assigned To
                      </div>
                    </th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      Status
                    </th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-txt-secondary-light dark:text-txt-secondary-dark">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Remarks
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue, index) => {
                    const config = STATUS_CONFIG[issue.status];
                    const IconComponent = config?.icon || Activity;
                    return (
                      <motion.tr
                        key={issue.taskId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-bg-accent-light dark:hover:bg-bg-accent-dark transition-colors"
                      >
                        <td className="py-3 px-2 sm:px-4">
                          <span className="font-mono text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                            {issue.taskId}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className="font-medium text-heading-primary-light dark:text-heading-primary-dark">
                            {issue.title}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className="text-txt-primary-light dark:text-txt-primary-dark">
                            {issue.assignedTo}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.badge || 'bg-gray-100 text-gray-800'}`}>
                            <IconComponent className="w-3 h-3 mr-1" />
                            {issue.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className="text-sm text-txt-secondary-light dark:text-txt-secondary-dark">
                            {issue.remarks || "No remarks"}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IssuesList;
